/* ============================
   LOGIN PAGE
   ============================ */

let currentLoginRole = 'industry';

function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-icon">
            <i data-lucide="factory"></i>
          </div>
          <span class="auth-logo-text">IDMS Portal</span>
        </div>
        
        <div class="tabs" style="justify-content: center; margin-bottom: 24px;">
          <button class="tab active" id="tab-industry" type="button" onclick="switchLoginRole('industry')">Industry</button>
          <button class="tab" id="tab-admin" type="button" onclick="switchLoginRole('admin')">Admin</button>
        </div>

        <h2 class="auth-title" id="login-title">Industry Portal</h2>
        <p class="auth-subtitle" id="login-subtitle">Sign in to manage your industrial data</p>

        <form id="login-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" id="login-email" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" id="login-password" placeholder="Enter your password" required>
          </div>
          <div id="login-error" style="display:none" class="form-error mb-4"></div>
          <button type="submit" class="btn btn-primary btn-lg w-full" id="login-btn">
            <i data-lucide="log-in"></i>
            Sign In
          </button>
        </form>

        <div class="auth-footer" id="login-footer">
          Don't have an account? <a onclick="Router.navigate('register')">Register here</a>
        </div>
      </div>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchLoginRole(role) {
  currentLoginRole = role;
  
  // Update tabs
  document.getElementById('tab-industry').classList.toggle('active', role === 'industry');
  document.getElementById('tab-admin').classList.toggle('active', role === 'admin');
  
  // Update text
  const titleEl = document.getElementById('login-title');
  const subtitleEl = document.getElementById('login-subtitle');
  const footerEl = document.getElementById('login-footer');
  
  if (role === 'admin') {
    titleEl.textContent = 'Admin Portal';
    subtitleEl.textContent = 'Sign in to access the administrator dashboard';
    if (footerEl) footerEl.style.display = 'none';
  } else {
    titleEl.textContent = 'Industry Portal';
    subtitleEl.textContent = 'Sign in to manage your industrial data';
    if (footerEl) footerEl.style.display = 'block';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="spinner"></i> Signing in...';

  const result = await Auth.login(email, password);
  
  if (result.success) {
    Toast.success('Welcome!', `Signed in as ${result.user.name}`);
    Router.navigate(result.user.role === 'admin' ? 'admin-dashboard' : 'industry-dashboard');
  } else {
    errorEl.textContent = result.error;
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="log-in"></i> Sign In';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
