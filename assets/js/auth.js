// Check if user just confirmed their email
if (window.location.hash.includes('type=signup') || window.location.hash.includes('access_token')) {
  const confirmBox = document.createElement('div');
  confirmBox.className = 'auth-success';
  confirmBox.textContent = 'Your email has been verified! You can now log in.';
  const loginSection = document.querySelector('#login-section .wrapper');
  if (loginSection) {
    loginSection.insertBefore(confirmBox, loginSection.querySelector('form'));
  }
}

// Login form handler
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error');
    errorBox.style.display = 'none';

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      errorBox.textContent = error.message;
      errorBox.style.display = 'block';
      return;
    }

    // Successful login — redirect to homepage or dashboard
    window.location.href = 'index.html';
  });
}

// Register form handler
const registerForm = document.getElementById('register-form');

if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const firstName = document.getElementById('register-first-name').value;
    const lastName = document.getElementById('register-last-name').value;

    const errorBox = document.getElementById('register-error');
    const successBox = document.getElementById('register-success');
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (error) {
      errorBox.textContent = error.message;
      errorBox.style.display = 'block';
      return;
    }

    successBox.textContent = 'Account created! Please check your email to confirm your account.';
    successBox.style.display = 'block';
    registerForm.reset();
  });
}