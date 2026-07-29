import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { createServiceClient } from "./supabase.ts";

export interface CallerContext {
  app_role: "parent" | "child";
  profile_id: string;
  family_id: string;
  auth_user_id?: string;
}

async function getSigningKey(): Promise<CryptoKey> {
  const secret = Deno.env.get("SUPABASE_JWT_SECRET")!;
  return await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createChildJwt(
  profileId: string,
  familyId: string,
): Promise<string> {
  const key = await getSigningKey();
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: "authenticated",
    role: "authenticated",
    sub: profileId,
    app_role: "child",
    profile_id: profileId,
    family_id: familyId,
    iat: now,
    exp: now + 60 * 60 * 8, // 8 hours
  };
  return await create({ alg: "HS256", typ: "JWT" }, payload, key);
}

export async function verifyJwt(
  token: string,
): Promise<Record<string, unknown>> {
  const key = await getSigningKey();
  return (await verify(token, key)) as Record<string, unknown>;
}

export function extractBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7);
}

export function isServiceRole(req: Request): boolean {
  const token = extractBearerToken(req);
  return token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
}

export async function authenticateCaller(
  req: Request,
): Promise<CallerContext | null> {
  const token = extractBearerToken(req);
  if (!token) return null;

  try {
    const payload = await verifyJwt(token);

    // Child JWT (custom-issued by child-login)
    if (payload.app_role === "child") {
      return {
        app_role: "child",
        profile_id: payload.profile_id as string,
        family_id: payload.family_id as string,
      };
    }

    // Parent JWT (Supabase Auth) - look up profile by auth user ID
    const authUserId = payload.sub as string;
    if (!authUserId) return null;

    const supabase = createServiceClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, family_id, role")
      .eq("auth_user_id", authUserId)
      .eq("role", "parent")
      .single();

    if (!profile) return null;

    return {
      app_role: "parent",
      profile_id: profile.id,
      family_id: profile.family_id,
      auth_user_id: authUserId,
    };
  } catch {
    return null;
  }
}
