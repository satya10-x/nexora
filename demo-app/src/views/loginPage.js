import renderLayout from './layout.js';

/**
 * Server-rendered HTML string for the ShopEase Login Page.
 * Evaluates in-memory mutation and bug toggles to render baseline or mutated DOM.
 * @param {object} options
 * @param {object} [options.mutations] - Active mutation flags
 * @param {object} [options.bugs] - Active bug flags
 * @returns {string} HTML string
 */
export const renderLoginPage = ({ mutations = {}, bugs = {} } = {}) => {
  const {
    idRename = false,
    labelChange = false,
    classChange = false,
    wrapperChange = false,
    positionSwap = false,
    removeTestIds = false,
  } = mutations;

  const {
    bugBrokenForgotLink = false,
  } = bugs;

  // IDs according to idRename
  const emailInputId = idRename ? 'user-email' : 'email-input';
  const passwordInputId = idRename ? 'user-pass' : 'password-input';
  const loginBtnId = idRename ? 'signin-btn' : 'login-btn';
  const errorMsgId = idRename ? 'form-error' : 'error-message';
  const forgotLinkId = idRename ? 'reset-link' : 'forgot-link';

  // Text according to labelChange
  const headingText = labelChange ? 'Welcome to ShopEase' : 'Sign in to ShopEase';
  const emailLabel = labelChange ? 'Email address' : 'Email';
  const passwordLabel = labelChange ? 'Your password' : 'Password';
  const loginBtnText = labelChange ? 'Sign In' : 'Login';
  const forgotLinkText = labelChange ? 'Reset password' : 'Forgot Password?';

  // CSS classes according to classChange
  const inputClass = classChange ? 'form-control' : 'input-field';
  const btnClass = classChange ? 'btn btn-action' : 'btn btn-primary';
  const errorClass = classChange ? 'alert-danger' : 'error-box';
  const linkClass = classChange ? 'text-link' : 'link';

  // Link target according to bugBrokenForgotLink
  const forgotHref = bugBrokenForgotLink ? '/forgot-password-broken' : '/forgot-password';

  // Helper to optionally emit data-testid
  const testIdAttr = (val) => (removeTestIds ? '' : ` data-testid="${val}"`);

  // Email form-group
  const emailLabelHtml = `<label for="${emailInputId}">${emailLabel}</label>`;
  const emailInputHtml = `<input id="${emailInputId}" name="email" type="email" class="${inputClass}" placeholder="you@example.com"${testIdAttr('email-field')} />`;
  const emailFieldContent = wrapperChange
    ? `<div class="field-wrap"><div class="field-inner">${emailLabelHtml}\n        ${emailInputHtml}</div></div>`
    : `${emailLabelHtml}\n      ${emailInputHtml}`;
  const emailGroupHtml = `<div class="form-group">\n      ${emailFieldContent}\n    </div>`;

  // Password form-group
  const passwordLabelHtml = `<label for="${passwordInputId}">${passwordLabel}</label>`;
  const passwordInputHtml = `<input id="${passwordInputId}" name="password" type="password" class="${inputClass}" placeholder="Enter your password"${testIdAttr('password-field')} />`;
  const passwordFieldContent = wrapperChange
    ? `<div class="field-wrap"><div class="field-inner">${passwordLabelHtml}\n        ${passwordInputHtml}</div></div>`
    : `${passwordLabelHtml}\n      ${passwordInputHtml}`;
  const passwordGroupHtml = `<div class="form-group">\n      ${passwordFieldContent}\n    </div>`;

  // Error box
  const errorBoxHtml = `<div id="${errorMsgId}" class="${errorClass}" role="alert"${testIdAttr('login-error')} hidden></div>`;

  // Button
  const buttonHtml = `<button id="${loginBtnId}" type="submit" class="${btnClass}"${testIdAttr('login-submit')}>${loginBtnText}</button>`;
  const buttonWrapped = wrapperChange
    ? `<div class="actions-row">${buttonHtml}</div>`
    : buttonHtml;

  // Forgot password link
  const forgotLinkHtml = `<a id="${forgotLinkId}" href="${forgotHref}" class="${linkClass}"${testIdAttr('forgot-link')}>${forgotLinkText}</a>`;

  // Order of form children based on positionSwap:
  // Baseline: email -> password -> errorBox -> button -> forgotLink
  // Swapped: errorBox -> email -> password -> forgotLink -> button
  let formBodyHtml = '';
  if (positionSwap) {
    formBodyHtml = `
    ${errorBoxHtml}
    ${emailGroupHtml}
    ${passwordGroupHtml}
    ${forgotLinkHtml}
    ${buttonWrapped}`;
  } else {
    formBodyHtml = `
    ${emailGroupHtml}
    ${passwordGroupHtml}
    ${errorBoxHtml}
    ${buttonWrapped}
    ${forgotLinkHtml}`;
  }

  const content = `
  <div class="auth-wrapper">
    <div id="login-container" class="login-card">
      <h1 id="page-title">${headingText}</h1>
      <form id="login-form" novalidate>
        ${formBodyHtml}
      </form>
    </div>
  </div>

  <script>
    window.__BUGS__ = ${JSON.stringify(bugs)};
    window.__MUTATIONS__ = ${JSON.stringify(mutations)};
  </script>
  `;

  return renderLayout({
    title: 'Sign In',
    content,
    scripts: ['/public/login.js'],
  });
};

export default renderLoginPage;

