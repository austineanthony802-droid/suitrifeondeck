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