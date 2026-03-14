/* ============================
   NOTIFICATIONS - Toast & Notification System
   ============================ */

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(type, title, message, duration = 4000) {
    this.init();
    const iconMap = {
      success: '<i data-lucide="check-circle-2"></i>',
      error: '<i data-lucide="x-circle"></i>',
      info: '<i data-lucide="info"></i>',
      warning: '<i data-lucide="alert-triangle"></i>',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i data-lucide="x" style="width:14px;height:14px"></i>
      </button>
    `;

    this.container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(title, message) { this.show('success', title, message); },
  error(title, message) { this.show('error', title, message); },
  info(title, message) { this.show('info', title, message); },
  warning(title, message) { this.show('warning', title, message); },
};
