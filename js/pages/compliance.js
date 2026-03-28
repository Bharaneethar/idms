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

    // Remap for data table
    const tableRows = complianceData.map(d => `
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-6 py-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <span class="material-symbols-outlined text-slate-500">precision_manufacturing</span>
            </div>
            <div>
              <div class="font-bold text-on-primary-fixed">${d.name}</div>
              <div class="text-xs text-on-surface-variant">ID: ${d.id.slice(0,8)}...</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-5 text-[0.875rem] text-on-surface-variant">${d.sector}</td>
        <td class="px-6 py-5 text-[0.875rem] text-on-surface-variant">${d.lastUpdate}</td>
        <td class="px-6 py-5">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${d.type === 'success' ? 'emerald' : d.type === 'danger' ? 'red' : 'amber'}-100 text-${d.type === 'success' ? 'emerald-700' : d.type === 'danger' ? 'red-700' : 'amber-700'} text-[0.6875rem] font-bold uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-${d.type === 'success' ? 'emerald-500' : d.type === 'danger' ? 'red-500' : 'amber-500'}"></span>
            ${d.status}
          </span>
        </td>
        <td class="px-6 py-5 text-right">
          <button class="text-secondary hover:underline text-[0.875rem] font-semibold flex items-center gap-1 ml-auto" onclick="sendReminder('${d.id}')">
            <span class="material-symbols-outlined text-[16px]">edit_note</span> Remark
          </button>
        </td>
      </tr>
    `);

  const content = `
    <div class="flex justify-between items-end mb-12">
      <div>
        <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">SIPCOT Monitoring Ecosystem</span>
        <h1 class="text-[2.5rem] font-bold tracking-tight text-on-primary-fixed mt-2 leading-none">Compliance Monitoring</h1>
      </div>
      <div class="flex gap-3">
        <div class="bg-surface-container-low px-4 py-2 rounded-2xl flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          <span class="text-[0.875rem] font-medium">Real-time Feed Active</span>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- Compliant Card -->
      <div class="bg-surface-container-lowest p-8 rounded-2xl flex items-center justify-between border border-white/5 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5">
        <div>
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Validated Units</span>
          <div class="text-[3.5rem] font-bold tracking-tight text-on-primary-fixed mt-2">${stats.compliant}</div>
          <p class="text-emerald-600 font-semibold text-sm flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-sm">trending_up</span> All Systems Nominal
          </p>
        </div>
        <div class="relative flex items-center justify-center w-24 h-24">
          <svg class="w-full h-full transform -rotate-90">
            <circle class="text-slate-100" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-width="6"></circle>
            <circle class="text-emerald-500" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.compliant/industries.length)}" stroke-width="6" stroke-linecap="round"></circle>
          </svg>
          <span class="absolute material-symbols-outlined text-emerald-500 text-3xl">verified</span>
        </div>
      </div>

      <!-- Pending Card -->
      <div class="bg-surface-container-lowest p-8 rounded-2xl flex items-center justify-between border border-white/5 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5">
        <div>
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Reviews Pending</span>
          <div class="text-[3.5rem] font-bold tracking-tight text-on-primary-fixed mt-2">${stats.pending}</div>
          <p class="text-amber-600 font-semibold text-sm flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-sm">schedule</span> Needs Attention
          </p>
        </div>
        <div class="relative flex items-center justify-center w-24 h-24">
          <svg class="w-full h-full transform -rotate-90">
            <circle class="text-slate-100" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-width="6"></circle>
            <circle class="text-amber-500" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.pending/industries.length)}" stroke-width="6" stroke-linecap="round"></circle>
          </svg>
          <span class="absolute material-symbols-outlined text-amber-500 text-3xl">hourglass_empty</span>
        </div>
      </div>

      <!-- Critical Card -->
      <div class="bg-surface-container-lowest p-8 rounded-2xl flex items-center justify-between border border-white/5 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5">
        <div>
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Breach Alerts</span>
          <div class="text-[3.5rem] font-bold tracking-tight text-on-primary-fixed mt-2">${stats.nonCompliant}</div>
          <p class="text-red-500 font-semibold text-sm flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-sm">report</span> Immediate Action
          </p>
        </div>
        <div class="relative flex items-center justify-center w-24 h-24">
          <svg class="w-full h-full transform -rotate-90">
            <circle class="text-slate-100" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-width="6"></circle>
            <circle class="text-red-500" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.nonCompliant/industries.length)}" stroke-width="6" stroke-linecap="round"></circle>
          </svg>
          <span class="absolute material-symbols-outlined text-red-500 text-3xl">error</span>
        </div>
      </div>
    </div>

    <!-- Compliance Table -->
    ${Components.dataTable(
      ['Industry Unit', 'Sector', 'Last Update', 'Compliance Status', 'Remark'],
      tableRows,
      { perPage: 10 }
    )}
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
