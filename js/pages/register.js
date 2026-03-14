/* ============================
   REGISTER PAGE
   ============================ */

function renderRegisterPage() {
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
        <h2 class="auth-title">Register Industry</h2>
        <p class="auth-subtitle">Create an account to start submitting your industrial data</p>

        <form id="register-form" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label class="form-label">Industry Name <span class="required">*</span></label>
            <input type="text" class="form-input" id="reg-name" placeholder="e.g. Bharath Steel Corporation" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contact Person <span class="required">*</span></label>
              <input type="text" class="form-input" id="reg-contact" placeholder="Full name" required>
            </div>
            <div class="form-group">
              <label class="form-label">Sector <span class="required">*</span></label>
              <select class="form-select" id="reg-sector" required>
                <option value="">Select sector</option>
                ${MockData.sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address <span class="required">*</span></label>
            <input type="email" class="form-input" id="reg-email" placeholder="company@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password <span class="required">*</span></label>
            <input type="password" class="form-input" id="reg-password" placeholder="Min 6 characters" minlength="6" required>
          </div>
          <div class="form-group">
            <label class="form-label">Plot Number</label>
            <input type="text" class="form-input" id="reg-plot" placeholder="e.g. A-101">
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-full">
            <i data-lucide="user-plus"></i>
            Create Account
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a onclick="Router.navigate('login')">Sign in</a>
        </div>
      </div>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleRegister(e) {
  e.preventDefault();
  Toast.success('Registration Successful!', 'Your industry account has been created. You can now sign in.');
  setTimeout(() => Router.navigate('login'), 1500);
}
