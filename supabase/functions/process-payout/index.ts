import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub as string;
    const body = await req.json();
    const { amount, method, destination } = body;

    if (!amount || !method || !destination) {
      return new Response(JSON.stringify({ error: "Missing required fields: amount, method, destination" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's wallet
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: wallet } = await adminClient
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet || wallet.available_balance < amount) {
      return new Response(JSON.stringify({ error: "Insufficient balance" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Deduct from wallet
    await adminClient
      .from("wallets")
      .update({ available_balance: wallet.available_balance - amount })
      .eq("id", wallet.id);

    // Create payout record
    const { data: payout, error: payoutErr } = await adminClient
      .from("payouts")
      .insert({
        user_id: userId,
        amount,
        method,
        destination,
        status: "processing",
      })
      .select()
      .single();

    if (payoutErr) throw payoutErr;

    // Create ledger entry
    await adminClient.from("ledger_entries").insert({
      wallet_id: wallet.id,
      type: "debit",
      amount,
      status: "confirmed",
      source: method === "crypto" ? "crypto" : method === "iban" ? "iban_payout" : "stripe",
      reference_id: payout.id,
      description: `${method.toUpperCase()} payout to ${destination.slice(0, 12)}...`,
    });

    // TODO: Execute actual payout based on method
    // For crypto: POST to exchange API (e.g., https://api.exchange.com/v1/withdrawals)
    //   { currency: "USDC", amount, address: destination }
    // For IBAN: POST to Qonto API (https://thirdparty.qonto.com/v2/transactions)
    //   { iban: destination, amount, currency: "EUR" }
    // For Stripe: POST to Stripe API (https://api.stripe.com/v1/transfers)
    //   { amount, currency: "eur", destination: stripeAccountId }

    return new Response(JSON.stringify({ success: true, payout }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Payout error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
