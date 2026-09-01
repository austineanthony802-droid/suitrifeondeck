const toggleBtn = document.getElementById('contact-toggle-btn');
const contactForm = document.getElementById('contact-form');

toggleBtn.addEventListener('click', function () {
  const isHidden = contactForm.style.display === 'none';
  contactForm.style.display = isHidden ? 'block' : 'none';
});

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = document.getElementById('contact-submit-btn');
  const statusBox = document.getElementById('contact-status');

  statusBox.style.display = 'block';
  statusBox.className = 'contact-status sending';
  statusBox.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const formData = new FormData(contactForm);

  try {
    const response = await fetch('https://formspree.io/f/xwlkvbdr', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      statusBox.className = 'contact-status success';
      statusBox.textContent = 'Your message has been sent!';
      contactForm.reset();
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    statusBox.className = 'contact-status error';
    statusBox.textContent = 'Something went wrong. Please try again or email us directly.';
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Send';
});