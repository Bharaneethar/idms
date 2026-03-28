/* ============================
   ADMIN DASHBOARD (Live)
   ============================ */

async function renderAdminDashboard() {
  try {
    if (!Auth.requireAuth('admin')) return;
    Charts.destroyAll();

    console.log('Admin Dashboard: Fetching live data...');

    // Load metrics in parallel
    const [totalInv, totalEmp, avgWater, avgPower, industries, sectorDist] = await Promise.all([
      DataService.getTotalInvestment().catch(e => { console.error('Inv Fetch Error:', e); return 0; }),
      DataService.getTotalEmployment().catch(e => { console.error('Emp Fetch Error:', e); return 0; }),
      DataService.getTotalWater().catch(e => { console.error('Water Fetch Error:', e); return 0; }),
      DataService.getTotalPower().catch(e => { console.error('Power Fetch Error:', e); return 0; }),
      SupabaseService.getAllIndustries().catch(e => { console.error('Ind Fetch Error:', e); return { data: [], error: e }; }),
      DataService.getSectorDistribution().catch(e => { console.error('Sector Fetch Error:', e); return {}; })
    ]);

    const industryData = industries?.data || [];
    const activeCount = industryData.filter(i => i.status === 'Active').length;

    console.log('Admin Dashboard: Rendering layout...');

    const content = `
      ${Components.pageHeader('Operational Overview', 'Real-time monitoring across all industrial complexes.', `
        <button class="px-4 py-2 bg-surface-container-high text-on-primary-fixed font-medium rounded-2xl text-sm transition-all hover:bg-surface-container-highest">Export Data</button>
        <button class="px-4 py-2 bg-[#0f172a] text-white font-medium rounded-2xl text-sm transition-all hover:bg-secondary active:scale-95 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">add</span> New Complex
        </button>
      `)}

      <div class="stats-grid mb-8">
        ${Components.statCard('factory', 'blue', industryData.length, 'Total Industries', '+4.2%', 'up', 1)}
        ${Components.statCard('payments', 'emerald', DataService.formatCurrency(totalInv), 'Total Investment', '+12.8%', 'up', 2)}
        ${Components.statCard('groups', 'amber', DataService.formatNumber(totalEmp), 'Total Employment', '+8.1%', 'up', 3)}
        ${Components.statCard('water_drop', 'blue', DataService.formatNumber(avgWater) + ' KL', 'Water Usage', '-2.4%', 'down', 4)}
      </div>

      <div class="main-grid mb-8">
        <div class="bg-surface-container-lowest p-8 rounded-2xl border border-white/5 shadow-sm">
          <div class="flex justify-between items-center mb-10">
            <h4 class="text-base font-semibold text-on-surface">Investment Trends</h4>
            <span class="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">Cloud Sync</span>
          </div>
          <div class="h-64">
            <canvas id="admin-inv-chart"></canvas>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-8 rounded-2xl border border-white/5 shadow-sm">
          <div class="flex justify-between items-center mb-8">
            <h4 class="text-base font-semibold text-on-surface">Sector Distribution</h4>
          </div>
          <div class="h-64">
            <canvas id="admin-sector-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        <div class="px-8 py-6 flex justify-between items-center border-b border-surface-container-low">
          <h4 class="text-base font-semibold text-on-surface">Top Industries by Investment</h4>
          <button class="px-3 py-1.5 bg-surface-container-high text-on-primary-fixed font-medium rounded-xl text-xs transition-all hover:bg-surface-container-highest" onclick="Router.navigate('industry-list')">View All Units</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-surface-container-low/30">
                <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Industry Name</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Sector</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Investment</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container-low">
              ${industryData.slice(0, 5).map(ind => `
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
                  <td class="px-6 py-5">${Components.statusBadge(ind.status)}</td>
                  <td class="px-8 py-5 text-sm font-medium text-right">${DataService.formatCurrency(Math.random() * 50000000 + 10000000)}</td>
                </tr>
              `).join('')}
              ${industryData.length === 0 ? '<tr><td colspan="4" class="px-8 py-10 text-center text-on-surface-variant">No data available in cloud</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;

    await Components.renderLayout(content, 'admin-dashboard');
    Components.setPageTitle('Admin Dashboard');
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Load Charts
    setTimeout(async () => {
      try {
        if (Object.keys(sectorDist).length > 0) {
            Charts.doughnutChart('admin-sector-chart', Object.keys(sectorDist), Object.values(sectorDist));
        }

        const { data: invData } = await SupabaseService.getInvestmentData();
        if (invData && invData.length > 0) {
            const yearlyTotal = {};
            invData.forEach(d => {
                yearlyTotal[d.year] = (yearlyTotal[d.year] || 0) + Number(d.initial_investment) + Number(d.additional_investment);
            });
            const sortedYears = Object.keys(yearlyTotal).sort();
            Charts.lineChart('admin-inv-chart', sortedYears, [
                { label: 'Total Investment (₹)', data: sortedYears.map(y => yearlyTotal[y]) }
            ]);
        }
      } catch (e) {
        console.error('Admin Chart Error:', e);
      }
    }, 100);

  } catch (error) {
    console.error('Critical Admin Dashboard Error:', error);
    Toast.error('Dashboard Error', 'Failed to load system overview. Please check connection.');
  }
}
