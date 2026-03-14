/* ============================
   INDUSTRY PROFILE PAGE (Live)
   ============================ */

async function renderIndustryProfile() {
  if (!Auth.requireAuth('industry')) return;

  const industryId = Auth.getIndustryId();
  const industry = await DataService.getIndustry(industryId);
  if (!industry) { Router.navigate('industry-dashboard'); return; }

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
      <div style="margin-left:auto">
        ${Components.statusBadge(industry.status)}
      </div>
    </div>

    ${Components.pageHeader('Industry Profile', 'Manage your company information', `
      <button class="btn btn-primary" onclick="toggleProfileEdit()">
        <i data-lucide="pencil"></i> Edit Profile
      </button>
    `)}

    <div id="profile-view">
      <div class="card">
        <div class="card-body">
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-item-label">Industry Name</div>
              <div class="detail-item-value">${industry.name}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Plot Number</div>
              <div class="detail-item-value">${industry.plot_number || 'N/A'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Sector</div>
              <div class="detail-item-value">${industry.sector}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Contact Person</div>
              <div class="detail-item-value">${industry.contact_person}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Phone</div>
              <div class="detail-item-value">${industry.phone || 'N/A'}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Email</div>
              <div class="detail-item-value">${industry.email}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Status</div>
              <div class="detail-item-value">${Components.statusBadge(industry.status)}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item-label">Registered Since</div>
              <div class="detail-item-value">${new Date(industry.registered_at).toLocaleDateString('en-IN', {year:'numeric',month:'long',day:'numeric'})}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="profile-edit" style="display:none">
      <div class="form-section">
        <div class="form-section-title"><i data-lucide="building-2"></i> Edit Profile</div>
        <form onsubmit="saveProfile(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Industry Name <span class="required">*</span></label>
              <input type="text" id="edit-name" class="form-input" value="${industry.name}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Plot Number</label>
              <input type="text" id="edit-plot" class="form-input" value="${industry.plot_number || ''}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Sector</label>
              <select id="edit-sector" class="form-select">
                ${MockData.sectors.map(s => `<option value="${s}" ${s === industry.sector ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Contact Person</label>
              <input type="text" id="edit-contact" class="form-input" value="${industry.contact_person}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" id="edit-phone" class="form-input" value="${industry.phone || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" id="edit-email" class="form-input" value="${industry.email}">
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button type="submit" class="btn btn-primary" id="save-profile-btn"><i data-lucide="check"></i> Save Changes</button>
            <button type="button" class="btn btn-secondary" onclick="toggleProfileEdit()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  await Components.renderLayout(content, 'industry-profile');
  Components.setPageTitle('My Profile');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleProfileEdit() {
  const view = document.getElementById('profile-view');
  const edit = document.getElementById('profile-edit');
  if (view.style.display === 'none') {
    view.style.display = 'block';
    edit.style.display = 'none';
  } else {
    view.style.display = 'none';
    edit.style.display = 'block';
  }
}

async function saveProfile(e) {
  e.preventDefault();
  const btn = document.getElementById('save-profile-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="spinner"></i> Saving...';

  const industryId = Auth.getIndustryId();
  const updates = {
    name: document.getElementById('edit-name').value,
    plot_number: document.getElementById('edit-plot').value,
    sector: document.getElementById('edit-sector').value,
    contact_person: document.getElementById('edit-contact').value,
    phone: document.getElementById('edit-phone').value,
    email: document.getElementById('edit-email').value,
  };

  const { error } = await SupabaseService.updateIndustryProfile(industryId, updates);
  
  if (error) {
    Toast.error('Save Failed', error.message);
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="check"></i> Save Changes';
    lucide.createIcons();
  } else {
    Toast.success('Profile Updated', 'Your industry profile has been saved to the cloud.');
    renderIndustryProfile();
  }
}
