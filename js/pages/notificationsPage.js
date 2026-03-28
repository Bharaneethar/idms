/* ============================
   NOTIFICATIONS PAGE (Live)
   ============================ */

async function renderNotificationsPage() {
  const user = Auth.getUser();
  if (!user) { Router.navigate('login'); return; }

  const notifications = await DataService.getNotifications(user.role);

  const content = `
    <div class="mb-10 flex justify-between items-end">
      <div>
        <h1 class="text-[2.5rem] font-bold tracking-tight text-on-primary-fixed leading-none mb-3">Alert Central</h1>
        <p class="text-on-surface-variant text-sm">Stay synchronized with compliance deadlines and system-wide announcements.</p>
      </div>
      <button class="px-6 py-3 bg-white text-on-surface font-bold rounded-2xl text-xs uppercase tracking-widest border border-surface-container-high hover:bg-surface-container-low transition-all shadow-sm flex items-center gap-2" onclick="markAllNotificationsRead()">
        <span class="material-symbols-outlined text-[18px]">done_all</span> Mark All Read
      </button>
    </div>

    <div class="bg-surface-container-lowest rounded-[2rem] border border-white/5 shadow-sm overflow-hidden mb-12">
      ${notifications.length === 0 ? `
        <div class="py-32 text-center">
          <div class="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant/20">
            <span class="material-symbols-outlined text-4xl">notifications_off</span>
          </div>
          <h3 class="text-lg font-bold text-on-surface mb-1">Silence is Golden</h3>
          <p class="text-on-surface-variant text-sm">No new notifications to show right now.</p>
        </div>
      ` : `
        <div class="divide-y divide-surface-container-low">
          ${notifications.map(n => `
            <div class="group relative flex gap-6 p-8 transition-all hover:bg-surface-container-low/30 ${!n.read ? 'bg-blue-50/30' : ''}">
              <div class="shrink-0">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${n.type === 'reminder' ? 'bg-amber-100 text-amber-600' : n.type === 'alert' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}">
                  <span class="material-symbols-outlined">
                    ${n.type === 'reminder' ? 'schedule' : n.type === 'alert' ? 'emergency_home' : 'verified_user'}
                  </span>
                </div>
              </div>
              <div class="flex-grow">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-base font-bold text-on-surface">${n.title}</h4>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">${n.time}</span>
                </div>
                <p class="text-sm text-on-surface-variant leading-relaxed max-w-3xl">${n.message}</p>
                ${!n.read ? `
                  <button class="mt-4 text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1 hover:underline" onclick="markNotificationRead('${n.id}')">
                    Acknowledge <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                ` : ''}
              </div>
              ${!n.read ? `<div class="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>` : ''}
              <button class="opacity-0 group-hover:opacity-100 absolute right-8 top-8 p-2 text-on-surface-variant hover:text-rose-500 transition-all">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  await Components.renderLayout(content, 'notifications-page');
  Components.setPageTitle('Notifications');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function markNotificationRead(id) {
    const { error } = await SupabaseService.markNotificationRead(id);
    if (error) Toast.error('Error', error.message);
    else renderNotificationsPage();
}

async function markAllNotificationsRead() {
    const user = Auth.getUser();
    const { error } = await SupabaseService.markAllNotificationsRead(user.id);
    if (error) Toast.error('Error', error.message);
    else { Toast.success('All Read', 'Notifications cleared.'); renderNotificationsPage(); }
}
