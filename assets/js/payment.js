// Populate order summary from sessionStorage
const guests = sessionStorage.getItem('booking_guests') || '1';
const cabinNumber = sessionStorage.getItem('booking_cabin_number');
const cabinCategory = sessionStorage.getItem('booking_cabin_category');
const cabinType = sessionStorage.getItem('booking_cabin_type');
const occupancy = sessionStorage.getItem('booking_cabin_occupancy');
const price = parseFloat(sessionStorage.getItem('booking_cabin_price'));

if (!cabinNumber || !price) {
  // No valid booking in progress — send back to start
  window.location.href = 'booking.html';
}

document.getElementById('summary-guests').textContent = guests + (guests === '1' ? ' Adult' : ' Adults');
document.getElementById('summary-cabin').textContent = `${cabinNumber} - ${cabinCategory} - ${cabinType} (${occupancy} Occupancy)`;
document.getElementById('summary-total').textContent = '$' + price.toLocaleString() + '.00';

document.getElementById('pay-now-btn').addEventListener('click', async function () {
  const btn = this;
  const errorBox = document.getElementById('payment-error');
  errorBox.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Redirecting to secure payment...';

  // Confirm user is logged in
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    errorBox.textContent = 'Please log in before completing payment.';
    errorBox.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Pay Now';
    return;
  }

  try {
    const { data, error } = await supabaseClient.functions.invoke('create-checkout-session', {
      body: {
        user_id: user.id,
        guest_count: parseInt(guests),
        cabin_number: cabinNumber,
        cabin_category: cabinCategory,
        cabin_type: cabinType,
        occupancy: occupancy,
        total_price: price
      }
    });

    if (error) throw error;

    // Redirect to Stripe's hosted checkout page
    window.location.href = data.url;

  } catch (err) {
    errorBox.textContent = 'Something went wrong starting payment. Please try again.';
    errorBox.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Pay Now';
    console.error(err);
  }
});