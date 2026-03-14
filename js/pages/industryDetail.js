/* ============================
   INDUSTRY DETAIL PAGE (Live)
   ============================ */

async function renderIndustryDetail(params) {
  if (!Auth.requireAuth('admin')) return;
  Charts.destroyAll();

  const id = params?.id;
  if (!id) { Router.navigate('industry-list'); return; }

  // Fetch all industry data from the cloud
  const [industry, investments, employment, utilities, turnover, csr, notes] = await Promise.all([
    DataService.getIndustry(id),
    DataService.getInvestmentByIndustry(id),
    DataService.getEmploymentByIndustry(id),
    DataService.getUtilitiesByIndustry(id),
    DataService.getTurnoverByIndustry(id),
    DataService.getCSRByIndustry(id),
    DataService.getNotesByIndustry(id)
  ]);

  if (!industry) {
    Toast.error('Industry Not Found', 'Could not fetch industry data from the database.');
    return;
  }

  const content = `
    <div class="profile-header">
      <div class="profile-avatar">${industry.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
      <div class="profile-info">
        <h2>${industry.name}</h2>
        <p>Plot ${industry.plot_number || 'N/A'} · ${industry.sector}</p>
        <div class="profile-meta">
          <span><i data-lucide="mail" style="width:14px;height:14px"></i> ${industry.email}</span>
          <span><i data-lucide="phone" style="width:14px;height:14px"></i> ${industry.phone || 'N/A'}</span>
        </div>
      </div>
      <div style="margin-left:auto; display:flex; gap:10px">
        ${Components.statusBadge(industry.status)}
        <button class="btn btn-secondary btn-sm" onclick="Router.navigate('industry-list')">Back to List</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <!-- Left Column: Info & Notes -->
      <div class="lg:col-span-1">
        <div class="card mb-6">
          <div class="card-header"><span class="card-title">Profile Information</span></div>
          <div class="card-body">
            <div class="space-y-4">
              <div><label class="text-xs text-slate-500 uppercase font-bold">Industry Name</label><p class="text-slate-900">${industry.name}</p></div>
              <div><label class="text-xs text-slate-500 uppercase font-bold">Sector</label><p class="text-slate-900">${industry.sector}</p></div>
              <div><label class="text-xs text-slate-500 uppercase font-bold">Contact Person</label><p class="text-slate-900">${industry.contact_person}</p></div>
              <div><label class="text-xs text-slate-500 uppercase font-bold">Industry ID</label><p class="text-slate-400 text-xs">${industry.id}</p></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Compliance Notes</span></div>
          <div class="card-body">
            <div class="space-y-4">
              ${notes.length === 0 ? '<p class="text-sm text-slate-400">No admin notes yet.</p>' : notes.map(n => `
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div class="flex justify-between mb-1"><span class="font-bold text-xs">${n.author}</span><span class="text-[10px] text-slate-400">${n.date}</span></div>
                  <p class="text-xs text-slate-600">${n.text}</p>
                </div>
              `).join('')}
              <div class="mt-4 pt-4 border-t border-slate-100">
                <textarea id="new-note" class="form-textarea text-xs w-full" rows="3" placeholder="Add a compliance note..."></textarea>
                <button class="btn btn-primary btn-sm w-full mt-2" onclick="addIndustryNote('${industry.id}')">Add Note</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Charts & Data -->
      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card"><div class="card-header"><span class="card-title">Investment Trend</span></div><div class="card-body"><canvas id="det-inv-chart"></canvas></div></div>
          <div class="card"><div class="card-header"><span class="card-title">Employment Split</span></div><div class="card-body"><canvas id="det-emp-chart"></canvas></div></div>
          <div class="card"><div class="card-header"><span class="card-title">Utility Trends</span></div><div class="card-body"><canvas id="det-util-chart"></canvas></div></div>
          <div class="card"><div class="card-header"><span class="card-title">Capacity (%)</span></div><div class="card-body"><canvas id="det-turn-chart"></canvas></div></div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">CSR Initiatives</span></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Year</th><th>Description</th><th style="text-align:right">Expenditure</th></tr></thead>
              <tbody>
                ${csr.length === 0 ? '<tr><td colspan="3" style="text-align:center;color:var(--slate-400);padding:20px">No CSR activities recorded</td></tr>' : csr.map(c => `
                  <tr><td>${c.year}</td><td>${c.description}</td><td style="text-align:right">₹${c.expenditure.toLocaleString('en-IN')}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  await Components.renderLayout(content, 'industry-detail');
  Components.setPageTitle(industry.name);
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Load Charts
  setTimeout(() => {
    if (investments.length > 0) {
      Charts.lineChart('det-inv-chart', investments.map(i => i.year.toString()), [
        { label: 'Investment (₹)', data: investments.map(i => i.initial_investment + i.additional_investment) }
      ]);
    }
    if (employment.length > 0) {
        const last = employment[employment.length - 1];
        Charts.doughnutChart('det-emp-chart', ['Male', 'Female'], [last.male_employees, last.female_employees]);
    }
    if (utilities.length > 0) {
        Charts.lineChart('det-util-chart', utilities.map(u => u.year.toString()), [
            { label: 'Power (kWh)', data: utilities.map(u => u.power_consumption) },
            { label: 'Water (KL)', data: utilities.map(u => u.water_consumption) }
        ]);
    }
    if (turnover.length > 0) {
        Charts.barChart('det-turn-chart', turnover.map(t => t.year.toString()), [
            { label: 'Capacity (%)', data: turnover.map(t => t.production_capacity) }
        ]);
    }
  }, 100);
}

async function addIndustryNote(id) {
    const text = document.getElementById('new-note').value;
    if (!text) return;
    const admin = Auth.getUser();
    const { error } = await SupabaseService.addAdminNote(id, admin.id, text);
    if (error) { Toast.error('Error', error.message); }
    else { Toast.success('Note Added', 'Your comment has been saved.'); renderIndustryDetail({id}); }
}
