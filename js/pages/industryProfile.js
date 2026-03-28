/* ============================
   INDUSTRY PROFILE PAGE (Live)
   ============================ */

async function renderIndustryProfile() {
  if (!Auth.requireAuth('industry')) return;

  const industryId = Auth.getIndustryId();
  const industry = await DataService.getIndustry(industryId);
  if (!industry) { Router.navigate('industry-dashboard'); return; }

  const initial = industry.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const content = `
    <!-- Profile Hero Section -->
    <section class="mb-12">
      <div class="bg-on-primary-fixed rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-slate-900 shadow-2xl">
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
          <p class="text-slate-400 font-medium text-lg mb-4">Industrial Estate - Phase III, Plot ${industry.plot_number || '42-B'}</p>
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
        
        <div class="relative z-10 md:text-right">
          <button class="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/10 font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2" onclick="toggleProfileEdit()">
            <span class="material-symbols-outlined text-base">edit</span> Edit Profile
          </button>
        </div>
      </div>
    </section>

    <div id="profile-view">
      <div class="grid grid-cols-12 gap-10">
        <div class="col-span-12 lg:col-span-8">
          <div class="mb-8">
            <h3 class="text-xl font-bold text-on-surface tracking-tight">Enterprise Overview</h3>
            <p class="text-on-surface-variant text-sm mt-1">Primary registration and contact information.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-container-high rounded-3xl overflow-hidden shadow-sm border border-surface-container-high">
            <!-- Contact Person -->
            <div class="bg-surface-container-lowest p-8 hover:bg-surface-container-low transition-colors duration-200">
              <p class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Contact Person</p>
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black">${industry.contact_person[0]}</div>
                <div>
                  <p class="text-on-surface font-bold text-base">${industry.contact_person}</p>
                  <p class="text-on-surface-variant text-[11px] font-medium">Authorized Representative</p>
                </div>
              </div>
            </div>
            <!-- Registration Date -->
            <div class="bg-surface-container-lowest p-8 hover:bg-surface-container-low transition-colors duration-200">
              <p class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Registration Date</p>
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <p class="text-on-surface font-bold text-base">${new Date(industry.registered_at).toLocaleDateString('en-IN', {year:'numeric',month:'short',day:'numeric'})}</p>
                  <p class="text-on-surface-variant text-[11px] font-medium">Verified by SIPCOT</p>
                </div>
              </div>
            </div>
            <!-- Email -->
            <div class="bg-surface-container-lowest p-8 hover:bg-surface-container-low transition-colors duration-200 col-span-1 md:col-span-2">
              <p class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Communication Endpoint</p>
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p class="text-on-surface font-bold text-base">${industry.email}</p>
                  <p class="text-on-surface-variant text-[11px] font-medium">Official correspondence for IDMS notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 space-y-8">
          <div class="bg-surface-container-lowest p-8 rounded-3xl border border-white/5 shadow-sm">
            <h4 class="text-lg font-bold mb-6">Security & Logs</h4>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-on-surface-variant">Last Login</span>
                <span class="text-sm font-bold">14 May 2024, 09:42 AM</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-on-surface-variant">Profile Maturity</span>
                <span class="text-sm font-bold text-blue-600">High</span>
              </div>
              <button class="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-all">
                Reset Access Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="profile-edit" style="display:none" class="max-w-4xl mx-auto">
      <div class="bg-surface-container-lowest p-10 rounded-3xl border border-white/5 shadow-xl">
        <h3 class="text-2xl font-bold mb-8 text-on-surface">Update Profile Details</h3>
        <form onsubmit="saveProfile(event)" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Company Name</label>
              <input type="text" id="edit-name" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20 font-bold" value="${industry.name}" required>
            </div>
            <div class="space-y-2">
              <label class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Plot / Area</label>
              <input type="text" id="edit-plot" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20" value="${industry.plot_number || ''}">
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Industry Sector</label>
              <select id="edit-sector" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20 cursor-pointer font-semibold">
                ${MockData.sectors.map(s => `<option value="${s}" ${s === industry.sector ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Contact Representative</label>
              <input type="text" id="edit-contact" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20" value="${industry.contact_person}">
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Phone Number</label>
              <input type="tel" id="edit-phone" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20" value="${industry.phone || ''}">
            </div>
            <div class="space-y-2">
              <label class="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
              <input type="email" id="edit-email" class="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-secondary/20" value="${industry.email}">
            </div>
          </div>
          <div class="flex gap-4 pt-4">
            <button type="submit" class="flex-1 py-4 bg-secondary text-white font-bold rounded-2xl text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all" id="save-profile-btn">Commit Changes</button>
            <button type="button" class="px-8 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl text-sm uppercase tracking-widest hover:bg-surface-container-highest transition-all" onclick="toggleProfileEdit()">Cancel</button>
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
