// ShopEase Control Panel Interactivity
document.addEventListener('DOMContentLoaded', () => {
  const versionBadge = document.getElementById('version-badge');
  const toastContainer = document.getElementById('toast-container');
  const resetBtn = document.getElementById('btn-reset-all');
  const randomizeBtn = document.getElementById('btn-randomize-mutations');

  const showToast = (message, icon = 'ℹ️') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const updateUIFromState = (state) => {
    if (!state) return;

    if (versionBadge && state.version !== undefined) {
      versionBadge.textContent = `State Version: #${state.version}`;
    }

    if (state.mutations) {
      for (const [key, value] of Object.entries(state.mutations)) {
        const input = document.getElementById(`toggle-${key}`);
        if (input) input.checked = Boolean(value);
      }
    }

    if (state.bugs) {
      for (const [key, value] of Object.entries(state.bugs)) {
        const input = document.getElementById(`toggle-${key}`);
        if (input) input.checked = Boolean(value);
      }
    }
  };

  // Fetch initial state
  const loadState = async () => {
    try {
      const res = await fetch('/__control/state');
      if (!res.ok) throw new Error('Failed to load state');
      const data = await res.json();
      updateUIFromState(data);
    } catch (err) {
      showToast('Error loading toggle state', '❌');
    }
  };

  // Listen for individual toggle changes
  document.querySelectorAll('input[type="checkbox"][data-key]').forEach((checkbox) => {
    checkbox.addEventListener('change', async (e) => {
      const key = checkbox.dataset.key;
      const type = checkbox.dataset.type; // "mutation" or "bug"
      const checked = checkbox.checked;

      const endpoint = type === 'mutation' ? '/__control/mutations' : '/__control/bugs';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [key]: checked }),
        });

        const data = await res.json();
        if (res.ok) {
          updateUIFromState(data);
          const icon = type === 'mutation' ? '🧬' : '🐞';
          showToast(`${key} is now ${checked ? 'ON' : 'OFF'}`, icon);
        } else {
          // Revert checkbox on error
          checkbox.checked = !checked;
          showToast(data.error || 'Failed to update toggle', '❌');
        }
      } catch (err) {
        checkbox.checked = !checked;
        showToast('Network error updating toggle', '❌');
      }
    });
  });

  // Reset All Toggles
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/__control/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        if (res.ok) {
          updateUIFromState(data);
          showToast('All mutations & bugs have been reset to false', '🔄');
        } else {
          showToast('Failed to reset toggles', '❌');
        }
      } catch (err) {
        showToast('Network error during reset', '❌');
      }
    });
  }

  // Randomize Mutations
  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/__control/randomize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: 2, includeBugs: false }),
        });

        const data = await res.json();
        if (res.ok) {
          updateUIFromState(data.state);
          const applied = data.applied?.mutations?.join(', ') || 'none';
          showToast(`Enabled 2 random mutations: ${applied}`, '🎲');
        } else {
          showToast('Failed to randomize mutations', '❌');
        }
      } catch (err) {
        showToast('Network error during randomization', '❌');
      }
    });
  }

  loadState();
});

