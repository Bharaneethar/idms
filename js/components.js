/* ============================
   COMPONENTS - Layout Rendering (Sidebar, Header, Page Wrapper)
   ============================ */

const Components = {
  // Render the full app layout with sidebar + header + content
  async renderLayout(pageContent, activeNav) {
    const user = Auth.getUser();
    const role = user.role;
    const app = document.getElementById('app');

    // Header needs to be rendered async for notifications
    const headerHTML = await this.renderHeader(user);

    app.innerHTML = `
      <div class="app-layout">
        ${this.renderSidebar(role, activeNav)}
        <div class="main-content" id="main-content">
          ${headerHTML}
          <div class="page-content" id="page-content">
            ${pageContent}
          </div>
        </div>
        <div class="mobile-overlay" id="mobile-overlay" onclick="Components.closeMobileSidebar()"></div>
      </div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();
    this._bindHeaderEvents();
  },

  renderSidebar(role, activeNav) {
    const industryNav = [
      { section: 'Main', items: [
        { id: 'industry-dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
        { id: 'industry-profile', icon: 'building-2', label: 'My Profile' },
      ]},
      { section: 'Data', items: [
        { id: 'data-submission', icon: 'file-plus-2', label: 'Submit Data' },
        { id: 'submission-history', icon: 'history', label: 'Submission History' },
      ]},
      { section: 'Other', items: [
        { id: 'notifications-page', icon: 'bell', label: 'Notifications' },
      ]},
    ];

    const adminNav = [
      { section: 'Overview', items: [
        { id: 'admin-dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
        { id: 'industry-list', icon: 'factory', label: 'Industries' },
      ]},
      { section: 'Analytics', items: [
        { id: 'reports', icon: 'bar-chart-3', label: 'Reports & Analytics' },
        { id: 'compliance', icon: 'shield-check', label: 'Compliance' },
      ]},
      { section: 'Other', items: [
        { id: 'notifications-page', icon: 'bell', label: 'Notifications' },
      ]},
    ];

    const navSections = role === 'admin' ? adminNav : industryNav;

    let navHTML = '';
    navSections.forEach(section => {
      navHTML += `<div class="nav-section-label">${section.section}</div>`;
      section.items.forEach(item => {
        const isActive = item.id === activeNav ? 'active' : '';
        navHTML += `
          <div class="nav-item ${isActive}" onclick="Router.navigate('${item.id}')" id="nav-${item.id}">
            <i data-lucide="${item.icon}"></i>
            <span class="nav-item-text">${item.label}</span>
          </div>
        `;
      });
    });

    const user = Auth.getUser();
    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <i data-lucide="factory"></i>
          </div>
          <div>
            <div class="sidebar-title">IDMS</div>
            <div class="sidebar-subtitle">Industrial Data Mgmt</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${navHTML}
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">${user.avatar}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user.name}</div>
              <div class="sidebar-user-role">${role === 'admin' ? 'Administrator' : 'Industry User'}</div>
            </div>
          </div>
        </div>
      </aside>
    `;
  },

  async renderHeader(user) {
    const role = user.role;
    const notifications = await DataService.getNotifications(role);
    const unreadCount = notifications.filter(n => !n.read).length;

    return `
      <header class="header" id="header">
        <div class="header-left">
          <button class="mobile-menu-btn header-icon-btn" onclick="Components.toggleMobileSidebar()" id="mobile-menu-btn">
            <i data-lucide="menu"></i>
          </button>
          <div class="header-breadcrumb">
            <i data-lucide="home" style="width:14px;height:14px"></i>
            / <span id="header-page-title">Dashboard</span>
          </div>
        </div>
        <div class="header-right">
          <div style="position:relative">
            <button class="header-icon-btn" onclick="Components.toggleNotifications()" id="notification-btn">
              <i data-lucide="bell"></i>
              ${unreadCount > 0 ? '<span class="badge-dot"></span>' : ''}
            </button>
            <div class="notification-dropdown" id="notification-dropdown">
              <div class="notification-dropdown-header">
                <h4>Notifications</h4>
                ${unreadCount > 0 ? `<span class="badge badge-primary">${unreadCount} new</span>` : ''}
              </div>
              <div class="notification-list">
                ${notifications.length === 0 ? '<p style="padding:20px;text-align:center;color:var(--slate-400)">No notifications</p>' : notifications.slice(0, 5).map(n => `
                  <div class="notification-item ${n.read ? '' : 'unread'}" onclick="Router.navigate('notifications-page')">
                    <div class="notification-icon-wrap ${n.type}">
                      <i data-lucide="${n.type === 'reminder' ? 'clock' : n.type === 'alert' ? 'alert-triangle' : 'check-circle-2'}" style="width:16px;height:16px"></i>
                    </div>
                    <div class="notification-text">
                      <p><strong>${n.title}</strong></p>
                      <div class="notification-time">${n.time}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="notification-dropdown-footer">
                <a onclick="Router.navigate('notifications-page')">View all notifications</a>
              </div>
            </div>
          </div>
          <div style="position:relative">
            <button class="header-user-btn" onclick="Components.toggleUserMenu()" id="user-menu-btn">
              <div class="avatar">${user.avatar || user.name.charAt(0)}</div>
              <span class="name">${user.name}</span>
              <i data-lucide="chevron-down" style="width:14px;height:14px;color:var(--slate-400)"></i>
            </button>
            <div class="user-dropdown" id="user-dropdown">
              <div class="user-dropdown-item" onclick="Router.navigate('${role === 'admin' ? 'admin-dashboard' : 'industry-profile'}')">
                <i data-lucide="user" style="width:16px;height:16px"></i>
                Profile
              </div>
              <div class="user-dropdown-divider"></div>
              <div class="user-dropdown-item danger" onclick="Auth.logout()">
                <i data-lucide="log-out" style="width:16px;height:16px"></i>
                Sign Out
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  },

  setPageTitle(title) {
    const el = document.getElementById('header-page-title');
    if (el) el.textContent = title;
  },

  toggleNotifications() {
    const dd = document.getElementById('notification-dropdown');
    const ud = document.getElementById('user-dropdown');
    if (ud) ud.classList.remove('show');
    if (dd) dd.classList.toggle('show');
  },

  toggleUserMenu() {
    const ud = document.getElementById('user-dropdown');
    const dd = document.getElementById('notification-dropdown');
    if (dd) dd.classList.remove('show');
    if (ud) ud.classList.toggle('show');
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('show');
  },

  _bindHeaderEvents() {
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      const notifBtn = document.getElementById('notification-btn');
      const notifDD = document.getElementById('notification-dropdown');
      const userBtn = document.getElementById('user-menu-btn');
      const userDD = document.getElementById('user-dropdown');

      if (notifDD && !notifBtn?.contains(e.target) && !notifDD.contains(e.target)) {
        notifDD.classList.remove('show');
      }
      if (userDD && !userBtn?.contains(e.target) && !userDD.contains(e.target)) {
        userDD.classList.remove('show');
      }
    });
  },

  // Reusable stat card
  statCard(icon, iconClass, value, label, trend, trendDir, delay) {
    return `
      <div class="stat-card stagger-${delay}" style="animation-delay: ${delay * 0.06}s">
        <div class="stat-card-icon ${iconClass}">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="stat-card-value">${value}</div>
        <div class="stat-card-label">${label}</div>
        ${trend ? `<div class="stat-card-trend ${trendDir}">
          <i data-lucide="${trendDir === 'up' ? 'trending-up' : 'trending-down'}" style="width:14px;height:14px"></i>
          ${trend}
        </div>` : ''}
      </div>
    `;
  },

  // Reusable page header
  pageHeader(title, subtitle, actions) {
    return `
      <div class="page-header">
        <div class="page-header-left">
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        ${actions ? `<div class="page-header-actions">${actions}</div>` : ''}
      </div>
    `;
  },

  // Badge helper
  statusBadge(status) {
    const map = {
      'Active': 'badge-success',
      'Inactive': 'badge-danger',
      'Pending': 'badge-warning',
    };
    return `<span class="badge ${map[status] || 'badge-neutral'}">${status}</span>`;
  },

  // Table with pagination
  dataTable(headers, rows, options = {}) {
    const { page = 1, perPage = 8, onRowClick } = options;
    const totalPages = Math.ceil(rows.length / perPage);
    const start = (page - 1) * perPage;
    const pageRows = rows.slice(start, start + perPage);

    let html = `
      <div class="card">
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${pageRows.length === 0 ? `
                <tr><td colspan="${headers.length}" style="text-align:center;padding:40px;color:var(--slate-400)">No data found</td></tr>
              ` : pageRows.join('')}
            </tbody>
          </table>
        </div>
        ${totalPages > 1 ? `
          <div class="table-pagination">
            <span>Showing ${start + 1} to ${Math.min(start + perPage, rows.length)} of ${rows.length}</span>
            <div class="table-pagination-btns">
              ${Array.from({length: totalPages}, (_, i) => `
                <button class="${i + 1 === page ? 'active' : ''}" onclick="window._tablePage && window._tablePage(${i + 1})">${i + 1}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
    return html;
  },

  // CSV Export
  exportCSV(data, filename) {
    if (!data || data.length === 0) {
      Toast.warning('No Data', 'No data to export');
      return;
    }
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.success('Export Complete', `${filename}.csv has been downloaded`);
  }
};
