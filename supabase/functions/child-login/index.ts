import { corsHeaders } from "../_shared/cors.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { createChildJwt } from "../_shared/auth.ts";
import { ChildLoginRequest } from "../_shared/types.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const body: ChildLoginRequest = await req.json();

    if (!body.family_code || typeof body.family_code !== "string") {
      return jsonError("family_code is required", 400);
    }
    if (!body.pin || typeof body.pin !== "string") {
      return jsonError("pin is required", 400);
    }

    const familyCode = body.family_code.trim().toUpperCase();
    const pin = body.pin.trim();

    if (!/^\d{4,6}$/.test(pin)) {
      return jsonError("PIN must be 4-6 digits", 400);
    }

    const supabase = createServiceClient();

    // Rate-limit check: count recent failed attempts for this family code
    const windowStart = new Date(
      Date.now() - WINDOW_MINUTES * 60 * 1000,
    ).toISOString();

    const { count: attemptCount } = await supabase
      .from("login_attempts")
      .select("*", { count: "exact", head: true })
      .eq("family_code", familyCode)
      .gte("attempted_at", windowStart);

    if (attemptCount !== null && attemptCount >= MAX_ATTEMPTS) {
      return jsonError(
        "Too many login attempts. Please try again later.",
        429,
      );
    }

    // Look up the family
    const { data: family, error: familyError } = await supabase
      .from("families")
      .select("id")
      .eq("family_code", familyCode)
      .single();

    if (familyError || !family) {
      await recordFailedAttempt(supabase, familyCode);
      return jsonError("Invalid family code or PIN", 401);
    }

    // Look up child profiles in this family
    const { data: children, error: childrenError } = await supabase
      .from("profiles")
      .select("id, pin_hash")
      .eq("family_id", family.id)
      .eq("role", "child")
      .not("pin_hash", "is", null);

    if (childrenError || !children || children.length === 0) {
      await recordFailedAttempt(supabase, familyCode);
      return jsonError("Invalid family code or PIN", 401);
    }

    // Compare PIN against each child's hash
    let matchedProfile: { id: string } | null = null;
    for (const child of children) {
      const matches = await bcrypt.compare(pin, child.pin_hash);
      if (matches) {
        matchedProfile = child;
        break;
      }
    }

    if (!matchedProfile) {
      await recordFailedAttempt(supabase, familyCode);
      return jsonError("Invalid family code or PIN", 401);
    }

    // Clean up old attempts on successful login
    await supabase
      .from("login_attempts")
      .delete()
      .eq("family_code", familyCode)
      .lt("attempted_at", windowStart);

    const token = await createChildJwt(matchedProfile.id, family.id);

    return new Response(
      JSON.stringify({ token }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("child-login error:", err);
    return jsonError("Internal server error", 500);
  }
});

async function recordFailedAttempt(
  supabase: ReturnType<typeof createServiceClient>,
  familyCode: string,
) {
  await supabase.from("login_attempts").insert({ family_code: familyCode });
}

function jsonError(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
