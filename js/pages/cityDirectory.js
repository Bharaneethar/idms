/* ============================
   CITY & PARK DIRECTORY PAGE (Admin)
   All industries grouped by city + park.
   Full filters, sorting, search, export.
   ============================ */

let dirFilter = { city: 'all', park: 'all', sector: 'all', status: 'all', search: '', sort: 'name-asc', view: 'table' };

async function renderCityDirectory() {
  if (!Auth.requireAuth('admin')) return;

  const { data: industries, error } = await SupabaseService.getAllIndustries();
  if (error) { Toast.error('Error', error.message); return; }

  const all = industries || [];

  // Build unique filter options
  const cities = [...new Set(all.map(i => i.city).filter(Boolean))].sort();
  const parks  = [...new Set(all.map(i => i.location).filter(Boolean))].sort();

  // Stats
  const statTotal   = all.length;
  const statActive  = all.filter(i => i.status === 'Active').length;
  const statCities  = cities.length || 1;
  const statParks   = parks.length  || 1;

  // Apply filters
  let filtered = all.filter(ind => {
    if (dirFilter.city   !== 'all' && ind.city     !== dirFilter.city)   return false;
    if (dirFilter.park   !== 'all' && ind.location  !== dirFilter.park)   return false;
    if (dirFilter.sector !== 'all' && ind.sector    !== dirFilter.sector) return false;
    if (dirFilter.status !== 'all' && ind.status    !== dirFilter.status) return false;
    if (dirFilter.search) {
      const q = dirFilter.search.toLowerCase();
      return ind.name.toLowerCase().includes(q) ||
             (ind.city     || '').toLowerCase().includes(q) ||
             (ind.location || '').toLowerCase().includes(q) ||
             (ind.sector   || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    switch(dirFilter.sort) {
      case 'name-asc':  return (a.name||'').localeCompare(b.name||'');
      case 'name-desc': return (b.name||'').localeCompare(a.name||'');
      case 'city':      return (a.city||'').localeCompare(b.city||'');
      case 'park':      return (a.location||'').localeCompare(b.location||'');
      case 'sector':    return (a.sector||'').localeCompare(b.sector||'');
      default: return 0;
    }
  });

  // Group by city then park for card view
  const grouped = {};
  filtered.forEach(ind => {
    const city = ind.city || '📍 Unspecified';
    const park = ind.location || 'General Area';
    if (!grouped[city]) grouped[city] = {};
    if (!grouped[city][park]) grouped[city][park] = [];
    grouped[city][park].push(ind);
  });

  const filterBar = `
    <div class="dir-filter-bar mb-6">
      <div class="search-input-wrapper" style="flex:1;max-width:300px">
        <i data-lucide="search"></i>
        <input type="text" class="search-input" placeholder="Search name, city, park..."
          value="${dirFilter.search}"
          oninput="dirFilter.search=this.value; renderCityDirectory()">
      </div>
      <select class="filter-select" onchange="dirFilter.city=this.value; renderCityDirectory()">
        <option value="all">🌆 All Cities</option>
        ${cities.map(c => `<option value="${c}" ${c===dirFilter.city?'selected':''}>${c}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="dirFilter.park=this.value; renderCityDirectory()">
        <option value="all">🏭 All Parks</option>
        ${parks.map(p => `<option value="${p}" ${p===dirFilter.park?'selected':''}>${p}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="dirFilter.sector=this.value; renderCityDirectory()">
        <option value="all">🏗️ All Sectors</option>
        ${MockData.sectors.map(s => `<option value="${s}" ${s===dirFilter.sector?'selected':''}>${s}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="dirFilter.status=this.value; renderCityDirectory()">
        <option value="all">All Status</option>
        <option value="Active"   ${dirFilter.status==='Active'  ?'selected':''}>Active</option>
        <option value="Inactive" ${dirFilter.status==='Inactive'?'selected':''}>Inactive</option>
        <option value="Pending"  ${dirFilter.status==='Pending' ?'selected':''}>Pending</option>
      </select>
      <select class="filter-select" onchange="dirFilter.sort=this.value; renderCityDirectory()">
        <option value="name-asc"  ${dirFilter.sort==='name-asc' ?'selected':''}>Name A–Z</option>
        <option value="name-desc" ${dirFilter.sort==='name-desc'?'selected':''}>Name Z–A</option>
        <option value="city"      ${dirFilter.sort==='city'     ?'selected':''}>City</option>
        <option value="park"      ${dirFilter.sort==='park'     ?'selected':''}>Park</option>
        <option value="sector"    ${dirFilter.sort==='sector'   ?'selected':''}>Sector</option>
      </select>
      <div class="dir-view-toggle">
        <button class="${dirFilter.view==='table'?'active':''}" onclick="dirFilter.view='table'; renderCityDirectory()" title="Table View">
          <i data-lucide="list"></i>
        </button>
        <button class="${dirFilter.view==='card'?'active':''}" onclick="dirFilter.view='card'; renderCityDirectory()" title="City Card View">
          <i data-lucide="layout-grid"></i>
        </button>
      </div>
    </div>
  `;

  // TABLE VIEW
  const tableView = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">All Industries (${filtered.length})</span>
        <button class="btn btn-secondary btn-sm" onclick="exportDirCSV()">
          <i data-lucide="download"></i> Export CSV
        </button>
      </div>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Industry Name</th>
              <th>City</th>
              <th>Park / Location</th>
              <th>Sector</th>
              <th>Status</th>
              <th>Contact</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--slate-400)">No industries match your filters</td></tr>` :
              filtered.map(ind => `
                <tr>
                  <td>
                    <div style="font-weight:600;color:var(--slate-900)">${ind.name}</div>
                    <div style="font-size:11px;color:var(--slate-500)">${ind.sector || '—'}</div>
                  </td>
                  <td>
                    <span class="dir-city-pill">${ind.city || '—'}</span>
                  </td>
                  <td>${ind.location || '<span style="color:var(--slate-400)">—</span>'}</td>
                  <td>${ind.sector || '—'}</td>
                  <td>${Components.statusBadge(ind.status)}</td>
                  <td>
                    <div style="font-size:12px">${ind.email || '—'}</div>
                    <div style="font-size:11px;color:var(--slate-400)">${ind.phone || ''}</div>
                  </td>
                  <td style="text-align:right">
                    <button class="btn btn-secondary btn-sm"
                      onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
                      <i data-lucide="eye" style="width:13px;height:13px"></i> View
                    </button>
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // CARD VIEW — grouped by city / park
  const cardView = Object.keys(grouped).length === 0
    ? `<div class="card"><div class="empty-state"><div class="empty-state-icon"><i data-lucide="building-2" style="width:60px;height:60px"></i></div><h3>No industries found</h3><p>Try adjusting your filters.</p></div></div>`
    : Object.entries(grouped).map(([city, parks]) => `
        <div class="dir-city-block mb-6">
          <div class="dir-city-header">
            <i data-lucide="map-pin" style="width:18px;height:18px;color:var(--primary-500)"></i>
            <h3>${city}</h3>
            <span class="badge badge-neutral">${Object.values(parks).flat().length} Industries</span>
          </div>
          ${Object.entries(parks).map(([park, inds]) => `
            <div class="dir-park-block">
              <div class="dir-park-header">
                <i data-lucide="factory" style="width:15px;height:15px;color:var(--slate-500)"></i>
                <span>${park}</span>
                <span style="font-size:12px;color:var(--slate-400);margin-left:auto">${inds.length} unit${inds.length!==1?'s':''}</span>
              </div>
              <div class="dir-industry-grid">
                ${inds.map(ind => `
                  <div class="dir-industry-card" onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
                    <div class="dir-industry-avatar">${(ind.name||'?').charAt(0)}</div>
                    <div class="dir-industry-info">
                      <div class="dir-industry-name">${ind.name}</div>
                      <div class="dir-industry-meta">${ind.sector || '—'}</div>
                    </div>
                    ${Components.statusBadge(ind.status)}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `).join('');

  const content = `
    <!-- Hero Section / Context -->
    <section class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div class="space-y-3">
        <span class="text-[11px] font-bold uppercase tracking-[0.05em] text-secondary">Directorate Portal</span>
        <h2 class="text-[3.5rem] leading-none font-bold tracking-[-0.04em] text-on-primary-fixed">Industrial Ecosystem.</h2>
        <p class="text-on-surface-variant max-w-xl text-sm mt-4">Comprehensive overview of SIPCOT industrial hubs, park distributions, and real-time development status across Tamil Nadu.</p>
      </div>
      <div class="flex gap-4">
        <div class="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-1 min-w-[160px]">
          <span class="text-on-surface-variant text-[0.6875rem] font-bold tracking-[0.05em] uppercase">Total Industries</span>
          <span class="text-3xl font-bold tracking-tight">${statTotal}</span>
        </div>
        <div class="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-1 min-w-[160px]">
          <span class="text-on-surface-variant text-[0.6875rem] font-bold tracking-[0.05em] uppercase">Active Units</span>
          <span class="text-3xl font-bold tracking-tight text-emerald-600">${statActive}</span>
        </div>
      </div>
    </section>

    <!-- Filter & Search Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-surface-container-low/50 p-4 rounded-3xl border border-white/10">
      <div class="relative flex-1">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60">search</span>
        <input class="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium" 
          placeholder="Search industrial hubs, cities, or sectors..." 
          type="text"
          value="${dirFilter.search}"
          oninput="dirFilter.search=this.value; renderCityDirectory()">
      </div>
      <div class="flex flex-wrap gap-3">
        <select class="px-4 py-3 bg-surface-container-lowest border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer" onchange="dirFilter.city=this.value; renderCityDirectory()">
          <option value="all">🌆 All Cities</option>
          ${cities.map(c => `<option value="${c}" ${c===dirFilter.city?'selected':''}>${c}</option>`).join('')}
        </select>
        <select class="px-4 py-3 bg-surface-container-lowest border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer" onchange="dirFilter.park=this.value; renderCityDirectory()">
          <option value="all">🏭 All Parks</option>
          ${parks.map(p => `<option value="${p}" ${p===dirFilter.park?'selected':''}>${p}</option>`).join('')}
        </select>
        <div class="flex bg-surface-container-lowest rounded-2xl p-1 shadow-sm border border-white/10">
          <button class="p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${dirFilter.view==='table' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}" onclick="dirFilter.view='table'; renderCityDirectory()">
            <span class="material-symbols-outlined text-[18px]">table_rows</span> Table
          </button>
          <button class="p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${dirFilter.view==='card' ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}" onclick="dirFilter.view='card'; renderCityDirectory()">
            <span class="material-symbols-outlined text-[18px]">grid_view</span> Bento
          </button>
        </div>
      </div>
    </div>

    ${dirFilter.view === 'table' ? `
      <!-- TABLE VIEW -->
      <div class="bg-surface-container-lowest rounded-3xl border border-white/5 shadow-sm overflow-hidden mb-12">
        <div class="px-8 py-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-low/30">
          <h3 class="text-lg font-bold text-on-surface">Consolidated Industrial Directory</h3>
          <button class="px-4 py-2 bg-on-primary-fixed text-white font-bold rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-secondary transition-all" onclick="exportDirCSV()">
            <span class="material-symbols-outlined text-sm">download</span> Export CSV
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-surface-container-low/50 text-rose-300">
                <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Industry & Sector</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">City / Park</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th class="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">Contact</th>
                <th class="px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container-low">
              ${filtered.length === 0 ? `<tr><td colspan="5" class="px-8 py-20 text-center text-on-surface-variant font-medium">No industries match your search criteria.</td></tr>` :
                filtered.map(ind => `
                  <tr class="hover:bg-surface-container-low/50 transition-colors group">
                    <td class="px-8 py-5">
                      <p class="text-sm font-bold text-on-surface">${ind.name}</p>
                      <p class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mt-0.5">${ind.sector || '—'}</p>
                    </td>
                    <td class="px-6 py-5">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">${ind.city || '—'}</span>
                        <span class="text-sm text-on-surface-variant">${ind.location || '—'}</span>
                      </div>
                    </td>
                    <td class="px-6 py-5">${Components.statusBadge(ind.status)}</td>
                    <td class="px-6 py-5">
                      <p class="text-xs font-medium text-on-surface group-hover:text-secondary mb-0.5">${ind.email || '—'}</p>
                      <p class="text-[10px] text-on-surface-variant">${ind.phone || ''}</p>
                    </td>
                    <td class="px-8 py-5 text-right">
                      <button class="p-2 text-on-surface-variant hover:text-secondary transition-colors" onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
                        <span class="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : `
      <!-- BENTO / CARD VIEW -->
      <div class="space-y-12">
        ${Object.keys(grouped).length === 0 ? `<div class="bg-surface-container-lowest rounded-3xl p-20 text-center border border-dashed border-outline-variant/50"><span class="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">location_off</span><p class="text-on-surface-variant font-medium">No results found in card view.</p></div>` : 
          Object.entries(grouped).map(([city, parks]) => `
            <div class="space-y-6">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">location_on</span>
                <h3 class="text-2xl font-bold tracking-tight text-on-surface">${city}</h3>
                <span class="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase rounded-full">${Object.values(parks).flat().length} Units</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${Object.entries(parks).map(([park, inds]) => `
                  <div class="bg-surface-container-lowest p-6 rounded-3xl border border-white/5 shadow-sm hover:shadow-md transition-all group">
                    <div class="flex justify-between items-start mb-6">
                      <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-secondary group-hover:text-white transition-all">
                        <span class="material-symbols-outlined">factory</span>
                      </div>
                      <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">${inds.length} Units</span>
                    </div>
                    <h4 class="text-lg font-bold mb-1">${park}</h4>
                    <p class="text-xs text-on-surface-variant mb-6">Industrial Park Infrastructure</p>
                    <div class="space-y-3 pt-6 border-t border-surface-container-low">
                      ${inds.slice(0, 3).map(ind => `
                        <div class="flex items-center justify-between group/item cursor-pointer" onclick="Router.navigate('industry-detail', {id: '${ind.id}'})">
                          <span class="text-sm font-semibold truncate group-hover/item:text-secondary">${ind.name}</span>
                          <span class="material-symbols-outlined text-sm opacity-0 group-hover/item:opacity-100 transition-opacity">chevron_right</span>
                        </div>
                      `).join('')}
                      ${inds.length > 3 ? `<p class="text-[10px] font-bold text-secondary uppercase tracking-widest pt-2">+ ${inds.length - 3} more units</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
      </div>
    `}
  `;

  await Components.renderLayout(content, 'city-directory');
  Components.setPageTitle('City & Park Directory');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Export CSV
window.exportDirCSV = async () => {
  const { data } = await SupabaseService.getAllIndustries();
  if (!data || data.length === 0) { Toast.warning('No Data', 'Nothing to export.'); return; }
  const rows = data.map(i => ({
    Name: i.name,
    City: i.city || '',
    Park: i.location || '',
    Sector: i.sector || '',
    Status: i.status,
    Email: i.email || '',
    Phone: i.phone || ''
  }));
  Components.exportCSV(rows, 'city_park_directory');
};
