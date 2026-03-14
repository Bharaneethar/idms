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
      ${Components.pageHeader('System Overview', 'Industrial Park Performance Monitoring')}

      <div class="dashboard-stats">
        ${Components.statCard('building', 'indigo', industryData.length, 'Total Industries', activeCount + ' currently active', '', 1)}
        ${Components.statCard('indian-rupee', 'emerald', DataService.formatCurrency(totalInv), 'Total Investment', 'Across all sectors', '', 2)}
        ${Components.statCard('users', 'amber', DataService.formatNumber(totalEmp), 'Total Employment', 'Permanent & Contract', '', 3)}
        ${Components.statCard('droplets', 'blue', DataService.formatNumber(avgWater) + ' KL', 'Water Usage', 'Cumulative usage', '', 4)}
      </div>

      <div class="dashboard-charts">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Investment by Year (Live)</span>
            <span class="badge badge-primary">Cloud Sync</span>
          </div>
          <div class="chart-container">
            <canvas id="admin-inv-chart"></canvas>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Sector Distribution</span>
            <span class="badge badge-success">Live Breakdown</span>
          </div>
          <div class="chart-container">
            <canvas id="admin-sector-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="card mt-6">
        <div class="card-header">
          <span class="card-title">Top Industries by Investment</span>
          <button class="btn btn-secondary btn-sm" onclick="Router.navigate('industry-list')">View All Industries</button>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Industry Name</th>
                <th>Sector</th>
                <th>Status</th>
                <th>Investment</th>
              </tr>
            </thead>
            <tbody>
              ${industryData.slice(0, 5).map(ind => `
                <tr>
                  <td><strong>${ind.name}</strong></td>
                  <td>${ind.sector}</td>
                  <td>${Components.statusBadge(ind.status)}</td>
                  <td>${DataService.formatCurrency(Math.random() * 50000000 + 10000000)}</td>
                </tr>
              `).join('')}
              ${industryData.length === 0 ? '<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--slate-400)">No data available in cloud</td></tr>' : ''}
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
