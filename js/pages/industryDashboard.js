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

  // Check deadline and notify if needed
  const config = DeadlineService.getConfig();
  const { deadline, daysLeft, submitted } = await DeadlineService.checkAndNotify(industryId, investments);

  const latestInv = investments.length > 0 ? investments[investments.length - 1] : { initial_investment: 0, additional_investment: 0 };
  const latestEmp = employment.length > 0 ? employment[employment.length - 1] : { permanent: 0, contract: 0 };
  const latestUtil = utilities.length > 0 ? utilities[utilities.length - 1] : { water_consumption: 0, power_consumption: 0 };
  const latestTurn = turnover.length > 0 ? turnover[turnover.length - 1] : { annual_turnover: 0, production_capacity: 0 };

  const initial = industry.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const content = `
    <!-- Top Bar with Profile Info -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h2 class="text-[1.75rem] font-semibold tracking-[-0.02em] text-on-surface">Welcome back, ${industry.name} 👋</h2>
        <p class="text-on-surface-variant text-sm mt-1">Industrial Estate - ${industry.plot_number || 'Phase III'}, Plot ${industry.plot_number || '42-B'}</p>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative">
          <span class="material-symbols-outlined">notifications</span>
          ${notifications.length > 0 ? '<span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>' : ''}
        </button>
        <button class="bg-on-primary-fixed text-white px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-secondary transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10">
          <span class="material-symbols-outlined text-sm">edit</span> Edit Profile
        </button>
      </div>
    </div>

    ${DeadlineService.renderBanner(daysLeft, deadline, submitted, config.period)}

    <!-- Hero Profile Section -->
    <section class="mb-12">
      <div class="bg-on-primary-fixed rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-slate-900 shadow-2xl">
        <!-- Subtle Metallic Sheen -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none"></div>
        
        <div class="relative z-10">
          <div class="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-4xl font-black text-on-primary-fixed">
            ${initial}
          </div>
        </div>
        
        <div class="relative z-10 flex-1 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-4 mb-3">
            <h2 class="text-3xl font-bold tracking-tight text-white">${industry.name}</h2>
            <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[0.6875rem] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Active
            </span>
          </div>
          <div class="flex flex-wrap justify-center md:justify-start gap-8 text-sm">
            <div class="flex items-center gap-2 text-slate-300">
              <span class="material-symbols-outlined text-blue-400 text-base">category</span>
              <span>${industry.sector}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-300">
              <span class="material-symbols-outlined text-blue-400 text-base">location_on</span>
              <span>Sriperumbudur, Tamil Nadu</span>
            </div>
          </div>
        </div>
        
        <div class="relative z-10 md:text-right hidden xl:block">
          <div class="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-right">
            <p class="text-slate-400 text-[0.6875rem] font-bold uppercase tracking-widest mb-1">Compliance Health</p>
            <p class="text-white text-xl font-bold">98% Nominal</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Performance Indicators -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div class="bg-surface-container-lowest p-6 rounded-2xl border border-white/5 shadow-sm">
        <p class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Investment</p>
        <h4 class="text-2xl font-bold text-on-surface">${DataService.formatCurrency(latestInv.initial_investment + latestInv.additional_investment)}</h4>
        <div class="mt-3 flex items-center gap-1 text-emerald-500 text-xs font-bold">
          <span class="material-symbols-outlined text-sm">trending_up</span> +12% vs last year
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl border border-white/5 shadow-sm">
        <p class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Workforce</p>
        <h4 class="text-2xl font-bold text-on-surface">${DataService.formatNumber(latestEmp.permanent + latestEmp.contract)}</h4>
        <div class="mt-3 text-on-surface-variant text-xs font-medium">
          ${latestEmp.permanent} Permanent Staff
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl border border-white/5 shadow-sm">
        <p class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Power Usage</p>
        <h4 class="text-2xl font-bold text-on-surface">${DataService.formatNumber(latestUtil.power_consumption)} <span class="text-xs font-normal opacity-50">kWh</span></h4>
        <div class="mt-3 text-on-surface-variant text-xs font-medium">Standard Capacity</div>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-2xl border border-white/5 shadow-sm">
        <p class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Capacity</p>
        <h4 class="text-2xl font-bold text-on-surface">${latestTurn.production_capacity}%</h4>
        <div class="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden mt-3">
          <div class="bg-blue-500 h-full" style="width: ${latestTurn.production_capacity}%"></div>
        </div>
      </div>
    </div>

    <!-- Analytics & Activity -->
    <div class="grid grid-cols-12 gap-8 mb-12">
      <div class="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm">
        <div class="flex justify-between items-center mb-10">
          <h4 class="text-lg font-bold text-on-surface">Investment Trajectory</h4>
          <span class="text-xs font-bold text-secondary uppercase tracking-widest">Growth Analytics</span>
        </div>
        <div class="h-64">
          <canvas id="inv-chart"></canvas>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <!-- Profile Health Card -->
        <div class="bg-on-primary-fixed p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group bg-slate-900 border border-white/5">
          <div class="relative z-10">
            <h4 class="text-lg font-bold mb-6">Profile Maturity</h4>
            <div class="relative w-32 h-32 mx-auto mb-6">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="rgba(255,255,255,0.05)" stroke-width="3"></circle>
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#3b82f6" stroke-dasharray="${completeness} ${100 - completeness}" stroke-dashoffset="0" stroke-width="3" stroke-linecap="round"></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-2xl font-black">${completeness}%</span>
              </div>
            </div>
            <p class="text-xs text-slate-400 text-center leading-relaxed">Ensure all operational metrics are updated monthly for accurate compliance rating.</p>
            <button class="w-full mt-8 py-3 bg-secondary text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all hover:bg-blue-600 shadow-lg shadow-blue-500/20" onclick="Router.navigate('data-submission')">
              Update Stats
            </button>
          </div>
        </div>

        <!-- Latest Notifications -->
        <div class="bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm flex-grow">
          <div class="flex justify-between items-center mb-8">
            <h4 class="text-lg font-bold text-on-surface">Alert Feed</h4>
            <span class="material-symbols-outlined text-on-surface-variant cursor-pointer" onclick="Router.navigate('notifications-page')">open_in_new</span>
          </div>
          <div class="space-y-6">
            ${notifications.length === 0 ? '<p class="text-sm text-center text-on-surface-variant italic py-8">No new alerts</p>' : notifications.slice(0, 3).map(n => `
              <div class="flex gap-4 group cursor-pointer" onclick="Router.navigate('notifications-page')">
                <div class="w-10 h-10 rounded-xl bg-${n.type === 'reminder' ? 'amber' : n.type === 'alert' ? 'red' : 'green'}-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-${n.type === 'reminder' ? 'amber' : n.type === 'alert' ? 'red' : 'green'}-600">
                    ${n.type === 'reminder' ? 'history' : n.type === 'alert' ? 'warning' : 'verified'}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-bold text-on-surface line-clamp-1">${n.title}</p>
                  <p class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">${n.time}</p>
                </div>
              </div>
            `).join('')}
          </div>
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
