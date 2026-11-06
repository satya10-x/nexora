import renderLayout from './layout.js';

/**
 * Server-rendered HTML string for the SentinelQA Demo App Control Panel.
 * @returns {string} HTML string
 */
export const renderControlPage = () => {
  const content = `
  <div class="control-wrapper">
    <div class="control-header">
      <div>
        <div class="control-badge-row">
          <span class="badge badge-purple">Testing Instrument</span>
          <span id="version-badge" class="badge badge-slate">State Version: #1</span>
        </div>
        <h1 class="control-title">DOM Mutation & Bug Simulator</h1>
        <p class="control-subtitle">
          Toggle runtime DOM mutations to test SentinelQA's self-healing locator capabilities, or inject defect behaviors to verify bug detection.
        </p>
      </div>

      <div class="control-actions">
        <button id="btn-reset-all" class="btn btn-secondary">
          <span>🔄</span> Reset All
        </button>
        <button id="btn-randomize-mutations" class="btn btn-secondary">
          <span>🎲</span> Randomize 2 Mutations
        </button>
        <a href="/login" target="_blank" class="btn btn-primary btn-open-target">
          <span>↗</span> Open Login Page
        </a>
      </div>
    </div>

    <!-- Section 1: UI Mutations -->
    <section class="control-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">🧬</span> UI DOM Mutations
        </h2>
        <span class="section-desc">Simulates developer code updates that break rigid locators (XPath/CSS/IDs)</span>
      </div>

      <div class="toggles-grid">
        <!-- idRename -->
        <div class="toggle-card">
          <div class="toggle-info">
            <span class="toggle-name">ID Renaming (<code>idRename</code>)</span>
            <p class="toggle-desc">Renames <code>#email-input</code> → <code>#user-email</code>, <code>#password-input</code> → <code>#user-pass</code>, <code>#login-btn</code> → <code>#signin-btn</code>, etc.</p>
          </div>
          <label class="switch">
            <input type="checkbox" data-type="mutation" data-key="idRename" id="toggle-idRename">
            <span class="slider"></span>
          </label>
        </div>

        <!-- labelChange -->
        <div class="toggle-card">
          <div class="toggle-info">
            <span class="toggle-name">Label & Text Changes (<code>labelChange</code>)</span>
            <p class="toggle-desc">Changes "Login" → "Sign In", "Email" → "Email address", heading "Sign in to ShopEase" → "Welcome to ShopEase", etc.</p>
          </div>
          <label class="switch">
            <input type="checkbox" data-type="mutation" data-key="labelChange" id="toggle-labelChange">
            <span class="slider"></span>
          </label>
        </div>

        <!-- classChange -->
        <div class="toggle-card">
          <div class="toggle-info">
            <span class="toggle-name">CSS Class Changes (<code>classChange</code>)</span>
            <p class="toggle-desc">Changes <code>.btn-primary</code> → <code>.btn-action</code>, <code>.input-field</code> → <code>.form-control</code>, <code>.error-box</code> → <code>.alert-danger</code>.</p>
          </div>
          <label class="switch">
            <input type="checkbox" data-type="mutation" data-key="classChange" id="toggle-classChange">
            <span class="slider"></span>
          </label>
        </div>

        <!-- wrapperChange -->
        <div class="toggle-card">
          <div class="toggle-info">
            <span class="toggle-name">DOM Hierarchy Wrapping (<code>wrapperChange</code>)</span>
            <p class="toggle-desc">Wraps fields in two extra nested divs (<code>.field-wrap &gt; .field-inner</code>) and button in <code>.actions-row</code>, altering DOM depth.</p>
          </div>
          <label class="switch">
            <input type="checkbox" data-type="mutation" data-key="wrapperChange" id="toggle-wrapperChange">
            <span class="slider"></span>
          </label>
        </div>

        <!-- positionSwap -->
        <div class="toggle-card">
          <div class="toggle-info">
            <span class="toggle-name">Element Order Swap (<code>positionSwap</code>)</span>
            <p class="toggle-desc">Renders "Forgot Password?" link ABOVE submit button and moves the error box ABOVE the form input fields.</p>
          </div>
          <label class="switch">
            <input type="checkbox" data-type="mutation" data-key="positionSwap" id="toggle-positionSwap">
            <span class="slider"></span>
          </label>
        </div>

        <!-- removeTestIds -->
        <div class="toggle-card">
          <div class="toggle-info">
            <span class="toggle-name">Remove Test IDs (<code>removeTestIds</code>)</span>
            <p class="toggle-desc">Removes all <code>data-testid</code> attributes from rendered HTML, forcing tests to rely on accessible locators.</p>
          </div>
          <label class="switch">
            <input type="checkbox" data-type="mutation" data-key="removeTestIds" id="toggle-removeTestIds">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </section>

    <!-- Section 2: Injected Bugs -->
    <section class="control-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">🐞</span> Injected Functional Defects
        </h2>
        <span class="section-desc">Simulates genuine software defects that tests should catch as true regressions</span>
      </div>

      <div class="toggles-grid">
        <!-- bugNoErrorOnWrongPassword -->
        <div class="toggle-card bug-card">
          <div class="toggle-info">
            <span class="toggle-name">Silent Failure (<code>bugNoErrorOnWrongPassword</code>)</span>
            <p class="toggle-desc">Wrong credentials show NO error message at all; silently nothing happens on screen.</p>
          </div>
          <label class="switch switch-danger">
            <input type="checkbox" data-type="bug" data-key="bugNoErrorOnWrongPassword" id="toggle-bugNoErrorOnWrongPassword">
            <span class="slider"></span>
          </label>
        </div>

        <!-- bugNoEmailValidation -->
        <div class="toggle-card bug-card">
          <div class="toggle-info">
            <span class="toggle-name">Missing Client Email Validation (<code>bugNoEmailValidation</code>)</span>
            <p class="toggle-desc">Submitting an empty email does not display the expected "Email is required" validation message.</p>
          </div>
          <label class="switch switch-danger">
            <input type="checkbox" data-type="bug" data-key="bugNoEmailValidation" id="toggle-bugNoEmailValidation">
            <span class="slider"></span>
          </label>
        </div>

        <!-- bugBrokenForgotLink -->
        <div class="toggle-card bug-card">
          <div class="toggle-info">
            <span class="toggle-name">Broken Link (<code>bugBrokenForgotLink</code>)</span>
            <p class="toggle-desc">"Forgot Password?" points to <code>/forgot-password-broken</code>, triggering a 404 Not Found error.</p>
          </div>
          <label class="switch switch-danger">
            <input type="checkbox" data-type="bug" data-key="bugBrokenForgotLink" id="toggle-bugBrokenForgotLink">
            <span class="slider"></span>
          </label>
        </div>

        <!-- bugNoRedirectAfterLogin -->
        <div class="toggle-card bug-card">
          <div class="toggle-info">
            <span class="toggle-name">Missing Navigation (<code>bugNoRedirectAfterLogin</code>)</span>
            <p class="toggle-desc">Server-side login succeeds, but client fails to redirect to <code>/dashboard</code>, remaining stuck on <code>/login</code>.</p>
          </div>
          <label class="switch switch-danger">
            <input type="checkbox" data-type="bug" data-key="bugNoRedirectAfterLogin" id="toggle-bugNoRedirectAfterLogin">
            <span class="slider"></span>
          </label>
        </div>

        <!-- bugWrongErrorText -->
        <div class="toggle-card bug-card">
          <div class="toggle-info">
            <span class="toggle-name">Incorrect Error Copy (<code>bugWrongErrorText</code>)</span>
            <p class="toggle-desc">Invalid credentials displays "Something went wrong" instead of the expected "Invalid credentials".</p>
          </div>
          <label class="switch switch-danger">
            <input type="checkbox" data-type="bug" data-key="bugWrongErrorText" id="toggle-bugWrongErrorText">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </section>

    <!-- Toast Notification Container -->
    <div id="toast-container" class="toast-container" aria-live="polite"></div>
  </div>
  `;

  return renderLayout({
    title: 'Control Panel',
    content,
    scripts: ['/public/control.js'],
  });
};

export default renderControlPage;

