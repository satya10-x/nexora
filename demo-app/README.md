# ShopEase Demo Web Application

ShopEase is a lightweight, realistic server-rendered e-commerce web application built as the target system for **SentinelQA**. It features runtime **DOM mutation toggles** (to simulate developer UI alterations and test locator self-healing) and **injected bug toggles** (to simulate authentic software regressions).

> ⚠️ **Note for Developers & Testers:** The Control Panel (`/__control`) and Control API (`/__control/*`) are testing instruments designed solely to simulate runtime DOM shifts and bugs during automated QA cycles.

---

## Tech Stack

- **Runtime:** Node.js, Express.js (ES Modules, `"type": "module"`)
- **Rendering:** Vanilla server-rendered HTML strings with shared layout
- **Styling & Client:** Custom CSS design system (`styles.css`) + vanilla JavaScript (no frontend frameworks)
- **State Management:** In-memory global state for mutation/bug toggles and active user sessions (no external database required)

---

## Environment Variables

Configure `demo-app/.env` (copy from `demo-app/.env.example`):

| Variable | Required? | Default | Description |
| :--- | :---: | :---: | :--- |
| `DEMO_PORT` | Optional | `4000` | Port for the demo application |
| `CLIENT_URL` | Optional | `http://localhost:5173` | Allowed CORS origin (SentinelQA frontend) |
| `SERVER_URL` | Optional | `http://localhost:5000` | Allowed CORS origin (SentinelQA backend) |
| `DEMO_USER_EMAIL` | **Required** | — | Registered user email for login |
| `DEMO_USER_PASSWORD` | **Required** | — | Registered user password for login |
| `DEMO_USER_NAME` | Optional | `Alex Morgan` | Display name shown on protected dashboard |

*`DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD` are strictly required at startup. The server will throw a descriptive error if either is missing.*

---

## Application Pages & Flow

1. **`GET /`**
   - Automatically redirects to `/login`.
2. **`GET /login`**
   - Server-rendered login form with baseline or mutated DOM structure based on active toggles.
   - Resilient vanilla JS controller (`login.js`) submits credentials to `POST /api/login`.
3. **`GET /dashboard`**
   - Protected route. Requires valid `shopease_session` HTTP-only cookie.
   - Unauthenticated visitors are automatically redirected to `/login`.
   - Displays user welcome header, static account cards (Orders, Wishlist, Wallet), and a Logout button.
4. **`GET /forgot-password`**
   - Email submission form that posts to `POST /api/forgot-password` and displays confirmation feedback.
5. **`GET /__control`**
   - Interactive human control panel with switches for all mutation and bug flags, status versioning, and instant randomization.

---

## Authentication Endpoints

- **`POST /api/login`**
  - Payload: `{ "email": "...", "password": "..." }`
  - Validates credentials against `DEMO_USER_EMAIL` and `DEMO_USER_PASSWORD`.
  - On success: Issues random session token stored in an in-memory `Set` via `shopease_session` cookie (`httpOnly`, `sameSite: lax`).
  - On failure: Returns 401 with appropriate message (or respects bug toggles).
- **`POST /api/logout`**
  - Destroys active session token and clears the cookie.
- **`POST /api/forgot-password`**
  - Simulates password recovery notification.

---

## DOM Mutation Toggles

Mutations alter the rendered HTML structure to test if autonomous testing agents can adapt to developer changes:

| Mutation Flag | Baseline | Mutated |
| :--- | :--- | :--- |
| `idRename` | `email-input`, `password-input`, `login-btn`, `error-message`, `forgot-link`, `logout-btn` | `user-email`, `user-pass`, `signin-btn`, `form-error`, `reset-link`, `signout-btn` |
| `labelChange` | "Login", "Email", "Password", "Forgot Password?", "Sign in to ShopEase", "Logout" | "Sign In", "Email address", "Your password", "Reset password", "Welcome to ShopEase", "Sign out" |
| `classChange` | `.btn.btn-primary`, `.input-field`, `.error-box`, `.link` | `.btn.btn-action`, `.form-control`, `.alert-danger`, `.text-link` |
| `wrapperChange` | Flat inputs | Nested in `div.field-wrap > div.field-inner` & `div.actions-row` |
| `positionSwap` | Email → Pass → Error → Submit → Forgot | Error → Email → Pass → Forgot → Submit |
| `removeTestIds` | Standard `data-testid` attributes | Strips all `data-testid` attributes entirely |

---

## Injected Bug Toggles

Simulates functional software bugs that automated tests are expected to catch as regressions:

| Bug Flag | Expected Defect Behavior |
| :--- | :--- |
| `bugNoErrorOnWrongPassword` | Invalid credentials display NO error message on screen (silent failure). |
| `bugNoEmailValidation` | Submitting empty email skips client-side validation; "Email is required" does not show. |
| `bugBrokenForgotLink` | "Forgot Password?" link targets `/forgot-password-broken` which returns HTTP 404. |
| `bugNoRedirectAfterLogin` | Login succeeds on server, but client stays stuck on `/login` without redirecting. |
| `bugWrongErrorText` | Invalid credentials displays "Something went wrong" instead of "Invalid credentials". |

---

## Control API (`/__control`)

Automated testing suites can programmatically manipulate toggles:

- **`GET /__control/health`**
  - Returns: `{ "ok": true }`
- **`GET /__control/state`**
  - Returns current toggles and state revision:
    ```json
    {
      "mutations": { "idRename": false, ... },
      "bugs": { "bugNoErrorOnWrongPassword": false, ... },
      "version": 1
    }
    ```
- **`POST /__control/mutations`**
  - Body: `{ "idRename": true }` (merges known keys; 400 on invalid keys/types).
- **`POST /__control/bugs`**
  - Body: `{ "bugBrokenForgotLink": true }` (merges known keys; 400 on invalid keys/types).
- **`POST /__control/reset`**
  - Resets all mutations and bugs to `false`.
- **`POST /__control/randomize`**
  - Body: `{ "count": 2, "includeBugs": false }`
  - Resets mutations, then enables `count` random mutations (and 1 random bug if `includeBugs: true`).
