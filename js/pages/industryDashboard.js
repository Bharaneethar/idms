/* ============================
   INDUSTRY DASHBOARD (Live)
   ============================ */

async function renderIndustryDashboard() {
  if (!Auth.requireAuth('industry')) return;
  Charts.destroyAll();

  const industryId = Auth.getIndustryId();
  const industry = await DataService.getIndustry(industryId);
  if (!industry) {
    Toast.error('Industry Not Found', 'Could not load your industry profile.');
    return;
  }

  // Fetch all live data in parallel
  const [investments, employment, utilities, turnover, completeness, notifications] = await Promise.all([
    DataService.getInvestmentByIndustry(industryId),
    DataService.getEmploymentByIndustry(industryId),
    DataService.getUtilitiesByIndustry(industryId),
    DataService.getTurnoverByIndustry(industryId),
    DataService.getDataCompleteness(industryId),
    DataService.getNotifications('industry')
  ]);

  const latestInv = investments.length > 0 ? investments[investments.length - 1] : { initial_investment: 0, additional_investment: 0 };
  const latestEmp = employment.length > 0 ? employment[employment.length - 1] : { permanent: 0, contract: 0 };
  const latestUtil = utilities.length > 0 ? utilities[utilities.length - 1] : { water_consumption: 0, power_consumption: 0 };
  const latestTurn = turnover.length > 0 ? turnover[turnover.length - 1] : { annual_turnover: 0, production_capacity: 0 };

  const content = `
    <div class="welcome-banner">
      <h2>Welcome back, ${industry.name} 👋</h2>
      <p>Here is your industry's latest operational overview and compliance status.</p>
    </div>

    <div class="dashboard-stats">
      ${Components.statCard('indian-rupee', 'indigo', DataService.formatCurrency(latestInv.initial_investment + latestInv.additional_investment), 'Total Investment', 'Current Fin. Year', '', 1)}
      ${Components.statCard('users', 'emerald', DataService.formatNumber(latestEmp.permanent + latestEmp.contract), 'Total Employees', latestEmp.permanent + ' permanent', '', 2)}
      ${Components.statCard('zap', 'amber', DataService.formatNumber(latestUtil.power_consumption) + ' kWh', 'Power Usage', 'Latest recorded', '', 3)}
      ${Components.statCard('trending-up', 'rose', latestTurn.production_capacity + '%', 'Production Capacity', 'Operating efficiency', '', 4)}
    </div>

    <div class="dashboard-charts">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Investment Overview</span>
          <span class="badge badge-primary">Trend</span>
        </div>
        <div class="chart-container">
          <canvas id="inv-chart"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Employment Distribution</span>
          <span class="badge badge-success">Gender Split</span>
        </div>
        <div class="chart-container">
          <canvas id="emp-chart"></canvas>
        </div>
      </div>
    </div>

    <div class="dashboard-bottom">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Data Completeness</span>
          <span class="badge badge-info">Profile Health</span>
        </div>
        <div class="card-body">
          <div class="completeness-score">${completeness}%</div>
          <p class="text-sm text-center mb-4 text-slate-500">Your profile data completeness score.</p>
          <div class="completeness-bar" style="height:10px">
            <div class="progress-bar">
              <div class="progress-bar-fill ${completeness >= 80 ? 'high' : completeness >= 50 ? 'medium' : 'low'}" style="width:${completeness}%"></div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm w-full mt-6" onclick="Router.navigate('data-submission')">Complete Now</button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Notifications</span>
          <a class="text-xs font-semibold text-primary-600 cursor-pointer" onclick="Router.navigate('notifications-page')">See all</a>
        </div>
        <div class="card-body" style="padding:0">
          ${notifications.length === 0 ? '<p style="padding:20px;text-align:center;color:var(--slate-400)">No new notifications</p>' : notifications.slice(0, 3).map(n => `
            <div class="notification-item ${n.read ? '' : 'unread'}">
              <div class="notification-icon-wrap ${n.type}">
                <i data-lucide="${n.type === 'reminder' ? 'clock' : n.type === 'alert' ? 'alert-triangle' : 'check-circle-2'}" style="width:16px;height:16px"></i>
              </div>
              <div class="notification-text">
                <p><strong>${n.title}</strong></p>
                <div class="notification-time">${n.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  await Components.renderLayout(content, 'industry-dashboard');
  Components.setPageTitle('Dashboard');

  // Load Lucas icons
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Load Charts
  setTimeout(() => {
    if (investments.length > 0) {
      Charts.lineChart('inv-chart', investments.map(i => i.year.toString()), [
        { label: 'Investment (₹)', data: investments.map(i => i.initial_investment + i.additional_investment) }
      ]);
    }
    if (latestEmp) {
      Charts.doughnutChart('emp-chart', ['Male', 'Female'], [latestEmp.male_employees, latestEmp.female_employees]);
    }
  }, 100);
}
