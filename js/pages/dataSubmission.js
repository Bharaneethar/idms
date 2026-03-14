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
    ${Components.pageHeader('Submit Operational Data', 'Update your industry\'s operational information')}

    <div class="tabs">
      ${tabs.map(t => `
        <button class="tab ${t.id === currentTab ? 'active' : ''}" onclick="switchSubmissionTab('${t.id}')" id="tab-${t.id}">
          <i data-lucide="${t.icon}" style="width:15px;height:15px;margin-right:6px;vertical-align:middle"></i>
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div id="submission-form-container">
      ${getSubmissionForm(currentTab)}
    </div>
  `;

  await Components.renderLayout(content, 'data-submission');
  Components.setPageTitle('Submit Data');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchSubmissionTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab)?.classList.add('active');
  document.getElementById('submission-form-container').innerHTML = getSubmissionForm(tab);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getSubmissionForm(tab) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map(y => `<option value="${y}">${y}</option>`).join('');
  
  const yearField = `
    <div class="form-group">
      <label class="form-label">Year <span class="required">*</span></label>
      <select class="form-select" id="sub-year" required>${yearOptions}</select>
    </div>
  `;

  const forms = {
    investment: `
      <div class="form-section">
        <div class="form-section-title"><i data-lucide="indian-rupee"></i> Investment Data</div>
        <form onsubmit="handleDataSubmit(event, 'investment_data')">
          ${yearField}
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Initial Investment (₹) <span class="required">*</span></label>
              <input type="number" id="sub-initial-inv" class="form-input" placeholder="e.g. 15000000" required>
            </div>
            <div class="form-group">
              <label class="form-label">Additional Investment (₹)</label>
              <input type="number" id="sub-add-inv" class="form-input" placeholder="e.g. 2000000">
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-4" id="sub-btn"><i data-lucide="save"></i> Submit Investment Data</button>
        </form>
      </div>
    `,
    employment: `
      <div class="form-section">
        <div class="form-section-title"><i data-lucide="users"></i> Employment Data</div>
        <form onsubmit="handleDataSubmit(event, 'employment_data')">
          ${yearField}
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Permanent Employees <span class="required">*</span></label>
              <input type="number" id="sub-perm" class="form-input" placeholder="e.g. 120" required>
            </div>
            <div class="form-group">
              <label class="form-label">Contract Employees</label>
              <input type="number" id="sub-cont" class="form-input" placeholder="e.g. 45">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Male Employees</label>
              <input type="number" id="sub-male" class="form-input" placeholder="e.g. 130">
            </div>
            <div class="form-group">
              <label class="form-label">Female Employees</label>
              <input type="number" id="sub-female" class="form-input" placeholder="e.g. 35">
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-4" id="sub-btn"><i data-lucide="save"></i> Submit Employment Data</button>
        </form>
      </div>
    `,
    utilities: `
      <div class="form-section">
        <div class="form-section-title"><i data-lucide="droplets"></i> Utilities Usage Data</div>
        <form onsubmit="handleDataSubmit(event, 'utilities_data')">
          ${yearField}
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Water Consumption (KL) <span class="required">*</span></label>
              <input type="number" id="sub-water" class="form-input" placeholder="e.g. 5000" required>
            </div>
            <div class="form-group">
              <label class="form-label">Power Consumption (kWh) <span class="required">*</span></label>
              <input type="number" id="sub-power" class="form-input" placeholder="e.g. 25000" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-4" id="sub-btn"><i data-lucide="save"></i> Submit Utilities Data</button>
        </form>
      </div>
    `,
    turnover: `
      <div class="form-section">
        <div class="form-section-title"><i data-lucide="trending-up"></i> Business Performance Data</div>
        <form onsubmit="handleDataSubmit(event, 'turnover_data')">
          ${yearField}
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Annual Turnover (₹) <span class="required">*</span></label>
              <input type="number" id="sub-turn" class="form-input" placeholder="e.g. 50000000" required>
            </div>
            <div class="form-group">
              <label class="form-label">Production Capacity (%)</label>
              <input type="number" id="sub-cap" class="form-input" placeholder="e.g. 85" min="0" max="100">
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-4" id="sub-btn"><i data-lucide="save"></i> Submit Business Data</button>
        </form>
      </div>
    `,
    csr: `
      <div class="form-section">
        <div class="form-section-title"><i data-lucide="heart-handshake"></i> CSR Activities</div>
        <form onsubmit="handleDataSubmit(event, 'csr_activities')">
          ${yearField}
          <div class="form-group">
            <label class="form-label">CSR Program Description <span class="required">*</span></label>
            <textarea id="sub-desc" class="form-textarea" placeholder="Describe your CSR activities..." rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">CSR Expenditure (₹) <span class="required">*</span></label>
            <input type="number" id="sub-exp" class="form-input" placeholder="e.g. 500000" required>
          </div>
          <button type="submit" class="btn btn-primary mt-4" id="sub-btn"><i data-lucide="save"></i> Submit CSR Data</button>
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
