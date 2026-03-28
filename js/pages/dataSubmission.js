/* ============================
   DATA SUBMISSION PAGE (Live)
   ============================ */

let currentTab = 'investment';

async function renderDataSubmission() {
  if (!Auth.requireAuth('industry')) return;

  const tabs = [
    { id: 'investment', label: 'Investment', icon: 'indian-rupee' },
    { id: 'employment', label: 'Employment', icon: 'users' },
    { id: 'utilities', label: 'Utilities', icon: 'droplets' },
    { id: 'turnover', label: 'Business', icon: 'trending-up' },
    { id: 'csr', label: 'CSR', icon: 'heart-handshake' },
  ];

  const content = `
    <div class="mb-10">
      <h1 class="text-[2.5rem] font-bold tracking-tight text-on-primary-fixed leading-none mb-3">Submit Operational Data</h1>
      <p class="text-on-surface-variant text-sm">Update your industry's annual operational information for compliance monitoring.</p>
    </div>

    <!-- Modern Tab Navigation -->
    <div class="flex flex-wrap gap-4 mb-8 p-1.5 bg-surface-container-low rounded-2xl w-fit">
      ${tabs.map(t => `
        <button class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${t.id === currentTab ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}" onclick="switchSubmissionTab('${t.id}')" id="tab-${t.id}">
          <span class="material-symbols-outlined text-[18px]">${t.id === 'investment' ? 'payments' : t.id === 'employment' ? 'groups' : t.id === 'utilities' ? 'bolt' : t.id === 'turnover' ? 'speed' : 'volunteer_activism'}</span>
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div id="submission-form-container" class="max-w-3xl">
      ${getSubmissionForm(currentTab)}
    </div>
  `;

  await Components.renderLayout(content, 'data-submission');
  Components.setPageTitle('Submit Data');
}

function switchSubmissionTab(tab) {
  currentTab = tab;
  renderDataSubmission();
}

function getSubmissionForm(tab) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map(y => `<option value="${y}">${y}</option>`).join('');
  
  const labelClass = "text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block";
  const inputClass = "w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/40";
  const selectClass = "w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20 transition-all";

  const yearField = `
    <div class="mb-6">
      <label class="${labelClass}">Financial Year <span class="text-red-500">*</span></label>
      <select class="${selectClass}" id="sub-year" required>${yearOptions}</select>
    </div>
  `;

  const forms = {
    investment: `
      <div class="bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm">
        <h3 class="text-xl font-bold mb-6 text-on-surface">Investment Details</h3>
        <form onsubmit="handleDataSubmit(event, 'investment_data')">
          ${yearField}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="${labelClass}">Initial Investment (₹)</label>
              <input type="number" id="sub-initial-inv" class="${inputClass}" placeholder="e.g. 15000000" required>
            </div>
            <div>
              <label class="${labelClass}">Additional Investment (₹)</label>
              <input type="number" id="sub-add-inv" class="${inputClass}" placeholder="e.g. 2000000">
            </div>
          </div>
          <button type="submit" class="w-full py-4 bg-secondary text-white font-bold rounded-2xl text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]" id="sub-btn">Save Records</button>
        </form>
      </div>
    `,
    employment: `
      <div class="bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm">
        <h3 class="text-xl font-bold mb-6 text-on-surface">Workforce Statistics</h3>
        <form onsubmit="handleDataSubmit(event, 'employment_data')">
          ${yearField}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="${labelClass}">Permanent Employees</label>
              <input type="number" id="sub-perm" class="${inputClass}" placeholder="e.g. 120" required>
            </div>
            <div>
              <label class="${labelClass}">Contractual Staff</label>
              <input type="number" id="sub-cont" class="${inputClass}" placeholder="e.g. 45">
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="${labelClass}">Male Employees</label>
              <input type="number" id="sub-male" class="${inputClass}" placeholder="e.g. 130">
            </div>
            <div>
              <label class="${labelClass}">Female Employees</label>
              <input type="number" id="sub-female" class="${inputClass}" placeholder="e.g. 35">
            </div>
          </div>
          <button type="submit" class="w-full py-4 bg-secondary text-white font-bold rounded-2xl text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]" id="sub-btn">Update Workforce</button>
        </form>
      </div>
    `,
    utilities: `
      <div class="bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm">
        <h3 class="text-xl font-bold mb-6 text-on-surface">Utility Metrics</h3>
        <form onsubmit="handleDataSubmit(event, 'utilities_data')">
          ${yearField}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="${labelClass}">Water Consumption (KL)</label>
              <input type="number" id="sub-water" class="${inputClass}" placeholder="e.g. 5000" required>
            </div>
            <div>
              <label class="${labelClass}">Power Consumption (kWh)</label>
              <input type="number" id="sub-power" class="${inputClass}" placeholder="e.g. 25000" required>
            </div>
          </div>
          <button type="submit" class="w-full py-4 bg-secondary text-white font-bold rounded-2xl text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]" id="sub-btn">Log Utility Data</button>
        </form>
      </div>
    `,
    turnover: `
      <div class="bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm">
        <h3 class="text-xl font-bold mb-6 text-on-surface">Business Performance</h3>
        <form onsubmit="handleDataSubmit(event, 'turnover_data')">
          ${yearField}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="${labelClass}">Annual Turnover (₹)</label>
              <input type="number" id="sub-turn" class="${inputClass}" placeholder="e.g. 50000000" required>
            </div>
            <div>
              <label class="${labelClass}">Capacity Utilization (%)</label>
              <input type="number" id="sub-cap" class="${inputClass}" placeholder="e.g. 85" min="0" max="100">
            </div>
          </div>
          <button type="submit" class="w-full py-4 bg-secondary text-white font-bold rounded-2xl text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]" id="sub-btn">Submit Figures</button>
        </form>
      </div>
    `,
    csr: `
      <div class="bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm">
        <h3 class="text-xl font-bold mb-6 text-on-surface">CSR & Community Impact</h3>
        <form onsubmit="handleDataSubmit(event, 'csr_activities')">
          ${yearField}
          <div class="mb-6">
            <label class="${labelClass}">Initiative Description</label>
            <textarea id="sub-desc" class="${inputClass}" placeholder="Describe your community impact programs..." rows="4" required></textarea>
          </div>
          <div class="mb-8">
            <label class="${labelClass}">Total Expenditure (₹)</label>
            <input type="number" id="sub-exp" class="${inputClass}" placeholder="e.g. 500000" required>
          </div>
          <button type="submit" class="w-full py-4 bg-secondary text-white font-bold rounded-2xl text-sm uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]" id="sub-btn">Record CSR Data</button>
        </form>
      </div>
    `,
  };

  return forms[tab] || forms.investment;
}

async function handleDataSubmit(e, table) {
  e.preventDefault();
  const btn = document.getElementById('sub-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="spinner"></i> Submitting...';

  const industryId = Auth.getIndustryId();
  const year = parseInt(document.getElementById('sub-year').value);
  
  let payload = { industry_id: industryId, year: year };

  if (table === 'investment_data') {
    payload.initial_investment = parseFloat(document.getElementById('sub-initial-inv').value) || 0;
    payload.additional_investment = parseFloat(document.getElementById('sub-add-inv').value) || 0;
  } else if (table === 'employment_data') {
    payload.permanent_employees = parseInt(document.getElementById('sub-perm').value) || 0;
    payload.contract_employees = parseInt(document.getElementById('sub-cont').value) || 0;
    payload.male_employees = parseInt(document.getElementById('sub-male').value) || 0;
    payload.female_employees = parseInt(document.getElementById('sub-female').value) || 0;
  } else if (table === 'utilities_data') {
    payload.water_consumption = parseFloat(document.getElementById('sub-water').value) || 0;
    payload.power_consumption = parseFloat(document.getElementById('sub-power').value) || 0;
  } else if (table === 'turnover_data') {
    payload.annual_turnover = parseFloat(document.getElementById('sub-turn').value) || 0;
    payload.production_capacity = parseInt(document.getElementById('sub-cap').value) || 0;
  } else if (table === 'csr_activities') {
    payload.description = document.getElementById('sub-desc').value;
    payload.expenditure = parseFloat(document.getElementById('sub-exp').value) || 0;
    // For CSR we insert instead of upsert if there's no year constraint
    const { error } = await SupabaseService.submitCsrData(payload);
    if (error) { Toast.error('Submission Error', error.message); btn.disabled = false; return; }
    Toast.success('CSR Data Recorded', 'Your CSR activity has been submitted successfully.');
    renderDataSubmission();
    return;
  }

  const { error } = await SupabaseService.submitData(table, payload);
  
  if (error) {
    Toast.error('Submission Error', error.message);
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="save"></i> Submit Data';
    lucide.createIcons();
  } else {
    Toast.success('Data Submitted!', `Your operational data has been recorded in the cloud.`);
    setTimeout(() => renderDataSubmission(), 500);
  }
}
