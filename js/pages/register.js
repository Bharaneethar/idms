/* ============================
   REGISTER PAGE (Stitch UI Integrated)
   ============================ */

function renderRegisterPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="bg-surface text-on-surface min-h-screen flex flex-col industrial-pattern">
      <!-- Top Navigation -->
      <nav class="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-xl flex justify-between items-center h-16 px-8 shadow-xl shadow-black/20">
        <div class="flex items-center gap-8 cursor-pointer" onclick="Router.navigate('home')">
          <span class="text-lg font-bold tracking-[-0.02em] text-white">SIPCOT IDMS</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="bg-secondary text-white px-5 py-2 rounded-lg font-medium text-sm hover:opacity-90 active:scale-95 transition-all" onclick="Router.navigate('login')">Back to Login</button>
        </div>
      </nav>

      <!-- Main Registration Canvas -->
      <main class="flex-grow flex items-center justify-center px-4 py-24">
        <div class="w-full max-w-[600px]">
          <!-- Logo/Identity Centered -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-on-primary-fixed mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white text-3xl" style="font-variation-settings: 'FILL' 1;">add_business</span>
            </div>
            <h1 class="text-[1.75rem] font-semibold tracking-[-0.02em] text-on-surface leading-tight">Registration Desk</h1>
            <p class="text-on-surface-variant text-[0.875rem] mt-2 tracking-[-0.01em]">Create an account for your industrial unit to access the portal</p>
          </div>

          <!-- Elevated Glassmorphic Card -->
          <div class="glass-panel rounded-2xl p-8 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.1)] border border-white/50 bg-white/70 backdrop-blur-xl">
            <form id="register-form" class="space-y-6" onsubmit="handleRegister(event)">
              <!-- Industry Name -->
              <div class="space-y-1.5">
                <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" for="reg-name">Industry Name <span class="text-error">*</span></label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">corporate_fare</span>
                  <input class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all placeholder:text-outline-variant" id="reg-name" placeholder="e.g. Bharath Steel Corporation" type="text" required/>
                </div>
              </div>

              <!-- Contact & Sector Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" for="reg-contact">Contact Person <span class="text-error">*</span></label>
                  <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">person</span>
                    <input class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all placeholder:text-outline-variant" id="reg-contact" placeholder="Full name" type="text" required/>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" for="reg-sector">Sector <span class="text-error">*</span></label>
                  <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">category</span>
                    <select class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all appearance-none" id="reg-sector" required>
                      <option value="">Select sector</option>
                      ${MockData.sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" for="reg-email">Email Address <span class="text-error">*</span></label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">mail</span>
                  <input class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all placeholder:text-outline-variant" id="reg-email" placeholder="company@example.com" type="email" required/>
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-1.5">
                <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" for="reg-password">Security Key <span class="text-error">*</span></label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">vpn_key</span>
                  <input class="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all placeholder:text-outline-variant" id="reg-password" placeholder="Min 6 characters" type="password" minlength="6" required/>
                  <button class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface" type="button" onclick="togglePasswordVisibility('reg-password')">visibility</button>
                </div>
              </div>

              <!-- Plot Number -->
              <div class="space-y-1.5">
                <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" for="reg-plot">Plot Number</label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">map</span>
                  <input class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all placeholder:text-outline-variant" id="reg-plot" placeholder="e.g. A-101" type="text"/>
                </div>
              </div>

              <button class="w-full py-4 bg-on-primary-fixed text-white font-semibold rounded-xl text-[1rem] shadow-xl shadow-on-primary-fixed/20 hover:bg-secondary active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" type="submit">
                Create Account
                <span class="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div class="mt-8 pt-8 border-t border-outline-variant/10 text-center">
              <p class="text-[0.875rem] text-on-surface-variant">
                Already have an account? 
                <a class="text-secondary font-semibold hover:underline underline-offset-4 ml-1 cursor-pointer" onclick="Router.navigate('login')">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  const btn = input.nextElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'visibility_off';
  } else {
    input.type = 'password';
    btn.textContent = 'visibility';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('reg-name').value;
  const contact = document.getElementById('reg-contact').value;
  const sector = document.getElementById('reg-sector').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const plot = document.getElementById('reg-plot').value;
  
  const btn = document.querySelector('#register-form button[type="submit"]');
  const originalBtnContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Creating Account...';

  try {
    const { data: authData, error: authError } = await SupabaseService.register(email, password, {
        name: contact,
        role: 'industry',
        industry_name: name
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user account.");

    const userId = authData.user.id;
    await new Promise(resolve => setTimeout(resolve, 500));

    const { data: existingUser } = await SupabaseService.getUserProfile(userId).catch(() => ({ data: null }));
    
    if (!existingUser) {
        const { error: userInsertError } = await supabaseClient.from('users').insert({
            id: userId,
            email: email,
            role: 'industry',
            name: contact
        });
        if (userInsertError) console.error("Fallback user insert failed:", userInsertError);
    }

    const { error: indError } = await supabaseClient.from('industries').insert({
        user_id: userId,
        name: name,
        plot_number: plot,
        sector: sector,
        contact_person: contact,
        email: email,
        phone: 'Not Provided',
        status: 'Pending'
    });

    if (indError) console.error("Industry creation warning:", indError);

    Toast.success('Registration Successful!', 'Your industry account has been created. You can now sign in.');
    setTimeout(() => Router.navigate('login'), 2000);
    
  } catch (error) {
    console.error('Registration failed:', error);
    Toast.error('Registration Failed', error.message || 'An error occurred during registration.');
    btn.disabled = false;
    btn.innerHTML = originalBtnContent;
  }
}
