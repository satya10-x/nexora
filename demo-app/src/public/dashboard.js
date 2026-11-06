// ShopEase Dashboard Client Logic
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn =
    document.getElementById('logout-btn') ||
    document.getElementById('signout-btn') ||
    document.querySelector('.btn-logout') ||
    document.querySelector('button[data-testid="logout-btn"]');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Logout request failed:', err);
      } finally {
        window.location = '/login';
      }
    });
  }
});

