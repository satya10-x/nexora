import renderLayout from './layout.js';

/**
 * Server-rendered HTML string for the Forgot Password Page.
 * @returns {string} HTML string
 */
export const renderForgotPage = () => {
  const content = `
  <div class="auth-wrapper">
    <div id="forgot-container" class="login-card">
      <h1 id="page-title">Reset your password</h1>
      <p class="auth-subtext">Enter your registered email address and we will send you a password recovery link.</p>

      <form id="forgot-form" novalidate>
        <div class="form-group">
          <label for="forgot-email">Email</label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            class="input-field"
            placeholder="you@example.com"
            required
            data-testid="forgot-email-input"
          />
        </div>

        <div id="forgot-error" class="error-box" role="alert" hidden></div>
        <div id="forgot-success" class="success-box" role="status" hidden>
          If this email exists, a reset link has been sent.
        </div>

        <button id="send-reset-btn" type="submit" class="btn btn-primary" data-testid="send-reset-btn">
          Send reset link
        </button>

        <a href="/login" class="link back-to-login">← Back to Sign in</a>
      </form>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('forgot-form');
      const emailInput = document.getElementById('forgot-email');
      const errorBox = document.getElementById('forgot-error');
      const successBox = document.getElementById('forgot-success');
      const submitBtn = document.getElementById('send-reset-btn');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.hidden = true;
        successBox.hidden = true;

        const email = emailInput.value.trim();
        if (!email) {
          errorBox.textContent = 'Please enter your email address.';
          errorBox.hidden = false;
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
          const res = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();
          if (data.success) {
            successBox.textContent = data.message || 'If this email exists, a reset link has been sent.';
            successBox.hidden = false;
            form.reset();
          } else {
            errorBox.textContent = data.message || 'Failed to process request.';
            errorBox.hidden = false;
          }
        } catch (err) {
          errorBox.textContent = 'Network error. Please try again.';
          errorBox.hidden = false;
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send reset link';
        }
      });
    });
  </script>
  `;

  return renderLayout({
    title: 'Forgot Password',
    content,
  });
};

export default renderForgotPage;

