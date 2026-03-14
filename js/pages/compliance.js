/* ============================
   COMPLIANCE MONITORING (Live)
   ============================ */

async function renderCompliance() {
  if (!Auth.requireAuth('admin')) return;

  const { data: industries, error } = await SupabaseService.getAllIndustries();
  if (error) { Toast.error('Error', error.message); return; }

  // Logic to determine compliance based on last_updated_at
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  const stats = { compliant: 0, pending: 0, nonCompliant: 0 };
  
  const complianceData = industries.map(ind => {
    const lastUpdate = new Date(ind.last_updated_at);
    let status = 'Compliant';
    let type = 'success';

    if (lastUpdate < thirtyDaysAgo) {
      status = 'Non-Compliant';
      type = 'danger';
      stats.nonCompliant++;
    } else if (ind.status === 'Pending') {
      status = 'Pending Review';
      type = 'warning';
      stats.pending++;
    } else {
      stats.compliant++;
    }

    return {
      name: ind.name,
      id: ind.id,
      sector: ind.sector,
      lastUpdate: lastUpdate.toLocaleDateString(),
      status,
      type
    };
  });

  const content = `
    ${Components.pageHeader('Compliance Monitoring', 'Track industry data update frequency and accuracy')}

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card bg-emerald-50 border-emerald-100">
        <div class="card-body flex justify-between items-center">
          <div><p class="text-xs font-bold text-emerald-600 uppercase">Compliant</p><h3 class="text-2xl font-bold text-emerald-900">${stats.compliant}</h3></div>
          <div class="p-3 bg-emerald-500 rounded-lg text-white"><i data-lucide="check-circle-2"></i></div>
        </div>
      </div>
      <div class="card bg-amber-50 border-amber-100">
        <div class="card-body flex justify-between items-center">
          <div><p class="text-xs font-bold text-amber-600 uppercase">Pending Review</p><h3 class="text-2xl font-bold text-amber-900">${stats.pending}</h3></div>
          <div class="p-3 bg-amber-500 rounded-lg text-white"><i data-lucide="clock"></i></div>
        </div>
      </div>
      <div class="card bg-rose-50 border-rose-100">
        <div class="card-body flex justify-between items-center">
          <div><p class="text-xs font-bold text-rose-600 uppercase">Non-Compliant</p><h3 class="text-2xl font-bold text-rose-900">${stats.nonCompliant}</h3></div>
          <div class="p-3 bg-rose-500 rounded-lg text-white"><i data-lucide="alert-triangle"></i></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Compliance Status Table</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead>
            <tr><th>Industry</th><th>Sector</th><th>Last Update</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${complianceData.map(d => `
              <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.sector}</td>
                <td>${d.lastUpdate}</td>
                <td><span class="badge badge-${d.type}">${d.status}</span></td>
                <td>
                  <button class="btn btn-secondary btn-sm" onclick="sendReminder('${d.id}')">
                    <i data-lucide="send" style="width:12px;height:12px"></i> Remark
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  await Components.renderLayout(content, 'compliance-monitoring');
  Components.setPageTitle('Compliance');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function sendReminder(id) {
    const msg = prompt("Enter reminder message or compliance remark:");
    if (!msg) return;
    const { error } = await SupabaseService.createNotification(id, {
        title: 'Compliance Reminder',
        message: msg,
        type: 'reminder'
    });
    if (error) Toast.error('Error', error.message);
    else Toast.success('Reminder Sent', 'Industry has been notified.');
}
