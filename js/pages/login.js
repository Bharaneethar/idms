/* ============================
   LOGIN PAGE
   ============================ */

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
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-subtitle">Sign in to access the Industrial Data Management System</p>

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

        <div class="auth-footer">
          Don't have an account? <a onclick="Router.navigate('register')">Register here</a>
        </div>

        <div class="demo-credentials">
          <h4>Demo Credentials</h4>
          <p><strong>Admin:</strong> admin@idms.com / admin123</p>
          <p><strong>Industry:</strong> industry@demo.com / industry123</p>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="demo-btn" onclick="demoLogin('admin')">Login as Admin</button>
            <button class="demo-btn" onclick="demoLogin('industry')">Login as Industry</button>
          </div>
        </div>
      </div>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
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

async function demoLogin(role) {
  const creds = role === 'admin'
    ? { email: 'admin@idms.com', password: 'admin123' }
    : { email: 'industry@demo.com', password: 'industry123' };

  document.getElementById('login-email').value = creds.email;
  document.getElementById('login-password').value = creds.password;

  const result = await Auth.login(creds.email, creds.password);
  if (result.success) {
    Toast.success('Welcome!', `Signed in as ${result.user.name}`);
    Router.navigate(result.user.role === 'admin' ? 'admin-dashboard' : 'industry-dashboard');
  } else {
    Toast.error('Demo Login Failed', result.error);
  }
}
