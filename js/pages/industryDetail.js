/* ============================
   INDUSTRY DETAIL PAGE (Live)
   ============================ */

async function renderIndustryDetail(params) {
  if (!Auth.requireAuth('admin')) return;
  Charts.destroyAll();

  const id = params?.id;
  if (!id) { Router.navigate('industry-list'); return; }

  // Fetch all industry data from the cloud
  const [industry, investments, employment, utilities, turnover, csr, notes] = await Promise.all([
    DataService.getIndustry(id),
    DataService.getInvestmentByIndustry(id),
    DataService.getEmploymentByIndustry(id),
    DataService.getUtilitiesByIndustry(id),
    DataService.getTurnoverByIndustry(id),
    DataService.getCSRByIndustry(id),
    DataService.getNotesByIndustry(id)
  ]);

  if (!industry) {
    Toast.error('Industry Not Found', 'Could not fetch industry data from the database.');
    return;
  }

  const initial = industry.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const content = `
    <!-- Top Bar with Back Button -->
    <div class="flex items-center gap-4 mb-8">
      <button class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-low p-2 rounded-full transition-colors" onclick="Router.navigate('industry-list')">arrow_back</button>
      <h2 class="text-xl font-bold tracking-[-0.02em] text-on-primary-fixed">Industry Profile</h2>
    </div>

    <!-- Profile Header Card -->
    <section class="bg-surface-container-lowest rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border border-white/5 shadow-sm">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-2xl bg-midnight-gradient flex items-center justify-center text-white text-3xl font-bold bg-slate-900">
          ${initial}
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold tracking-tight text-on-surface">${industry.name}</h1>
            ${Components.statusBadge(industry.status)}
          </div>
          <p class="text-on-surface-variant text-sm flex flex-wrap items-center gap-4">
            <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-base">location_on</span>Plot ${industry.plot_number || 'N/A'}, SIPCOT Park</span>
            <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-base">call</span>${industry.phone || '+91 XXX XXX XXXX'}</span>
            <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-base">mail</span>${industry.email}</span>
          </p>
        </div>
      </div>
      <div class="flex gap-3">
        <button class="px-5 py-2.5 rounded-2xl bg-surface-container-high text-on-primary-fixed font-semibold text-sm hover:bg-surface-container-highest transition-all">Edit Details</button>
        <button class="px-5 py-2.5 rounded-2xl bg-secondary text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">description</span> Generate Summary
        </button>
      </div>
    </section>

    <!-- Bento Grid Content -->
    <div class="grid grid-cols-12 gap-8">
      <!-- Investment Overview -->
      <div class="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h3 class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Performance Metric</h3>
            <h2 class="text-xl font-bold text-on-surface">Investment Trajectory</h2>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-xs text-on-surface-variant">
              <span class="w-3 h-3 rounded-sm bg-blue-500"></span> Current Trend
            </div>
          </div>
        </div>
        <div class="h-64">
          <canvas id="det-inv-chart"></canvas>
        </div>
      </div>

      <!-- KPI Quick Stats -->
      <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div class="bg-secondary p-8 rounded-2xl text-white shadow-lg shadow-secondary/10">
          <p class="text-[0.6875rem] font-semibold uppercase tracking-widest opacity-70 mb-1">Total Fixed Assets</p>
          <h4 class="text-3xl font-bold tracking-tight mb-4">${DataService.formatCurrency(investments.reduce((sum, i) => sum + i.initial_investment + i.additional_investment, 0))}</h4>
          <div class="flex items-center gap-2 text-xs">
            <span class="material-symbols-outlined text-white text-base">trending_up</span>
            <span class="font-semibold">+12.4%</span>
            <span class="opacity-70">vs previous fiscal</span>
          </div>
        </div>
        
        <div class="bg-surface-container-lowest p-8 rounded-2xl border border-white/5 shadow-sm">
          <p class="text-[0.6875rem] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Employment Distribution</p>
          <div class="h-40">
            <canvas id="det-emp-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Utility & Capacity Section -->
      <div class="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <h3 class="text-base font-bold mb-6 text-on-surface">Utility Consumption (Power/Water)</h3>
        <div class="h-64">
          <canvas id="det-util-chart"></canvas>
        </div>
      </div>
      
      <div class="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <h3 class="text-base font-bold mb-6 text-on-surface">Production Capacity Utilization</h3>
        <div class="h-64">
          <canvas id="det-turn-chart"></canvas>
        </div>
      </div>

      <!-- CSR Initiatives Table -->
      <div class="col-span-12 bg-surface-container-lowest rounded-2xl overflow-hidden border border-white/5 shadow-sm">
        <div class="p-8 flex justify-between items-center bg-surface-container-low/30">
          <h2 class="text-lg font-bold tracking-tight text-on-surface">CSR Initiatives & CAPEX Logs</h2>
          <button class="text-secondary text-sm font-semibold hover:underline flex items-center gap-1">
            Export CSV <span class="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[0.6875rem] font-semibold uppercase tracking-widest text-on-surface-variant bg-surface-container-low/50">
                <th class="px-8 py-4">Year</th>
                <th class="px-8 py-4">Description</th>
                <th class="px-8 py-4 text-right">Expenditure</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container">
              ${csr.length === 0 ? '<tr><td colspan="3" class="px-8 py-10 text-center text-on-surface-variant">No CSR activities recorded</td></tr>' : csr.map(c => `
                <tr class="hover:bg-surface-container-low/50 transition-colors">
                  <td class="px-8 py-5 text-sm font-medium text-on-surface">${c.year}</td>
                  <td class="px-8 py-5 text-sm text-on-surface-variant">${c.description}</td>
                  <td class="px-8 py-5 text-sm font-bold text-on-surface text-right">₹${c.expenditure.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Compliance Notes Section -->
      <div class="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-symbols-outlined text-secondary">history_edu</span>
          <h3 class="text-lg font-bold text-on-surface">Compliance Notes</h3>
        </div>
        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          ${notes.length === 0 ? '<p class="text-sm text-on-surface-variant italic">No admin notes yet.</p>' : notes.map(n => `
            <div class="bg-surface-container-low p-4 rounded-xl border border-surface-container-high">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-xs text-on-surface">${n.author}</span>
                <span class="text-[10px] text-on-surface-variant uppercase font-medium tracking-wider">${n.date}</span>
              </div>
              <p class="text-xs text-on-surface-variant leading-relaxed">${n.text}</p>
            </div>
          `).join('')}
        </div>
        <div class="mt-8 pt-6 border-t border-surface-container-low">
          <textarea id="new-note" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-xs focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/50" rows="3" placeholder="Add a compliance note..."></textarea>
          <button class="w-full mt-3 py-3 bg-secondary text-white font-semibold rounded-xl text-sm transition-all hover:opacity-90 active:scale-95" onclick="addIndustryNote('${industry.id}')">Post Internal Note</button>
        </div>
      </div>
    </div>
  `;

  await Components.renderLayout(content, 'industry-detail');
  Components.setPageTitle(industry.name);
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Load Charts
  setTimeout(() => {
    if (investments.length > 0) {
      Charts.lineChart('det-inv-chart', investments.map(i => i.year.toString()), [
        { label: 'Investment (₹)', data: investments.map(i => i.initial_investment + i.additional_investment) }
      ]);
    }
    if (employment.length > 0) {
        const last = employment[employment.length - 1];
        Charts.doughnutChart('det-emp-chart', ['Male', 'Female'], [last.male_employees, last.female_employees]);
    }
    if (utilities.length > 0) {
        Charts.lineChart('det-util-chart', utilities.map(u => u.year.toString()), [
            { label: 'Power (kWh)', data: utilities.map(u => u.power_consumption) },
            { label: 'Water (KL)', data: utilities.map(u => u.water_consumption) }
        ]);
    }
    if (turnover.length > 0) {
        Charts.barChart('det-turn-chart', turnover.map(t => t.year.toString()), [
            { label: 'Capacity (%)', data: turnover.map(t => t.production_capacity) }
        ]);
    }
  }, 100);
}

async function addIndustryNote(id) {
    const text = document.getElementById('new-note').value;
    if (!text) return;
    const admin = Auth.getUser();
    const { error } = await SupabaseService.addAdminNote(id, admin.id, text);
    if (error) { Toast.error('Error', error.message); }
    else { Toast.success('Note Added', 'Your comment has been saved.'); renderIndustryDetail({id}); }
}
