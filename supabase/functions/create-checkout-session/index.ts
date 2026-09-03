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

    // Create the NOWPayments invoice
    const nowpaymentsApiKey = Deno.env.get("NOWPAYMENTS_API_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://127.0.0.1:5500";

    const nowResponse = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": nowpaymentsApiKey ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: total_price,
        price_currency: "usd",
        order_id: booking.id.toString(),
        order_description: `Cabin ${cabin_number} - ${cabin_category} - ${cabin_type} - ${occupancy} Occupancy`,
        ipn_callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-payment`,
        success_url: `${siteUrl}/booking-confirmed.html`,
        cancel_url: `${siteUrl}/payment.html`,
      }),
    });

    const nowData = await nowResponse.json();

    if (!nowResponse.ok) {
      console.error("NOWPayments error:", nowData);
      return new Response(JSON.stringify({ error: "Could not create payment session." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save NOWPayments' invoice ID onto the booking
    await supabase
      .from("bookings")
      .update({ payment_charge_id: nowData.id.toString() })
      .eq("id", booking.id);

    return new Response(JSON.stringify({ url: nowData.invoice_url }), {
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