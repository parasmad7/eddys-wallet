import { corsHeaders } from "../_shared/cors.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { isServiceRole } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405);
  }

  if (!isServiceRole(req)) {
    return jsonError("Service role authorization required", 403);
  }

  try {
    const supabase = createServiceClient();
    const now = new Date();

    // Fetch active interest configs with their account data
    const { data: configs, error: configsError } = await supabase
      .from("interest_configs")
      .select(`
        id,
        account_id,
        annual_rate_bps,
        compound_frequency,
        accounts!inner ( balance, profile_id )
      `)
      .eq("is_active", true);

    if (configsError) {
      console.error("Failed to fetch interest configs:", configsError);
      return jsonError("Failed to fetch interest configs", 500);
    }

    if (!configs || configs.length === 0) {
      return jsonResponse({ accruals: 0, details: [] });
    }

    const details: Array<{
      config_id: string;
      account_id: string;
      interest_amount: number;
      new_balance: number;
    }> = [];

    const errors: Array<{ config_id: string; error: string }> = [];

    for (const config of configs) {
      const account = config.accounts as unknown as {
        balance: number;
        profile_id: string;
      };

      if (account.balance <= 0) continue;

      const interest = calculateInterest(
        account.balance,
        config.annual_rate_bps,
        config.compound_frequency,
      );

      // Skip if interest rounds to zero
      if (interest === 0) continue;

      const { data: result, error: txnError } = await supabase.rpc(
        "process_transaction",
        {
          p_account_id: config.account_id,
          p_type: "interest",
          p_amount: interest,
          p_description: `Interest accrual (${bpsToPercent(config.annual_rate_bps)}% APR, ${config.compound_frequency})`,
          p_created_by: account.profile_id,
        },
      );

      if (txnError) {
        console.error(
          `Interest accrual for config ${config.id} failed:`,
          txnError,
        );
        errors.push({ config_id: config.id, error: txnError.message });
        continue;
      }

      const row = Array.isArray(result) ? result[0] : result;

      details.push({
        config_id: config.id,
        account_id: config.account_id,
        interest_amount: interest,
        new_balance: row.new_balance,
      });
    }

    return jsonResponse({
      accruals: details.length,
      details,
      ...(errors.length > 0 ? { errors } : {}),
    });
  } catch (err) {
    console.error("accrue-interest error:", err);
    return jsonError("Internal server error", 500);
  }
});

function calculateInterest(
  balanceCents: number,
  annualRateBps: number,
  compoundFrequency: string,
): number {
  // Convert basis points to a decimal rate: 500 bps = 0.05
  const annualRate = annualRateBps / 10_000;

  let periodsPerYear: number;
  switch (compoundFrequency) {
    case "daily":
      periodsPerYear = 365;
      break;
    case "weekly":
      periodsPerYear = 52;
      break;
    case "monthly":
      periodsPerYear = 12;
      break;
    default:
      periodsPerYear = 12;
  }

  const periodRate = annualRate / periodsPerYear;
  const interestCents = Math.round(balanceCents * periodRate);

  return interestCents;
}

function bpsToPercent(bps: number): string {
  return (bps / 100).toFixed(2);
}

function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function jsonError(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
