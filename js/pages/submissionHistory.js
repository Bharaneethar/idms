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
    ${Components.pageHeader('Submission History', 'View all your past data submissions synced from the cloud', `
      <button class="btn btn-secondary" onclick="exportHistoryData()">
        <i data-lucide="download"></i> Export CSV
      </button>
    `)}

    <div class="filter-bar mb-4">
      <select class="filter-select" onchange="historyFilter=this.value;historyPage=1;renderSubmissionHistory()">
        <option value="all" ${historyFilter==='all'?'selected':''}>All Categories</option>
        <option value="Investment" ${historyFilter==='Investment'?'selected':''}>Investment</option>
        <option value="Employment" ${historyFilter==='Employment'?'selected':''}>Employment</option>
        <option value="Utilities" ${historyFilter==='Utilities'?'selected':''}>Utilities</option>
        <option value="Business" ${historyFilter==='Business'?'selected':''}>Business</option>
        <option value="CSR" ${historyFilter==='CSR'?'selected':''}>CSR</option>
      </select>
      <span class="text-sm text-slate-500">${filtered.length} records found</span>
    </div>

    ${Components.dataTable(
      ['Year', 'Category', 'Details', 'Synced On', 'Status'],
      rows,
      { page: historyPage, perPage: 8 }
    )}
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
