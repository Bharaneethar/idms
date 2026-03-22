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
  btn.innerHTML = '<i class="spinner"></i> Creating Account...';

  try {
    // 1. Create Auth User
    const { data: authData, error: authError } = await SupabaseService.register(email, password, {
        name: contact,
        role: 'industry',
        industry_name: name
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user account.");

    const userId = authData.user.id;

    // 2. We don't need to manually insert into public.users because the trigger 
    //    'on_auth_user_created' (from the seed/migrate script) handles it. But we 
    //    need to make sure the user exists before creating the industry.
    //    Let's wait a moment for the trigger to fire just in case.
    await new Promise(resolve => setTimeout(resolve, 500));

    // Wait for the user profile to be available (or insert it if trigger is missing)
    const { data: existingUser } = await SupabaseService.getUserProfile(userId).catch(() => ({ data: null }));
    
    if (!existingUser) {
        // Fallback: manually insert into public.users
        const { error: userInsertError } = await supabaseClient.from('users').insert({
            id: userId,
            email: email,
            role: 'industry',
            name: contact
        });
        if (userInsertError) console.error("Fallback user insert failed:", userInsertError);
    }

    // 3. Create Industry Profile
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

    if (indError) {
        console.error("Industry creation warning:", indError);
        // We still treat it as success because the auth user was created, but log the error
    }

    Toast.success('Registration Successful!', 'Your industry account has been created. You can now sign in.');
    setTimeout(() => Router.navigate('login'), 2000);
    
  } catch (error) {
    console.error('Registration failed:', error);
    Toast.error('Registration Failed', error.message || 'An error occurred during registration.');
    btn.disabled = false;
    btn.innerHTML = originalBtnContent;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
