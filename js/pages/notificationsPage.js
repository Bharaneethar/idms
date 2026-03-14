/* ============================
   NOTIFICATIONS PAGE (Live)
   ============================ */

async function renderNotificationsPage() {
  const user = Auth.getUser();
  if (!user) { Router.navigate('login'); return; }

  const notifications = await DataService.getNotifications(user.role);

  const content = `
    ${Components.pageHeader('Notifications', 'Stay updated with compliance reminders and system alerts', `
       <button class="btn btn-secondary" onclick="markAllNotificationsRead()">
         <i data-lucide="check-check"></i> Mark all as read
       </button>
    `)}

    <div class="card">
      <div class="card-body" style="padding:0">
        ${notifications.length === 0 ? `
          <div style="padding:60px;text-align:center;color:var(--slate-400)">
            <i data-lucide="bell-off" style="width:48px;height:48px;margin-bottom:16px;opacity:0.3"></i>
            <p>You have no notifications at this time.</p>
          </div>
        ` : notifications.map(n => `
          <div class="notification-full-item ${n.read ? '' : 'unread'}">
            <div class="notification-icon-wrap ${n.type}">
              <i data-lucide="${n.type === 'reminder' ? 'clock' : n.type === 'alert' ? 'alert-triangle' : 'check-circle-2'}" style="width:20px;height:20px"></i>
            </div>
            <div class="notification-content">
              <div class="flex justify-between items-start mb-1">
                <h4 style="font-weight:600;color:var(--slate-900)">${n.title}</h4>
                <span style="font-size:11px;color:var(--slate-400)">${n.time}</span>
              </div>
              <p style="font-size:13px;color:var(--slate-600);line-height:1.5">${n.message}</p>
              ${!n.read ? `<button class="text-xs font-bold text-primary-600 mt-2" onclick="markNotificationRead('${n.id}')">Mark as read</button>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
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
