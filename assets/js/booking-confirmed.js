const cabinNumber = sessionStorage.getItem('booking_cabin_number');
const cabinCategory = sessionStorage.getItem('booking_cabin_category');
const cabinType = sessionStorage.getItem('booking_cabin_type');
const occupancy = sessionStorage.getItem('booking_cabin_occupancy');
const guests = sessionStorage.getItem('booking_guests');
const price = parseFloat(sessionStorage.getItem('booking_cabin_price'));

if (cabinNumber) {
  document.getElementById('confirm-cabin').textContent = `${cabinNumber} - ${cabinCategory} - ${cabinType} (${occupancy} Occupancy)`;
  document.getElementById('confirm-guests').textContent = guests + (guests === '1' ? ' Adult' : ' Adults');
  document.getElementById('confirm-total').textContent = '$' + price.toLocaleString() + '.00';
}

// Clear the booking session now that it's complete
sessionStorage.removeItem('booking_guests');
sessionStorage.removeItem('booking_deck');
sessionStorage.removeItem('booking_cabin_number');
sessionStorage.removeItem('booking_cabin_category');
sessionStorage.removeItem('booking_cabin_type');
sessionStorage.removeItem('booking_cabin_price');
sessionStorage.removeItem('booking_cabin_occupancy');