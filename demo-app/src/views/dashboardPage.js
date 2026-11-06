import renderLayout from './layout.js';

/**
 * Server-rendered HTML string for the ShopEase Protected Dashboard Page.
 * @param {object} options
 * @param {string} options.userName - Name of authenticated user
 * @param {object} [options.mutations] - Active mutation flags
 * @returns {string} HTML string
 */
export const renderDashboardPage = ({
  userName = 'Customer',
  mutations = {},
} = {}) => {
  const {
    idRename = false,
    labelChange = false,
    classChange = false,
    removeTestIds = false,
  } = mutations;

  const logoutBtnId = idRename ? 'signout-btn' : 'logout-btn';
  const logoutBtnText = labelChange ? 'Sign out' : 'Logout';
  const btnClass = classChange ? 'btn btn-action' : 'btn btn-primary';
  const testIdAttr = (val) => (removeTestIds ? '' : ` data-testid="${val}"`);

  const content = `
  <div class="dashboard-wrapper">
    <div class="dashboard-header">
      <div>
        <h1 id="welcome-heading" class="dashboard-title"${testIdAttr('welcome-heading')}>Welcome back, ${userName}</h1>
        <p class="dashboard-subtitle">Manage your ShopEase account, orders, and wallet balance.</p>
      </div>
      <div>
        <button id="${logoutBtnId}" class="${btnClass} btn-logout"${testIdAttr('logout-btn')}>${logoutBtnText}</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card" data-card="orders">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <span class="stat-label">Orders</span>
          <span class="stat-value">12</span>
          <span class="stat-help">2 arriving today</span>
        </div>
      </div>

      <div class="stat-card" data-card="wishlist">
        <div class="stat-icon">❤️</div>
        <div class="stat-content">
          <span class="stat-label">Wishlist</span>
          <span class="stat-value">5</span>
          <span class="stat-help">1 price drop</span>
        </div>
      </div>

      <div class="stat-card" data-card="wallet">
        <div class="stat-icon">💳</div>
        <div class="stat-content">
          <span class="stat-label">Wallet</span>
          <span class="stat-value">$240.50</span>
          <span class="stat-help">Available balance</span>
        </div>
      </div>
    </div>

    <div class="recent-activity-card">
      <h2 class="card-heading">Recent Purchases</h2>
      <div class="order-item">
        <div class="order-info">
          <span class="order-name">Wireless Noise-Canceling Headphones</span>
          <span class="order-meta">Order #SE-94812 • Delivered Yesterday</span>
        </div>
        <span class="order-price">$129.99</span>
      </div>
      <div class="order-item">
        <div class="order-info">
          <span class="order-name">Ergonomic Mechanical Keyboard</span>
          <span class="order-meta">Order #SE-93201 • In Transit</span>
        </div>
        <span class="order-price">$89.00</span>
      </div>
    </div>
  </div>
  `;

  return renderLayout({
    title: 'Dashboard',
    content,
    scripts: ['/public/dashboard.js'],
  });
};

export default renderDashboardPage;
