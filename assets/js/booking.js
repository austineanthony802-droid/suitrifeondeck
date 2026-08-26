const guestButtons = document.querySelectorAll('.guest-btn');
const screenGuests = document.getElementById('screen-guests');
const screenCategories = document.getElementById('screen-categories');
const aureaRow = document.getElementById('aurea-suite-row');
const startOverBtn = document.getElementById('start-over-btn');

let selectedGuests = null;
let selectedDeck = null;

// Step 1 -> Step 2: guest count selected
guestButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    selectedGuests = this.getAttribute('data-guests');
    sessionStorage.setItem('booking_guests', selectedGuests);

    // Show Aurea Suites only for 2-4 guests
    aureaRow.style.display = (selectedGuests === '1') ? 'none' : 'flex';

    screenGuests.style.display = 'none';
    screenCategories.style.display = 'block';
    window.scrollTo(0, 0);
  });
});

// Start Over: back to guest selection
startOverBtn.addEventListener('click', function (e) {
  e.preventDefault();
  screenCategories.style.display = 'none';
  screenGuests.style.display = 'block';
  selectedGuests = null;
  selectedDeck = null;
  sessionStorage.removeItem('booking_guests');
  window.scrollTo(0, 0);
});

// Deck selection (placeholder — next screen not built yet)
document.querySelectorAll('.deck-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    selectedDeck = this.getAttribute('data-deck');
    sessionStorage.setItem('booking_deck', selectedDeck);

    screenCategories.style.display = 'none';
    document.getElementById('screen-deck').style.display = 'block';
    renderDeck(selectedDeck);
    window.scrollTo(0, 0);
  });
});

// Cabin type selection (placeholder — next screen not built yet)
document.querySelectorAll('.cabin-select-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const cabinType = this.getAttribute('data-cabin');
    sessionStorage.setItem('booking_cabin_type', cabinType);
    console.log('Selected cabin type:', cabinType);
    // Next screen (cabin description/list) will go here
  });
});