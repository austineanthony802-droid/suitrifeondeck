function renderDeck(deckNumber) {
  const guestCount = sessionStorage.getItem('booking_guests') || '1';
  const deck = DECK_DATA[guestCount]?.[deckNumber];

  if (!deck) {
    document.getElementById('deck-map-title').innerHTML = 'DECK ' + deckNumber;
    document.getElementById('deck-map-svg-container').innerHTML = '<p style="padding:20px; text-align:center;">No data available for this deck.</p>';
    document.getElementById('cabin-detail-list').innerHTML = '';
    return;
  }

  document.getElementById('deck-map-title').innerHTML = deck.name.toUpperCase() + (deck.subtitle ? '<br><span id="deck-map-subtitle">' + deck.subtitle.toUpperCase() + '</span>' : '');

  const svgContainer = document.getElementById('deck-map-svg-container');
  const listContainer = document.getElementById('cabin-detail-list');

  if (deck.cabins.length === 0) {
    svgContainer.innerHTML = '<p style="padding:20px; text-align:center; color:#a93226; font-weight:600;">' + (deck.message || 'No cabins available.') + '</p>';
    listContainer.innerHTML = '';
    return;
  }

  let svg = '<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">';
  svg += '<rect x="5" y="5" width="90" height="210" rx="20" fill="#fff" stroke="#333" stroke-width="1"/>';

  const total = deck.cabins.length;
  const topMargin = 15, bottomMargin = 15;
  const usableHeight = 220 - topMargin - bottomMargin;
  const perSide = Math.ceil(total / 2);
  const spacing = usableHeight / perSide;

  deck.cabins.forEach((cabin, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const rowIndex = Math.floor(i / 2);
    const x = side === 'left' ? 12 : 84;
    const y = topMargin + (rowIndex * spacing);
    const catClass = classifyCabin(cabin.category, cabin.type);
    svg += `<rect class="cabin-dot ${catClass}" data-cabin="${cabin.number}" x="${x}" y="${y}" width="4" height="2.5" rx="0.5"></rect>`;
  });

  svg += '</svg>';
  svgContainer.innerHTML = svg;

  listContainer.innerHTML = '';
  deck.cabins.forEach(cabin => {
    const entry = document.createElement('div');
    entry.className = 'cabin-entry';
    entry.setAttribute('data-cabin', cabin.number);
    entry.innerHTML = `
      <div class="cabin-entry-title">${cabin.number} - ${cabin.category} - ${cabin.type}</div>
      <div class="cabin-entry-category">${cabin.occupancy} Occupancy $${cabin.price.toLocaleString()}.00</div>
    `;
    entry.addEventListener('click', () => selectCabin(cabin));
    listContainer.appendChild(entry);
  });

  svgContainer.querySelectorAll('.cabin-dot').forEach(dot => {
    dot.addEventListener('click', function () {
      const num = this.getAttribute('data-cabin');
      const cabin = deck.cabins.find(c => c.number === num);
      if (cabin) selectCabin(cabin);
    });
  });
}

function classifyCabin(category, type) {
  const t = (type || '').toLowerCase();
  if (t.includes('suite') || t.includes('aurea')) return 'aurea';
  if (t.includes('balcony')) return 'balcony';
  return 'window';
}

function selectCabin(cabin) {
  const modal = document.getElementById('cabin-modal-overlay');
  document.getElementById('cabin-modal-title').textContent = `${cabin.number} - ${cabin.category} - ${cabin.type}`;
  document.getElementById('cabin-modal-occupancy').textContent = `${cabin.occupancy} Occupancy`;
  document.getElementById('cabin-modal-price').textContent = `$${cabin.price.toLocaleString()}.00`;

  modal.style.display = 'flex';

  // Store the pending selection (not confirmed until "Add to Reservation" is clicked)
  modal.dataset.pendingCabin = JSON.stringify(cabin);
}

// Close modal
document.getElementById('cabin-modal-close')?.addEventListener('click', function () {
  document.getElementById('cabin-modal-overlay').style.display = 'none';
});

// Also close if clicking the dark overlay background (not the modal itself)
document.getElementById('cabin-modal-overlay')?.addEventListener('click', function (e) {
  if (e.target === this) {
    this.style.display = 'none';
  }
});

// Confirm add to reservation
document.getElementById('cabin-modal-add-btn')?.addEventListener('click', function () {
  const modal = document.getElementById('cabin-modal-overlay');
  const cabin = JSON.parse(modal.dataset.pendingCabin);

  sessionStorage.setItem('booking_cabin_number', cabin.number);
  sessionStorage.setItem('booking_cabin_category', cabin.category);
  sessionStorage.setItem('booking_cabin_type', cabin.type);
  sessionStorage.setItem('booking_cabin_price', cabin.price);
  sessionStorage.setItem('booking_cabin_occupancy', cabin.occupancy);

  modal.style.display = 'none';

  // Go straight to payment
  window.location.href = 'payment.html';
});