import { corsHeaders } from "../_shared/cors.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { authenticateCaller } from "../_shared/auth.ts";
import { TransferRequest } from "../_shared/types.ts";

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

    const body: TransferRequest = await req.json();

    if (!body.from_account_id || typeof body.from_account_id !== "string") {
      return jsonError("from_account_id is required", 400);
    }
    if (!body.to_account_id || typeof body.to_account_id !== "string") {
      return jsonError("to_account_id is required", 400);
    }
    if (body.from_account_id === body.to_account_id) {
      return jsonError("Cannot transfer to the same account", 400);
    }
    if (typeof body.amount !== "number" || !Number.isInteger(body.amount) || body.amount <= 0) {
      return jsonError("amount must be a positive integer (cents)", 400);
    }

    const supabase = createServiceClient();

    // Fetch both accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("accounts")
      .select("id, profile_id, family_id")
      .in("id", [body.from_account_id, body.to_account_id]);

    if (accountsError || !accounts || accounts.length !== 2) {
      return jsonError("One or both accounts not found", 404);
    }

    const fromAccount = accounts.find((a) => a.id === body.from_account_id)!;
    const toAccount = accounts.find((a) => a.id === body.to_account_id)!;

    if (caller.app_role === "child") {
      // Children can only transfer between their own accounts
      if (
        fromAccount.profile_id !== caller.profile_id ||
        toAccount.profile_id !== caller.profile_id
      ) {
        return jsonError(
          "Children can only transfer between their own accounts",
          403,
        );
      }
    } else {
      // Parents can transfer between any accounts in their family
      if (
        fromAccount.family_id !== caller.family_id ||
        toAccount.family_id !== caller.family_id
      ) {
        return jsonError(
          "Both accounts must belong to your family",
          403,
        );
      }
    }

    const description = body.description || "Transfer between accounts";

    const { data: result, error: rpcError } = await supabase.rpc(
      "process_transfer",
      {
        p_from_account_id: body.from_account_id,
        p_to_account_id: body.to_account_id,
        p_amount: body.amount,
        p_description: description,
        p_created_by: caller.profile_id,
      },
    );

    if (rpcError) {
      if (rpcError.message.includes("Insufficient balance")) {
        return jsonError("Insufficient balance in source account", 400);
      }
      console.error("process_transfer error:", rpcError);
      return jsonError("Failed to process transfer", 500);
    }

    const row = Array.isArray(result) ? result[0] : result;

    return new Response(
      JSON.stringify({
        debit_transaction_id: row.debit_transaction_id,
        credit_transaction_id: row.credit_transaction_id,
        from_new_balance: row.from_new_balance,
        to_new_balance: row.to_new_balance,
        amount: body.amount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("transfer error:", err);
    return jsonError("Internal server error", 500);
  }
});

function jsonError(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
