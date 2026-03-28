/* ============================
   COMPONENTS - Layout Rendering (Sidebar, Header, Page Wrapper)
   ============================ */

const Components = {
  async renderLayout(pageContent, activeNav) {
    const user = Auth.getUser();
    const role = user.role;
    const app = document.getElementById('app');

    // Header needs to be rendered async for notifications
    const headerHTML = await this.renderHeader(user);

    app.innerHTML = `
      <div class="flex bg-surface text-on-surface min-h-screen">
        ${this.renderSidebar(role, activeNav)}
        <div class="flex-1 md:ml-64 ml-0 min-h-screen flex flex-col transition-all duration-300">
          ${headerHTML}
          <main class="flex-grow p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
            ${pageContent}
          </main>
          ${this.renderFooter()}
        </div>
      </div>
      <div class="mobile-overlay fixed inset-0 bg-black/50 z-40 hidden" id="mobile-overlay" onclick="Components.closeMobileSidebar()"></div>
    `;

    if (typeof lucide !== 'undefined') lucide.createIcons();
    this._bindHeaderEvents();
  },

  renderSidebar(role, activeNav) {
    const user = Auth.getUser();
    
    const industryNav = [
      { id: 'industry-dashboard', icon: 'dashboard', label: 'Dashboard' },
      { id: 'industry-profile', icon: 'factory', label: 'My Profile' },
      { id: 'data-submission', icon: 'file_upload', label: 'Submit Data' },
      { id: 'submission-history', icon: 'history', label: 'Submission History' },
      { id: 'notifications-page', icon: 'notifications', label: 'Notifications' },
    ];

    const adminNav = [
      { id: 'admin-dashboard', icon: 'dashboard', label: 'Dashboard' },
      { id: 'industry-list', icon: 'factory', label: 'Industries' },
      { id: 'reports', icon: 'query_stats', label: 'Analytics' },
      { id: 'compliance', icon: 'verified', label: 'Compliance' },
      { id: 'city-directory', icon: 'map', label: 'Directory' },
      { id: 'notifications-page', icon: 'notifications', label: 'Notifications' },
    ];

    const navItems = role === 'admin' ? adminNav : industryNav;

    let navHTML = '';
    navItems.forEach(item => {
      const isActive = item.id === activeNav;
      const activeClass = isActive ? 'bg-[#1e293b] text-blue-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/50';
      navHTML += `
        <a class="${activeClass} mx-2 px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-200 ease-in-out cursor-pointer" onclick="Components.closeMobileSidebar(); Router.navigate('${item.id}')">
          <span class="material-symbols-outlined text-[1.25rem]">${item.icon}</span>
          <span class="font-['Inter'] tracking-[-0.01em] text-[0.875rem]">${item.label}</span>
        </a>
      `;
    });

    return `
      <aside class="fixed left-0 top-0 h-full w-64 z-50 bg-[#0f172a] flex flex-col py-6 shadow-xl transition-transform duration-300 -translate-x-full md:translate-x-0" id="sidebar">
        <div class="px-6 mb-10">
          <h1 class="text-white font-semibold text-base">${role === 'admin' ? 'Admin Portal' : 'Industry Portal'}</h1>
          <p class="text-slate-400 text-xs mt-1">IDMS Control Center</p>
        </div>
        <nav class="flex-1 space-y-1">
          ${navHTML}
        </nav>
        <div class="px-4 mt-auto">
          <button class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95" onclick="Router.navigate('${role === 'admin' ? 'reports' : 'data-submission'}')">
            ${role === 'admin' ? 'New Report' : 'Submit Data'}
          </button>
          <div class="mt-6 border-t border-slate-800 pt-4">
            <a class="text-slate-400 hover:text-white px-4 py-2 flex items-center gap-3 text-sm transition-colors cursor-pointer" onclick="Router.navigate('home')">
              <span class="material-symbols-outlined text-[1.25rem]">contact_support</span>
              Support
            </a>
            <a class="text-slate-400 hover:text-white px-4 py-2 flex items-center gap-3 text-sm transition-colors cursor-pointer" onclick="Auth.logout()">
              <span class="material-symbols-outlined text-[1.25rem]">logout</span>
              Logout
            </a>
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
      <header class="h-16 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8 border-b border-white/5 shadow-sm">
        <div class="flex items-center gap-8">
          <button class="md:hidden text-slate-300 p-2" onclick="Components.toggleMobileSidebar()">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <div class="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <span class="material-symbols-outlined text-sm">home</span>
            / <span id="header-page-title" class="text-slate-200 font-semibold uppercase tracking-wider">Dashboard</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative hidden sm:block">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">language</span>
            <select class="bg-slate-800/50 text-slate-200 text-xs border-none rounded-lg pl-9 pr-8 py-1.5 focus:ring-0 appearance-none cursor-pointer">
              <option>English</option>
              <option>Tamil</option>
            </select>
          </div>
          <button class="p-2 text-slate-300 hover:bg-slate-800/50 rounded-full transition-all relative" onclick="Components.toggleNotifications()" id="notification-btn">
            <span class="material-symbols-outlined">notifications</span>
            ${unreadCount > 0 ? '<span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>' : ''}
          </button>
          
          <div class="relative">
            <button class="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-800/50 transition-all" onclick="Components.toggleUserMenu()" id="user-menu-btn">
              <div class="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs shadow-inner">
                ${user.avatar || user.name.charAt(0)}
              </div>
              <span class="text-sm font-medium text-slate-200 hidden md:block">${user.name}</span>
              <span class="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
            </button>
            <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl hidden overflow-hidden z-50">
              <div class="p-4 border-b border-slate-700">
                <p class="text-sm font-semibold text-white truncate">${user.name}</p>
                <p class="text-xs text-slate-400 truncate">${user.email}</p>
              </div>
              <div class="py-1">
                <a class="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors cursor-pointer" onclick="Router.navigate('${role === 'admin' ? 'admin-dashboard' : 'industry-profile'}')">
                  <span class="material-symbols-outlined text-lg">person</span> Profile
                </a>
                <a class="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-slate-800/50 transition-colors cursor-pointer" onclick="Auth.logout()">
                  <span class="material-symbols-outlined text-lg">logout</span> Sign Out
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Dropdown -->
        <div id="notification-dropdown" class="absolute right-20 top-16 w-80 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl hidden overflow-hidden z-50">
          <div class="p-4 border-b border-slate-700 flex justify-between items-center">
            <h4 class="text-sm font-bold text-white">Notifications</h4>
            ${unreadCount > 0 ? `<span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase">${unreadCount} new</span>` : ''}
          </div>
          <div class="max-h-96 overflow-y-auto">
            ${notifications.length === 0 ? '<div class="p-8 text-center text-slate-500 text-sm">No new alerts</div>' : notifications.slice(0, 5).map(n => `
              <div class="p-4 border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer" onclick="Router.navigate('notifications-page')">
                <div class="flex gap-3">
                  <div class="h-8 w-8 rounded-lg bg-${n.type === 'reminder' ? 'amber' : n.type === 'alert' ? 'red' : 'green'}-500/20 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-${n.type === 'reminder' ? 'amber' : n.type === 'alert' ? 'red' : 'green'}-400 text-lg">
                      ${n.type === 'reminder' ? 'alarm' : n.type === 'alert' ? 'warning' : 'check_circle'}
                    </span>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-slate-200 leading-snug">${n.title}</p>
                    <p class="text-[10px] text-slate-500 uppercase font-bold">${n.time}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="p-3 text-center border-t border-slate-700">
            <a class="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer" onclick="Router.navigate('notifications-page')">View All Systems</a>
          </div>
        </div>
      </header>
    `;
  },

  renderFooter() {
    return `
      <footer class="w-full border-t border-slate-800 bg-[#0f172a] mt-auto">
        <div class="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="space-y-1 text-center md:text-left">
            <p class="text-white font-bold text-sm">SIPCOT IDMS</p>
            <p class="font-['Inter'] text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500">© 2026 SIPCOT TAMIL NADU. ALL RIGHTS RESERVED.</p>
          </div>
          <div class="flex gap-6">
            <a class="font-['Inter'] text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">Privacy</a>
            <a class="font-['Inter'] text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">Terms</a>
            <a class="font-['Inter'] text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">Security</a>
            <a class="font-['Inter'] text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500 hover:text-blue-400 transition-colors cursor-pointer" onclick="Router.navigate('home')">Support</a>
          </div>
        </div>
      </footer>
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
    const isOpen = sidebar.classList.contains('translate-x-0');
    
    if (isOpen) {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    } else {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      overlay.classList.remove('hidden');
    }
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (!sidebar) return;
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
    overlay && overlay.classList.add('hidden');
    document.body.style.overflow = '';
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
  statCard(icon, colorClass, value, label, trend, trendDir, delay) {
    const trendColor = trendDir === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50';
    const trendIcon = trendDir === 'up' ? 'trending_up' : 'trending_down';
    
    return `
      <div class="bg-surface-container-lowest p-6 rounded-2xl border border-white/5 transition-all hover:shadow-xl hover:shadow-black/5 stagger-${delay}" style="animation-delay: ${delay * 0.06}s">
        <div class="flex items-center justify-between mb-4">
          <span class="p-2 bg-blue-50 text-blue-600 rounded-xl material-symbols-outlined">${icon}</span>
          ${trend ? `<span class="text-[10px] font-bold uppercase tracking-wide ${trendColor} px-2 py-0.5 rounded-full flex items-center gap-1">
            <span class="material-symbols-outlined text-[10px]">${trendIcon}</span> ${trend}
          </span>` : ''}
        </div>
        <p class="text-on-surface-variant text-[0.6875rem] font-semibold uppercase tracking-wider">${label}</p>
        <h3 class="text-3xl font-bold tracking-[-0.04em] mt-1">${value}</h3>
      </div>
    `;
  },

  // Reusable page header
  pageHeader(title, subtitle, actions) {
    return `
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-[1.75rem] font-semibold tracking-[-0.02em] text-on-surface">${title}</h2>
          ${subtitle ? `<p class="text-on-surface-variant text-sm mt-1">${subtitle}</p>` : ''}
        </div>
        ${actions ? `<div class="flex gap-3">${actions}</div>` : ''}
      </div>
    `;
  },

  // Badge helper
  statusBadge(status) {
    const colorMap = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Inactive': 'bg-red-50 text-red-700 border-red-200',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Under Construction': 'bg-blue-50 text-blue-700 border-blue-200',
      'Compliance Warning': 'bg-red-50 text-red-700 border-red-200'
    };
    const defaultColor = 'bg-slate-50 text-slate-700 border-slate-200';
    const colorClass = colorMap[status] || defaultColor;
    
    return `
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${colorClass} text-[10px] font-bold uppercase tracking-wide border">
        <span class="h-1 w-1 rounded-full bg-current"></span> ${status}
      </span>
    `;
  },

  // Table with pagination
  dataTable(headers, rows, options = {}) {
    const { page = 1, perPage = 8 } = options;
    const totalPages = Math.ceil(rows.length / perPage);
    const start = (page - 1) * perPage;
    const pageRows = rows.slice(start, start + perPage);

    return `
      <div class="bg-surface-container-lowest rounded-2xl shadow-black/5 shadow-sm overflow-hidden min-w-full">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-surface-container-low/50">
                ${headers.map((h, i) => `
                  <th class="${i === 0 ? 'px-8' : i === headers.length - 1 ? 'px-8 text-right' : 'px-6'} py-5 text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">
                    ${h}
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container">
              ${pageRows.length === 0 ? `
                <tr><td colspan="${headers.length}" class="px-8 py-20 text-center text-on-surface-variant">No records found matching your criteria.</td></tr>
              ` : pageRows.join('')}
            </tbody>
          </table>
        </div>
        ${totalPages > 1 ? `
          <div class="px-8 py-6 bg-surface-container-low/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-[0.8125rem] text-on-surface-variant font-medium">
              Showing <span class="text-on-primary-fixed">${start + 1}-${Math.min(start + perPage, rows.length)}</span> of <span class="text-on-primary-fixed">${rows.length}</span> entries
            </p>
            <div class="flex gap-2">
              <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest text-on-primary-fixed hover:bg-surface-container-high transition-colors disabled:opacity-30" 
                      ${page === 1 ? 'disabled' : ''} onclick="window._tablePage && window._tablePage(${page - 1})">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              ${Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                const p = i + 1;
                const active = p === page ? 'bg-primary-container text-white' : 'bg-surface-container-lowest text-on-primary-fixed hover:bg-surface-container-high';
                return `<button class="w-10 h-10 flex items-center justify-center rounded-xl ${active} font-bold text-[0.875rem] transition-all" onclick="window._tablePage && window._tablePage(${p})">${p}</button>`;
              }).join('')}
              <button class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest text-on-primary-fixed hover:bg-surface-container-high transition-colors disabled:opacity-30"
                      ${page === totalPages ? 'disabled' : ''} onclick="window._tablePage && window._tablePage(${page + 1})">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
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
