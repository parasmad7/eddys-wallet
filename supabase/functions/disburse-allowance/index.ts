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
    const now = new Date().toISOString();

    // Fetch all active rules that are due
    const { data: rules, error: rulesError } = await supabase
      .from("allowance_rules")
      .select(`
        id,
        account_id,
        amount,
        frequency,
        day_of_week,
        day_of_month,
        next_run_at,
        accounts!inner ( profile_id )
      `)
      .eq("is_active", true)
      .lte("next_run_at", now);

    if (rulesError) {
      console.error("Failed to fetch allowance rules:", rulesError);
      return jsonError("Failed to fetch allowance rules", 500);
    }

    if (!rules || rules.length === 0) {
      return jsonResponse({ disbursements: 0, details: [] });
    }

    const details: Array<{
      rule_id: string;
      account_id: string;
      amount: number;
      new_balance: number;
    }> = [];

    const errors: Array<{ rule_id: string; error: string }> = [];

    for (const rule of rules) {
      const account = rule.accounts as unknown as { profile_id: string };

      // Process the allowance transaction atomically
      const { data: result, error: txnError } = await supabase.rpc(
        "process_transaction",
        {
          p_account_id: rule.account_id,
          p_type: "allowance",
          p_amount: rule.amount,
          p_description: `${capitalize(rule.frequency)} allowance`,
          p_created_by: account.profile_id,
        },
      );

      if (txnError) {
        console.error(`Allowance rule ${rule.id} failed:`, txnError);
        errors.push({ rule_id: rule.id, error: txnError.message });
        continue;
      }

      const row = Array.isArray(result) ? result[0] : result;

      // Advance next_run_at
      const nextRun = computeNextRun(
        new Date(rule.next_run_at),
        rule.frequency,
        rule.day_of_week,
        rule.day_of_month,
      );

      const { error: updateError } = await supabase
        .from("allowance_rules")
        .update({ next_run_at: nextRun.toISOString() })
        .eq("id", rule.id);

      if (updateError) {
        console.error(
          `Failed to advance next_run_at for rule ${rule.id}:`,
          updateError,
        );
      }

      details.push({
        rule_id: rule.id,
        account_id: rule.account_id,
        amount: rule.amount,
        new_balance: row.new_balance,
      });
    }

    return jsonResponse({
      disbursements: details.length,
      details,
      ...(errors.length > 0 ? { errors } : {}),
    });
  } catch (err) {
    console.error("disburse-allowance error:", err);
    return jsonError("Internal server error", 500);
  }
});

function computeNextRun(
  previousRun: Date,
  frequency: string,
  dayOfWeek: number | null,
  dayOfMonth: number | null,
): Date {
  const next = new Date(previousRun);

  switch (frequency) {
    case "daily":
      next.setUTCDate(next.getUTCDate() + 1);
      break;
    case "weekly":
      next.setUTCDate(next.getUTCDate() + 7);
      break;
    case "biweekly":
      next.setUTCDate(next.getUTCDate() + 14);
      break;
    case "monthly": {
      next.setUTCMonth(next.getUTCMonth() + 1);
      // Clamp to the target day (handles months with fewer days)
      if (dayOfMonth !== null) {
        const targetDay = Math.min(dayOfMonth, daysInMonth(next));
        next.setUTCDate(targetDay);
      }
      break;
    }
  }

  return next;
}

function daysInMonth(date: Date): number {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
