import { corsHeaders } from "../_shared/cors.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { authenticateCaller } from "../_shared/auth.ts";
import { TransactRequest } from "../_shared/types.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405);
  }

  try {
    const caller = await authenticateCaller(req);
    if (!caller) return jsonError("Missing or invalid authorization", 401);

    if (caller.app_role !== "parent") {
      return jsonError("Only parents can create transactions", 403);
    }

    const body: TransactRequest = await req.json();

    if (!body.account_id || typeof body.account_id !== "string") {
      return jsonError("account_id is required", 400);
    }
    if (body.type !== "deposit" && body.type !== "withdrawal") {
      return jsonError("type must be 'deposit' or 'withdrawal'", 400);
    }
    if (typeof body.amount !== "number" || !Number.isInteger(body.amount) || body.amount <= 0) {
      return jsonError("amount must be a positive integer (cents)", 400);
    }

    const supabase = createServiceClient();

    // Verify the account belongs to the caller's family
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id, family_id, balance")
      .eq("id", body.account_id)
      .single();

    if (accountError || !account) {
      return jsonError("Account not found", 404);
    }

    if (account.family_id !== caller.family_id) {
      return jsonError("Account does not belong to your family", 403);
    }

    // Determine the signed amount: deposits are positive, withdrawals negative
    const signedAmount = body.type === "deposit"
      ? body.amount
      : -body.amount;

    const { data: result, error: rpcError } = await supabase.rpc(
      "process_transaction",
      {
        p_account_id: body.account_id,
        p_type: body.type,
        p_amount: signedAmount,
        p_description: body.description || null,
        p_created_by: caller.profile_id,
      },
    );

    if (rpcError) {
      if (rpcError.message.includes("Insufficient balance")) {
        return jsonError("Insufficient balance for this withdrawal", 400);
      }
      console.error("process_transaction error:", rpcError);
      return jsonError("Failed to process transaction", 500);
    }

    const row = Array.isArray(result) ? result[0] : result;

    return new Response(
      JSON.stringify({
        transaction_id: row.transaction_id,
        new_balance: row.new_balance,
        type: body.type,
        amount: body.amount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("transact error:", err);
    return jsonError("Internal server error", 500);
  }
});

function jsonError(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
