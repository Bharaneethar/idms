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

  const content = `
    ${Components.pageHeader('Analytics Reports', 'Comprehensive performance analysis across the industrial park', `
      <div style="display:flex;gap:10px">
        <button class="btn btn-secondary" onclick="window.print()">
          <i data-lucide="printer"></i> Print Report
        </button>
        <button class="btn btn-primary">
          <i data-lucide="file-text"></i> Export Full Analytics
        </button>
      </div>
    `)}

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header"><span class="card-title">Investment Growth (Overall)</span></div>
        <div class="card-body"><canvas id="rep-inv-chart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Employment Gender Distribution</span></div>
        <div class="card-body"><canvas id="rep-gen-chart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Utility Consumption Benchmarking</span></div>
        <div class="card-body"><canvas id="rep-benchmark-chart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Production Capacity by Sector</span></div>
        <div class="card-body"><canvas id="rep-sector-cap-chart"></canvas></div>
      </div>
    </div>

    <div class="card mt-6">
      <div class="card-header"><span class="card-title">Industry Performance Table</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead>
            <tr><th>Industry</th><th>Sector</th><th>Turnover</th><th>Employees</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${industryData.slice(0, 10).map(ind => {
              const turn = turnData.find(t => t.industry_id === ind.id) || { annual_turnover: 0 };
              const emp = empData.find(e => e.industry_id === ind.id) || { permanent_employees: 0, contract_employees: 0 };
              return `
              <tr>
                <td><strong>${ind.name}</strong></td>
                <td>${ind.sector}</td>
                <td>${DataService.formatCurrency(turn.annual_turnover)}</td>
                <td>${emp.permanent_employees + emp.contract_employees}</td>
                <td>${Components.statusBadge(ind.status)}</td>
              </tr>`;
            }).join('')}
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
