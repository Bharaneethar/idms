/* ============================
   REPORTS & ANALYTICS (Live)
   ============================ */

async function renderReports() {
  if (!Auth.requireAuth('admin')) return;
  Charts.destroyAll();

  const [industries, investments, employment, utilities, turnover] = await Promise.all([
    SupabaseService.getAllIndustries(),
    SupabaseService.getInvestmentData(),
    SupabaseService.getEmploymentData(),
    SupabaseService.getUtilitiesData(),
    SupabaseService.getTurnoverData()
  ]);

  const industryData = industries.data || [];
  const invData = investments.data || [];
  const empData = employment.data || [];
  const utilData = utilities.data || [];
  const turnData = turnover.data || [];

  const tableRows = industryData.slice(0, 5).map(ind => {
    const turn = turnData.find(t => t.industry_id === ind.id) || { annual_turnover: 0 };
    const emp = empData.find(e => e.industry_id === ind.id) || { permanent_employees: 0, contract_employees: 0 };
    return `
      <tr class="hover:bg-surface-container-low/50 transition-colors">
        <td class="px-8 py-5">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span class="material-symbols-outlined text-blue-600 text-base">precision_manufacturing</span>
            </div>
            <p class="text-sm font-semibold text-on-surface">${ind.name}</p>
          </div>
        </td>
        <td class="px-6 py-5 text-sm text-on-surface-variant">${ind.sector}</td>
        <td class="px-6 py-5 text-sm font-bold text-on-surface">${DataService.formatCurrency(turn.annual_turnover)}</td>
        <td class="px-6 py-5 text-sm text-on-surface-variant">${emp.permanent_employees + emp.contract_employees}</td>
        <td class="px-8 py-5 text-right">${Components.statusBadge(ind.status)}</td>
      </tr>
    `;
  });

  const content = `
    ${Components.pageHeader('Analytics Reports', 'Real-time infrastructure and investment performance metrics.', `
      <button class="px-5 py-2.5 bg-surface-container-high text-on-primary-fixed font-medium rounded-2xl flex items-center gap-2 hover:bg-surface-dim transition-all active:scale-95" onclick="window.print()">
        <span class="material-symbols-outlined text-[1.2rem]">print</span> Print
      </button>
      <button class="px-5 py-2.5 bg-on-primary-fixed text-white font-medium rounded-2xl flex items-center gap-2 hover:bg-secondary transition-all active:scale-95">
        <span class="material-symbols-outlined text-[1.2rem]">download</span> Export Full Data
      </button>
    `)}

    <div class="grid grid-cols-12 gap-8 mb-8">
      <!-- Investment Growth -->
      <div class="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h3 class="text-base font-semibold text-on-primary-fixed">Investment Growth</h3>
            <p class="text-xs text-on-surface-variant">Annual institutional capital inflow (₹ millions)</p>
          </div>
          <span class="px-3 py-1 bg-secondary/10 text-secondary text-[0.6875rem] font-bold rounded-full uppercase tracking-wider">High Velocity</span>
        </div>
        <div class="h-80">
          <canvas id="rep-inv-chart"></canvas>
        </div>
      </div>

      <!-- Gender Split -->
      <div class="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <h3 class="text-base font-semibold text-on-primary-fixed mb-1">Workforce Gender Split</h3>
        <p class="text-xs text-on-surface-variant mb-8">Diversity metrics across industrial hubs</p>
        <div class="h-64">
          <canvas id="rep-gen-chart"></canvas>
        </div>
      </div>

      <!-- Utility Benchmarking -->
      <div class="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <h3 class="text-base font-semibold text-on-primary-fixed mb-6">Utility Consumption Benchmarking</h3>
        <div class="h-64">
          <canvas id="rep-benchmark-chart"></canvas>
        </div>
      </div>

      <!-- Production Capacity -->
      <div class="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-2xl p-8 border border-white/5 shadow-sm">
        <h3 class="text-base font-semibold text-on-primary-fixed mb-1">Production Capacity by Sector</h3>
        <p class="text-xs text-on-surface-variant mb-6">Output per industrial park vs Target (%)</p>
        <div class="h-64">
          <canvas id="rep-sector-cap-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Performance Table -->
    <div class="bg-surface-container-lowest rounded-2xl border border-white/5 shadow-sm overflow-hidden mb-12">
      <div class="px-8 py-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-low/30">
        <h3 class="text-lg font-bold tracking-tight text-on-surface">Industry Performance Analytics</h3>
        <a class="text-secondary text-sm font-semibold hover:underline cursor-pointer" onclick="Router.navigate('industry-list')">View Full Directory</a>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-surface-container-low/50 text-rose-300">
              <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Industry</th>
              <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Sector</th>
              <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Turnover</th>
              <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Workforce</th>
              <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-container-low">
            ${tableRows.join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  await Components.renderLayout(content, 'reports');
  Components.setPageTitle('Analytics');
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Load Charts
  setTimeout(() => {
    // 1. Investment Growth
    const yearlyInv = {};
    invData.forEach(d => { yearlyInv[d.year] = (yearlyInv[d.year] || 0) + Number(d.initial_investment) + Number(d.additional_investment); });
    const sortedInvYears = Object.keys(yearlyInv).sort();
    Charts.lineChart('rep-inv-chart', sortedInvYears, [{ label: 'Total Investment (₹)', data: sortedInvYears.map(y => yearlyInv[y]) }]);

    // 2. Gender Distribution
    let totalM = 0, totalF = 0;
    empData.forEach(e => { 
        if (e.year === 2024) { totalM += (e.male_employees || 0); totalF += (e.female_employees || 0); }
    });
    Charts.doughnutChart('rep-gen-chart', ['Male', 'Female'], [totalM, totalF]);

    // 3. Benchmarking (Power vs Water for latest year)
    const benchmarkData = invData.slice(0, 6).map(inv => {
        const ind = industryData.find(i => i.id === inv.industry_id);
        const util = utilData.find(u => u.industry_id === inv.industry_id && u.year === inv.year) || { power_consumption: 0 };
        return { name: ind?.name.slice(0, 10), val: util.power_consumption };
    });
    Charts.barChart('rep-benchmark-chart', benchmarkData.map(d => d.name), [{ label: 'Power (kWh)', data: benchmarkData.map(d => d.val) }]);

    // 4. Sector Capacity
    const sectorCap = {};
    const sectorCount = {};
    turnData.forEach(t => {
        const ind = industryData.find(i => i.id === t.industry_id);
        if (ind) {
            sectorCap[ind.sector] = (sectorCap[ind.sector] || 0) + (t.production_capacity || 0);
            sectorCount[ind.sector] = (sectorCount[ind.sector] || 0) + 1;
        }
    });
    const sectors = Object.keys(sectorCap);
    Charts.barChart('rep-sector-cap-chart', sectors, [{ label: 'Avg Capacity (%)', data: sectors.map(s => Math.round(sectorCap[s] / sectorCount[s])) }]);
  }, 100);
}
