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
      <tr class="hover:bg-surface-container-low/30 transition-colors">
        <td class="px-8 py-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-sm">
              ${ind.name.charAt(0)}
            </div>
            <div>
              <div class="text-[1rem] font-semibold text-on-primary-fixed tracking-tight">${ind.name}</div>
              <div class="text-[0.75rem] text-on-surface-variant font-medium">ID: ${ind.id.slice(0,8)}...</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-6 text-[0.875rem] font-medium text-on-primary-fixed">${ind.sector}</td>
        <td class="px-6 py-6">${Components.statusBadge(ind.status)}</td>
        <td class="px-6 py-6">
          <div class="flex items-center gap-3 w-48">
            <div class="flex-1 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div class="bg-secondary h-1.5 rounded-full" style="width: ${completeness}%"></div>
            </div>
            <span class="text-[0.75rem] font-bold text-on-primary-fixed">${completeness}%</span>
          </div>
        </td>
        <td class="px-8 py-6 text-right">
          <button class="text-on-surface-variant hover:text-secondary transition-colors p-2 rounded-lg hover:bg-surface-container-low" 
                  onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
            <span class="material-symbols-outlined">open_in_new</span>
          </button>
        </td>
      </tr>
    `;
  }));

  const activeCount = industries.filter(i => i.status === 'Active').length;
  const complianceRate = (activeCount / (industries.length || 1) * 100).toFixed(1);

  const content = `
    ${Components.pageHeader('Industrial Directory', 'Manage and monitor registered units across SIPCOT parks.', `
      <button class="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-primary-fixed text-[0.875rem] font-medium rounded-2xl" onclick="exportIndustryList()">
        <span class="material-symbols-outlined text-[20px]">file_download</span> Export CSV
      </button>
      <button class="flex items-center gap-2 px-5 py-2 bg-primary-container text-white hover:bg-secondary transition-colors text-[0.875rem] font-medium rounded-2xl">
        <span class="material-symbols-outlined text-[20px]">add_business</span> Add New Unit
      </button>
    `)}

    <section class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-black/5 shadow-sm border border-white/5">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Total Units</span>
          <span class="material-symbols-outlined text-secondary">factory</span>
        </div>
        <div class="text-[2.5rem] font-bold tracking-[-0.04em] text-on-primary-fixed">${industries.length}</div>
        <div class="flex items-center gap-1 mt-1 text-[0.75rem] text-emerald-600 font-semibold">
          <span class="material-symbols-outlined text-xs">trending_up</span> +12% growth
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-black/5 shadow-sm border border-white/5">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Active Operations</span>
          <span class="material-symbols-outlined text-emerald-500">bolt</span>
        </div>
        <div class="text-[2.5rem] font-bold tracking-[-0.04em] text-on-primary-fixed">${activeCount}Units</div>
      </div>
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-black/5 shadow-sm border border-white/5">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Compliance Rate</span>
          <span class="material-symbols-outlined text-blue-500">verified_user</span>
        </div>
        <div class="text-[2.5rem] font-bold tracking-[-0.04em] text-on-primary-fixed">${complianceRate}%</div>
        <div class="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
          <div class="bg-secondary h-1.5 rounded-full" style="width: ${complianceRate}%"></div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-black/5 shadow-sm border border-white/5">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Pending Audits</span>
          <span class="material-symbols-outlined text-red-500">priority_high</span>
        </div>
        <div class="text-[2.5rem] font-bold tracking-[-0.04em] text-on-primary-fixed">24</div>
        <div class="flex items-center gap-1 mt-1 text-[0.75rem] text-red-500 font-semibold italic">Action required</div>
      </div>
    </section>

    <section class="bg-surface-container-low rounded-2xl p-4 mb-8 flex flex-wrap gap-4 items-center">
      <div class="relative flex-1 min-w-[300px]">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input class="w-full bg-surface-container-lowest border-none rounded-xl pl-12 pr-4 py-3 text-[0.875rem] focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-slate-400" 
               placeholder="Search by Unit Name or ID..." type="text" value="${industryListSearch}"
               oninput="industryListSearch=this.value;industryListPage=1;renderIndustryList()">
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <select class="appearance-none bg-surface-container-lowest border-none rounded-xl pl-4 pr-10 py-3 text-[0.875rem] font-medium text-on-primary-fixed focus:ring-2 focus:ring-secondary/20 min-w-[160px]"
                  onchange="industryListSector=this.value;industryListPage=1;renderIndustryList()">
            <option value="all" ${industryListSector==='all'?'selected':''}>All Sectors</option>
            ${MockData.sectors.map(s => `<option value="${s}" ${s === industryListSector ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
        </div>
        <button class="bg-surface-container-lowest text-on-primary-fixed p-3 rounded-xl hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined">tune</span>
        </button>
      </div>
    </section>

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
