// ShopEase Robust Vanilla JS Login Controller
// Uses structural and role-based locators to survive all DOM mutations
document.addEventListener('DOMContentLoaded', () => {
  const bugs = window.__BUGS__ || {};

  // Find form elements resiliently
  const form = document.getElementById('login-form') || document.querySelector('form');
  if (!form) return;

  const emailInput =
    form.querySelector('input[type="email"]') ||
    form.querySelector('input[name="email"]');

  const passwordInput =
    form.querySelector('input[type="password"]') ||
    form.querySelector('input[name="password"]');

  const submitBtn =
    form.querySelector('button[type="submit"]') ||
    form.querySelector('button');

  const errorBox =
    form.querySelector('[role="alert"]') ||
    document.querySelector('[role="alert"]') ||
    form.querySelector('.error-box, .alert-danger');

  const showError = (message) => {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
    errorBox.removeAttribute('hidden');
  };

  const hideError = () => {
    if (!errorBox) return;
    errorBox.textContent = '';
    errorBox.hidden = true;
    errorBox.setAttribute('hidden', '');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    // Bug toggle: bugNoEmailValidation skips client-side email required check
    if (!bugs.bugNoEmailValidation) {
      if (!email) {
        showError('Email is required');
        if (emailInput) emailInput.focus();
        return;
      }
    }

    // Password required check
    if (!password) {
      showError('Password is required');
      if (passwordInput) passwordInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Bug toggle: bugNoRedirectAfterLogin stays on /login with no navigation
        if (bugs.bugNoRedirectAfterLogin) {
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        window.location = '/dashboard';
      } else {
        // Bug toggle: bugNoErrorOnWrongPassword suppresses error completely
        if (bugs.bugNoErrorOnWrongPassword || data.suppressError) {
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        const message = data.message || 'Invalid credentials';
        showError(message);
      }
    } catch (err) {
      if (!bugs.bugNoErrorOnWrongPassword) {
        showError('Unable to connect to server. Please try again.');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
});

