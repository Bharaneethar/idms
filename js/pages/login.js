/* ============================
   LOGIN PAGE (Stitch UI Integrated)
   ============================ */

let currentLoginRole = 'industry';

function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="bg-surface text-on-surface min-h-screen flex flex-col industrial-pattern">
      <!-- Top Navigation -->
      <nav class="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-xl flex justify-between items-center h-16 px-8 shadow-xl shadow-black/20">
        <div class="flex items-center gap-8 cursor-pointer" onclick="Router.navigate('home')">
          <span class="text-lg font-bold tracking-[-0.02em] text-white">SIPCOT IDMS</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="bg-secondary text-white px-5 py-2 rounded-lg font-medium text-sm hover:opacity-90 active:scale-95 transition-all" onclick="Router.navigate('home')">Back to Home</button>
        </div>
      </nav>

      <!-- Main Authentication Canvas -->
      <main class="flex-grow flex items-center justify-center px-4 py-24">
        <div class="w-full max-w-[480px]">
          <!-- Logo/Identity Centered -->
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-on-primary-fixed mb-4 shadow-lg">
              <span class="material-symbols-outlined text-white text-3xl" style="font-variation-settings: 'FILL' 1;">factory</span>
            </div>
            <h1 class="text-[1.75rem] font-semibold tracking-[-0.02em] text-on-surface leading-tight" id="login-title">Industry Portal</h1>
            <p class="text-on-surface-variant text-[0.875rem] mt-2 tracking-[-0.01em]" id="login-subtitle">Sign in to manage your industrial data</p>
          </div>

          <!-- Elevated Glassmorphic Card -->
          <div class="glass-panel rounded-2xl p-8 shadow-[0_40px_80px_-15px_rgba(15,23,42,0.1)] border border-white/50 bg-white/70 backdrop-blur-xl">
            <!-- Role Selector Tabs -->
            <div class="flex p-1 bg-surface-container rounded-xl mb-8">
              <button id="tab-industry" class="flex-1 py-2.5 text-[0.875rem] font-semibold tracking-[-0.01em] rounded-lg bg-surface-container-lowest text-on-surface shadow-sm transition-all duration-200" onclick="switchLoginRole('industry')">
                Industry Portal
              </button>
              <button id="tab-admin" class="flex-1 py-2.5 text-[0.875rem] font-medium tracking-[-0.01em] text-on-surface-variant hover:text-on-surface transition-all duration-200" onclick="switchLoginRole('admin')">
                Admin Portal
              </button>
            </div>

            <!-- Authentication Form -->
            <form id="login-form" class="space-y-6" onsubmit="handleLogin(event)">
              <div class="space-y-1.5">
                <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant px-1" for="login-email">Email Address</label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">mail</span>
                  <input class="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all placeholder:text-outline-variant" id="login-email" placeholder="company@example.com" type="email" required/>
                </div>
              </div>
              <div class="space-y-1.5">
                <div class="flex justify-between items-center px-1">
                  <label class="text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant" for="login-password">Password</label>
                  <a class="text-[0.6875rem] font-semibold text-secondary hover:underline underline-offset-4" href="#">Reset Password</a>
                </div>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline transition-colors group-focus-within:text-secondary">vpn_key</span>
                  <input class="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest text-[0.875rem] transition-all placeholder:text-outline-variant" id="login-password" placeholder="••••••••••••" type="password" required/>
                  <button class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface" type="button" onclick="togglePasswordVisibility('login-password')">visibility</button>
                </div>
              </div>

              <div id="login-error" style="display:none" class="bg-error-container text-on-error-container p-3 rounded-lg text-sm border border-error/20 mb-4"></div>

              <button class="w-full py-4 bg-on-primary-fixed text-white font-semibold rounded-xl text-[1rem] shadow-xl shadow-on-primary-fixed/20 hover:bg-secondary active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" type="submit" id="login-btn">
                Authenticate
                <span class="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div class="mt-8 pt-8 border-t border-outline-variant/10 text-center" id="login-footer">
              <p class="text-[0.875rem] text-on-surface-variant">
                New industrial unit? 
                <a class="text-secondary font-semibold hover:underline underline-offset-4 ml-1 cursor-pointer" onclick="Router.navigate('register')">Registration Desk</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchLoginRole(role) {
  currentLoginRole = role;
  
  const indTab = document.getElementById('tab-industry');
  const adminTab = document.getElementById('tab-admin');
  
  if (role === 'admin') {
    adminTab.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
    adminTab.classList.remove('text-on-surface-variant');
    indTab.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
    indTab.classList.add('text-on-surface-variant');
    
    document.getElementById('login-title').textContent = 'Admin Portal';
    document.getElementById('login-subtitle').textContent = 'Sign in to access the administrator dashboard';
    document.getElementById('login-footer').style.display = 'none';
  } else {
    indTab.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
    indTab.classList.remove('text-on-surface-variant');
    adminTab.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
    adminTab.classList.add('text-on-surface-variant');
    
    document.getElementById('login-title').textContent = 'Industry Portal';
    document.getElementById('login-subtitle').textContent = 'Sign in to manage your industrial data';
    document.getElementById('login-footer').style.display = 'block';
  }
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

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Authenticating...';

  const result = await Auth.login(email, password);
  
  if (result.success) {
    Toast.success('Welcome!', `Signed in as ${result.user.name}`);
    Router.navigate(result.user.role === 'admin' ? 'admin-dashboard' : 'industry-dashboard');
  } else {
    errorEl.textContent = result.error;
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = 'Authenticate <span class="material-symbols-outlined text-lg">arrow_forward</span>';
  }
}
