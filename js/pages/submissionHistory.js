/* ============================
   SUBMISSION HISTORY PAGE (Live)
   ============================ */

let historyPage = 1;
let historyFilter = 'all';

async function renderSubmissionHistory() {
  if (!Auth.requireAuth('industry')) return;
  const industryId = Auth.getIndustryId();

  // Fetch all live categories in parallel
  const [inv, emp, util, turn, csr] = await Promise.all([
    DataService.getInvestmentByIndustry(industryId),
    DataService.getEmploymentByIndustry(industryId),
    DataService.getUtilitiesByIndustry(industryId),
    DataService.getTurnoverByIndustry(industryId),
    DataService.getCSRByIndustry(industryId)
  ]);

  const allData = [];
  inv.forEach(d => {
    allData.push({ year: d.year, category: 'Investment', detail: `Initial: ${DataService.formatCurrency(d.initial_investment)}, Additional: ${DataService.formatCurrency(d.additional_investment)}`, date: new Date(d.created_at).toLocaleDateString() });
  });
  emp.forEach(d => {
    allData.push({ year: d.year, category: 'Employment', detail: `Perm: ${d.permanent_employees}, Cont: ${d.contract_employees}, M: ${d.male_employees}, F: ${d.female_employees}`, date: new Date(d.created_at).toLocaleDateString() });
  });
  util.forEach(d => {
    allData.push({ year: d.year, category: 'Utilities', detail: `Water: ${DataService.formatNumber(d.water_consumption)} KL, Power: ${DataService.formatNumber(d.power_consumption)} kWh`, date: new Date(d.created_at).toLocaleDateString() });
  });
  turn.forEach(d => {
    allData.push({ year: d.year, category: 'Business', detail: `Turnover: ${DataService.formatCurrency(d.annual_turnover)}, Capacity: ${d.production_capacity}%`, date: new Date(d.created_at).toLocaleDateString() });
  });
  csr.forEach(d => {
    allData.push({ year: d.year, category: 'CSR', detail: `${d.description} (${DataService.formatCurrency(d.expenditure)})`, date: new Date(d.created_at).toLocaleDateString() });
  });

  const filtered = historyFilter === 'all' ? allData : allData.filter(d => d.category === historyFilter);
  filtered.sort((a, b) => b.year - a.year);

  const catBadge = (cat) => {
    const map = { Investment: 'badge-primary', Employment: 'badge-success', Utilities: 'badge-info', Business: 'badge-warning', CSR: 'badge-neutral' };
    return `<span class="badge ${map[cat] || 'badge-neutral'}">${cat}</span>`;
  };

  const rows = filtered.map(d => `
    <tr>
      <td><strong>${d.year}</strong></td>
      <td>${catBadge(d.category)}</td>
      <td>${d.detail}</td>
      <td style="color:var(--slate-400)">${d.date}</td>
      <td><span class="badge badge-success">Live DB</span></td>
    </tr>
  `);

  const content = `
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-[2.5rem] font-bold tracking-tight text-on-primary-fixed leading-none mb-3">Submission Archive</h1>
        <p class="text-on-surface-variant text-sm">Full chronological record of your industrial data submissions synced with the central repository.</p>
      </div>
      <button class="px-6 py-3 bg-on-primary-fixed text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2" onclick="exportHistoryData()">
        <span class="material-symbols-outlined text-[18px]">cloud_download</span> Export Records
      </button>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex flex-wrap gap-4 mb-8 p-1.5 bg-surface-container-low rounded-2xl w-fit">
      <button class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${historyFilter === 'all' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}" onclick="historyFilter='all';historyPage=1;renderSubmissionHistory()">All Categories</button>
      ${['Investment', 'Employment', 'Utilities', 'Business', 'CSR'].map(cat => `
        <button class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${historyFilter === cat ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}" onclick="historyFilter='${cat}';historyPage=1;renderSubmissionHistory()">
          ${cat}
        </button>
      `).join('')}
    </div>

    <div class="bg-surface-container-lowest rounded-3xl border border-white/5 shadow-sm overflow-hidden mb-12">
      <div class="px-8 py-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-low/30">
        <h3 class="text-lg font-bold text-on-surface">Data Log <span class="text-xs font-medium text-on-surface-variant ml-2">${filtered.length} entries found</span></h3>
        <div class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Synced with cloud
        </div>
      </div>
      <div class="p-2">
        ${Components.dataTable(
          ['Year', 'Resource Category', 'Record Attribution', 'Submission Date', 'Verification'],
          rows,
          { page: historyPage, perPage: 10 }
        )}
      </div>
    </div>
  `;

  await Components.renderLayout(content, 'submission-history');
  Components.setPageTitle('Submission History');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  window._tablePage = (p) => { historyPage = p; renderSubmissionHistory(); };
}

window.exportHistoryData = () => {
    // Logic extracted to avoid issues with locally scoped variables in window
    Toast.info('Preparing Export', 'Generating CSV from cloud data...');
};
