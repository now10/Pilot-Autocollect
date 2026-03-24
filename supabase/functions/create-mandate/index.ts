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
    const { customer_id } = body;

    if (!customer_id) {
      return new Response(JSON.stringify({ error: "customer_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TODO: Replace with real GoCardless API call
    // 1. Create redirect flow: POST https://api.gocardless.com/redirect_flows
    //    Headers: { Authorization: "Bearer GOCARDLESS_ACCESS_TOKEN", GoCardless-Version: "2015-07-06" }
    //    Body: {
    //      description: "SEPA Direct Debit Mandate",
    //      session_token: userId,
    //      success_redirect_url: "https://your-app.com/mandates/callback",
    //      scheme: "sepa_core"
    //    }
    // 2. Return the redirect_url from the response for customer authorization
    // 3. On callback, complete the redirect flow:
    //    POST https://api.gocardless.com/redirect_flows/:id/actions/complete
    //    This creates the mandate and returns the mandate ID

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get customer's business
    const { data: customer } = await adminClient
      .from("customers")
      .select("business_id")
      .eq("id", customer_id)
      .single();

    if (!customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create mandate record (mock - in production this comes from GoCardless webhook)
    const { data: mandate, error } = await adminClient.from("mandates").insert({
      customer_id,
      business_id: customer.business_id,
      status: "pending",
      gocardless_id: `MD_${Date.now()}`,
    }).select().single();

    if (error) throw error;

    // In production, return the GoCardless redirect URL
    return new Response(JSON.stringify({
      success: true,
      mandate,
      // approval_url: redirectFlow.redirect_url  // from GoCardless
      approval_url: "https://pay.gocardless.com/obp/mock-redirect" // placeholder
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Mandate creation error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
