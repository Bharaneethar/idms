/* ============================
   NON-COMPLIANCE TRACKING PAGE (Admin)
   Shows industries that have NOT submitted data in the current period.
   ============================ */

let ncFilter = { sector: 'all', city: 'all', search: '' };

async function renderNonCompliance() {
  if (!Auth.requireAuth('admin')) return;

  const config = DeadlineService.getConfig();
  const deadline = DeadlineService.getNextDeadline(config.period);
  const daysLeft = DeadlineService.getDaysLeft(deadline);

  const { data: industries, error } = await SupabaseService.getAllIndustries();
  if (error) { Toast.error('Error', error.message); return; }

  // Fetch all investment data to check submissions per industry
  const { data: allInv } = await SupabaseService.getInvestmentData();
  const invByIndustry = {};
  (allInv || []).forEach(inv => {
    if (!invByIndustry[inv.industry_id]) invByIndustry[inv.industry_id] = [];
    invByIndustry[inv.industry_id].push(inv);
  });

  // Build non-compliant list
  let nonCompliant = (industries || []).map(ind => {
    const invs = invByIndustry[ind.id] || [];
    const submitted = DeadlineService.hasSubmittedThisPeriod(invs, config.period);
    const lastInv = invs.sort((a, b) => b.year - a.year)[0];
    const lastSubmission = lastInv ? `FY ${lastInv.year}` : 'Never';
    return { ...ind, submitted, lastSubmission };
  }).filter(ind => !ind.submitted);

  // Unique cities for filter
  const cities = [...new Set((industries || []).map(i => i.city).filter(Boolean))];

  // Apply filters
  let filtered = nonCompliant.filter(ind => {
    const matchSector = ncFilter.sector === 'all' || ind.sector === ncFilter.sector;
    const matchCity = ncFilter.city === 'all' || ind.city === ncFilter.city;
    const matchSearch = !ncFilter.search ||
      ind.name.toLowerCase().includes(ncFilter.search.toLowerCase()) ||
      (ind.city || '').toLowerCase().includes(ncFilter.search.toLowerCase());
    return matchSector && matchCity && matchSearch;
  });

  const urgencyBadge = daysLeft <= 2
    ? `<span class="badge badge-danger">⚠️ ${daysLeft === 0 ? 'OVERDUE' : daysLeft + 'd left'}</span>`
    : daysLeft <= 7
    ? `<span class="badge badge-warning">${daysLeft} days left</span>`
    : `<span class="badge badge-info">${daysLeft} days left</span>`;

  const rows = filtered.map(ind => `
    <tr>
      <td>
        <div style="font-weight:600;color:var(--slate-900)">${ind.name}</div>
        <div style="font-size:11px;color:var(--slate-500)">${ind.sector || '—'}</div>
      </td>
      <td>${ind.city || '<span style="color:var(--slate-400)">—</span>'}</td>
      <td>${ind.location || '<span style="color:var(--slate-400)">—</span>'}</td>
      <td>${ind.lastSubmission}</td>
      <td>${Components.statusBadge(ind.status)}</td>
      <td style="text-align:right">
        <button class="btn btn-secondary btn-sm" style="margin-right:6px"
          onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
          <i data-lucide="eye" style="width:13px;height:13px"></i> View
        </button>
        <button class="btn btn-primary btn-sm" onclick="sendNcReminder('${ind.id}', this)">
          <i data-lucide="bell" style="width:13px;height:13px"></i> Remind
        </button>
      </td>
    </tr>
  `).join('');

  const urgencyColor = daysLeft <= 2 ? 'rose' : daysLeft <= 7 ? 'amber' : 'blue';
  const urgencyBg = daysLeft <= 2 ? 'bg-rose-500' : daysLeft <= 7 ? 'bg-amber-500' : 'bg-blue-600';

  const content = `
    <!-- Urgency Hero / Deadline Banner -->
    <section class="mb-10">
      <div class="${urgencyBg} rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex-1 text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span class="material-symbols-outlined text-3xl">alarm_on</span>
              <span class="text-[0.6875rem] font-bold uppercase tracking-widest opacity-80">Compliance Enforcement</span>
            </div>
            <h2 class="text-[2.75rem] leading-none font-bold tracking-tight mb-2">
              ${daysLeft === 0 ? 'Submission Deadline Today' : daysLeft < 0 ? 'Submission Period Ended' : `${daysLeft} days remaining`}
            </h2>
            <p class="text-white/80 font-medium">Data submission for <strong>${DeadlineService.getPeriodLabel(config.period)}</strong> cycle ends ${deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}.</p>
          </div>
          <div class="shrink-0 flex gap-4">
            <button class="bg-white text-${urgencyColor}-600 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all" onclick="sendAllReminders()">
              Notify All (${filtered.length})
            </button>
            <div class="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
               <select class="bg-transparent border-none text-white text-xs font-bold uppercase tracking-widest focus:ring-0 cursor-pointer pr-8" onchange="changeDeadlinePeriod(this.value)">
                <option value="monthly" class="text-on-surface" ${config.period === 'monthly' ? 'selected' : ''}>Monthly</option>
                <option value="quarterly" class="text-on-surface" ${config.period === 'quarterly' ? 'selected' : ''}>Quarterly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Consolidated Search & Filters -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-surface-container-low/50 p-4 rounded-3xl border border-white/10">
      <div class="relative flex-1">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60">search</span>
        <input class="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-${urgencyColor}-500/20 transition-all text-sm font-medium" 
          placeholder="Search by company or city..." 
          type="text"
          value="${ncFilter.search}"
          oninput="ncFilter.search=this.value; renderNonCompliance()">
      </div>
      <div class="flex gap-3">
        <select class="px-4 py-3 bg-white border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-${urgencyColor}-500/20 transition-all cursor-pointer" onchange="ncFilter.sector=this.value; renderNonCompliance()">
          <option value="all">🏗️ All Sectors</option>
          ${MockData.sectors.map(s => `<option value="${s}" ${s === ncFilter.sector ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <select class="px-4 py-3 bg-white border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-${urgencyColor}-500/20 transition-all cursor-pointer" onchange="ncFilter.city=this.value; renderNonCompliance()">
          <option value="all">🌆 All Cities</option>
          ${cities.map(c => `<option value="${c}" ${c === ncFilter.city ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
    </div>

    ${filtered.length === 0 ? `
      <div class="bg-surface-container-lowest rounded-[2.5rem] p-24 text-center border border-dashed border-outline-variant/30 shadow-sm">
        <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <span class="material-symbols-outlined text-4xl">verified</span>
        </div>
        <h3 class="text-2xl font-bold tracking-tight text-on-surface mb-2">100% Compliance Achieved</h3>
        <p class="text-on-surface-variant max-w-sm mx-auto">Excellent! Every industrial unit has submitted the required documentation for this window.</p>
      </div>
    ` : `
      <div class="bg-surface-container-lowest rounded-3xl border border-white/5 shadow-sm overflow-hidden mb-12">
        <div class="px-8 py-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-low/30">
          <h3 class="text-lg font-bold text-on-surface">Delinquent Submissions <span class="text-xs font-medium text-on-surface-variant ml-2">${filtered.length} units pending</span></h3>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-rose-600">Action Required</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-surface-container-low/50">
                <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Core Enterprise</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">City / Park</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Last Recorded</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Current Status</th>
                <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Escalate</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container-low">
              ${filtered.map(ind => `
                <tr class="hover:bg-surface-container-low/50 transition-colors group">
                  <td class="px-8 py-5">
                    <p class="text-sm font-bold text-on-surface">${ind.name}</p>
                    <p class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mt-0.5">${ind.sector || '—'}</p>
                  </td>
                  <td class="px-6 py-5">
                    <p class="text-sm font-semibold text-on-surface">${ind.city || '—'}</p>
                    <p class="text-[10px] text-on-surface-variant uppercase font-bold">${ind.location || '—'}</p>
                  </td>
                  <td class="px-6 py-5 text-sm font-medium text-on-surface-variant">${ind.lastSubmission}</td>
                  <td class="px-6 py-5">${Components.statusBadge(ind.status)}</td>
                  <td class="px-8 py-5 text-right flex justify-end gap-2">
                    <button class="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
                      <span class="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <button class="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" onclick="sendNcReminder('${ind.id}', this)">
                      <span class="material-symbols-outlined text-[18px]">notifications_active</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `}
  `;

  await Components.renderLayout(content, 'non-compliance');
  Components.setPageTitle('Non-Compliance Tracker');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Change deadline period
window.changeDeadlinePeriod = (period) => {
  const cfg = DeadlineService.getConfig();
  DeadlineService.saveConfig({ ...cfg, period });
  renderNonCompliance();
};

// Send reminder to one industry
window.sendNcReminder = async (industryId, btn) => {
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" style="width:13px;height:13px;animation:spin 0.6s linear infinite"></i> Sending...';
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const config = DeadlineService.getConfig();
  const deadline = DeadlineService.getNextDeadline(config.period);
  const daysLeft = DeadlineService.getDaysLeft(deadline);

  const { error } = await SupabaseService.createNotification(industryId, {
    title: `📅 ${DeadlineService.getPeriodLabel(config.period)} Submission Reminder`,
    message: `Please submit your ${config.period} data by ${deadline.toLocaleDateString('en-IN')}. You have ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining.`,
    type: 'reminder'
  });

  if (error) {
    Toast.error('Failed', 'Could not send reminder: ' + error.message);
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="bell"></i> Remind';
  } else {
    Toast.success('Reminder Sent', 'Notification sent to industry successfully.');
    btn.innerHTML = '<i data-lucide="check" style="width:13px;height:13px"></i> Sent';
    btn.style.background = 'var(--secondary-500)';
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

// Send reminders to all non-compliant industries
window.sendAllReminders = async () => {
  const { data: industries } = await SupabaseService.getAllIndustries();
  const { data: allInv } = await SupabaseService.getInvestmentData();
  const config = DeadlineService.getConfig();
  const deadline = DeadlineService.getNextDeadline(config.period);
  const daysLeft = DeadlineService.getDaysLeft(deadline);

  const invByInd = {};
  (allInv || []).forEach(i => {
    if (!invByInd[i.industry_id]) invByInd[i.industry_id] = [];
    invByInd[i.industry_id].push(i);
  });

  const nonCompliant = (industries || []).filter(ind =>
    !DeadlineService.hasSubmittedThisPeriod(invByInd[ind.id] || [], config.period)
  );

  if (nonCompliant.length === 0) {
    Toast.info('No Action Needed', 'All industries have already submitted.');
    return;
  }

  Toast.info('Sending...', `Sending reminders to ${nonCompliant.length} industries...`);

  let sent = 0;
  for (const ind of nonCompliant) {
    const { error } = await SupabaseService.createNotification(ind.id, {
      title: `📅 ${DeadlineService.getPeriodLabel(config.period)} Submission Reminder`,
      message: `Please submit your ${config.period} data by ${deadline.toLocaleDateString('en-IN')}. ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining.`,
      type: 'reminder'
    });
    if (!error) sent++;
  }

  Toast.success('Reminders Sent', `Successfully notified ${sent} of ${nonCompliant.length} industries.`);
  renderNonCompliance();
};
