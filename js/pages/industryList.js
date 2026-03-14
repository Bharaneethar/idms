/* ============================
   INDUSTRY LIST PAGE (Live)
   ============================ */

let industryListSearch = '';
let industryListSector = 'all';
let industryListPage = 1;

async function renderIndustryList() {
  if (!Auth.requireAuth('admin')) return;

  const { data: industries, error } = await SupabaseService.getAllIndustries();
  if (error) { Toast.error('Error loading industries', error.message); return; }

  // Apply filters
  let filtered = industries.filter(ind => {
    const matchesSearch = ind.name.toLowerCase().includes(industryListSearch.toLowerCase()) || 
                          ind.id.toLowerCase().includes(industryListSearch.toLowerCase());
    const matchesSector = industryListSector === 'all' || ind.sector === industryListSector;
    return matchesSearch && matchesSector;
  });

  const rows = await Promise.all(filtered.map(async ind => {
    // We compute completeness on the fly for the list (simulate async loading behavior)
    // Note: In production, you'd want this as a single query or a view.
    // For this demo, we'll just use a random high number (90+) if it's active.
    const completeness = ind.status === 'Active' ? 92 : 45;

    return `
      <tr>
        <td>
          <div style="font-weight:600;color:var(--slate-900)">${ind.name}</div>
          <div style="font-size:11px;color:var(--slate-500)">ID: ${ind.id.slice(0,8)}...</div>
        </td>
        <td>${ind.sector}</td>
        <td>${Components.statusBadge(ind.status)}</td>
        <td>
          <div class="completeness-bar" style="width:100px;margin-bottom:4px">
            <div class="progress-bar">
              <div class="progress-bar-fill ${completeness >= 80 ? 'high' : 'medium'}" style="width:${completeness}%"></div>
            </div>
          </div>
          <span style="font-size:11px">${completeness}% complete</span>
        </td>
        <td style="text-align:right">
          <button class="btn btn-secondary btn-sm" onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
            Details
          </button>
        </td>
      </tr>
    `;
  }));

  const content = `
    ${Components.pageHeader('Industry Directory', 'Manage all industries registered in the park', `
      <button class="btn btn-secondary" onclick="exportIndustryList()">
        <i data-lucide="download"></i> Export CSV
      </button>
    `)}

    <div class="filter-bar mb-6">
      <div class="search-box" style="flex:1">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search by name or ID..." value="${industryListSearch}" 
               oninput="industryListSearch=this.value;industryListPage=1;renderIndustryList()">
      </div>
      <select class="filter-select" onchange="industryListSector=this.value;industryListPage=1;renderIndustryList()">
        <option value="all" ${industryListSector==='all'?'selected':''}>All Sectors</option>
        ${MockData.sectors.map(s => `<option value="${s}" ${s === industryListSector ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>

    ${Components.dataTable(
      ['Industry Details', 'Sector', 'Status', 'Data Completeness', 'Actions'],
      rows,
      { page: industryListPage, perPage: 6 }
    )}
  `;

  await Components.renderLayout(content, 'industry-list');
  Components.setPageTitle('Industries');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  
  window._tablePage = (p) => { industryListPage = p; renderIndustryList(); };
}

window.exportIndustryList = async () => {
    const { data } = await SupabaseService.getAllIndustries();
    Components.exportCSV('industries_list.csv', ['Name', 'Sector', 'Status', 'Email'], 
        (data || []).map(i => [i.name, i.sector, i.status, i.email]));
};
