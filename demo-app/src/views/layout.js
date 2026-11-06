/**
 * Shared HTML layout wrapper for ShopEase demo web application.
 * @param {object} params
 * @param {string} params.title - Page title
 * @param {string} params.content - Page body HTML
 * @param {string[]} [params.scripts] - Array of script file paths
 * @param {string} [params.extraHead] - Optional extra head tags
 * @returns {string} Full HTML document string
 */
export const renderLayout = ({
  title = 'ShopEase',
  content = '',
  scripts = [],
  extraHead = '',
}) => {
  const scriptTags = scripts
    .map((src) => `<script src="${src}"></script>`)
    .join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ShopEase</title>
  <link rel="stylesheet" href="/public/styles.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/><path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/></svg>">
  ${extraHead}
</head>
<body class="shopease-body">
  <header class="app-header">
    <div class="header-container">
      <div class="brand">
        <a href="/" class="brand-link">
          <span class="brand-icon">🛍️</span>
          <span class="brand-name">ShopEase</span>
        </a>
        <span class="brand-badge">Demo Target</span>
      </div>

      <nav class="header-nav">
        <a href="/__control" class="nav-control-btn" title="Open DOM Mutation & Bug Control Panel">
          <span class="control-icon">⚙️</span>
          <span>Control Panel</span>
        </a>
      </nav>
    </div>
  </header>

  <main class="app-main">
    ${content}
  </main>

  <footer class="app-footer">
    <div class="footer-container">
      <p>© 2026 ShopEase Inc. Built for SentinelQA autonomous testing evaluation.</p>
    </div>
  </footer>

  ${scriptTags}
</body>
</html>`;
};

export default renderLayout;

