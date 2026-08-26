import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id, guest_count, cabin_number, cabin_category, cabin_type, occupancy, total_price } = await req.json();

    if (!user_id || !cabin_number || !total_price) {
      return new Response(JSON.stringify({ error: "Missing required booking details." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a Supabase client using the service role key (server-side only, safe here)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Insert a pending booking record first
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        user_id,
        guest_count,
        cabin_number,
        cabin_category,
        cabin_type,
        occupancy,
        total_price,
        payment_status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Could not create booking record." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create the CoinGate order
    const coingateApiKey = Deno.env.get("COINGATE_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://127.0.0.1:5500";

    const coingateResponse = await fetch("https://api-sandbox.coingate.com/api/v2/orders", {
      method: "POST",
      headers: {
        "Authorization": `Token ${coingateApiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        order_id: booking.id.toString(),
        price_amount: total_price.toString(),
        price_currency: "USD",
        receive_currency: "USD",
        title: `Cabin ${cabin_number} - Suite Rife on Deck 2027`,
        description: `${cabin_category} - ${cabin_type} - ${occupancy} Occupancy`,
        callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-payment`,
        success_url: `${siteUrl}/booking-confirmed.html`,
        cancel_url: `${siteUrl}/payment.html`,
      }),
    });

    const coingateData = await coingateResponse.json();

    if (!coingateResponse.ok) {
      console.error("CoinGate error:", coingateData);
      return new Response(JSON.stringify({ error: "Could not create payment session." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save CoinGate's order ID onto the booking
    await supabase
      .from("bookings")
      .update({ payment_charge_id: coingateData.id.toString() })
      .eq("id", booking.id);

    return new Response(JSON.stringify({ url: coingateData.payment_url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});