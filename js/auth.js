/* ============================
   AUTH - Authentication Module
   ============================ */

const Auth = {
  currentUser: null,

  async login(email, password) {
    try {
      // 1. Try real Supabase Login
      const { data, error } = await SupabaseService.login(email, password);
      
      if (!error && data.user) {
        const sessionUser = data.user;
        const { data: userProfile, error: profileError } = await SupabaseService.getUserProfile(sessionUser.id);
        
        if (!profileError && userProfile) {
            let industryProfile = null;
            if (userProfile.role === 'industry') {
                const { data: indProfile } = await SupabaseService.getIndustryProfile(sessionUser.id);
                industryProfile = indProfile || null;
            }
            
            const user = {
                id: sessionUser.id,
                email: sessionUser.email,
                role: userProfile.role,
                name: userProfile.name,
                avatar: userProfile.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
                industry_id: industryProfile ? industryProfile.id : null
            };

            this.currentUser = user;
            localStorage.setItem('idms_user', JSON.stringify(user));
            return { success: true, user };
        }
      }
      
      // 2. Fallback to Demo Credentials if cloud auth fails OR if profile is missing
      // This is helpful if the user seeded public.users but auth.users signups failed due to rate limits
      if (email === 'admin@idms.com' || email === 'industry@demo.com') {
        const mockUser = (MockData.users || []).find(u => u.email === email && u.password === password);
        if (mockUser) {
          console.log('Demo Login Activated');
          this.currentUser = { ...mockUser };
          localStorage.setItem('idms_user', JSON.stringify(mockUser));
          return { success: true, user: mockUser, isDemo: true };
        }
      }
      
      throw error || new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  },

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('idms_user');
    await SupabaseService.logout();
    Router.navigate('login');
  },

  isAuthenticated() {
    if (this.currentUser) return true;
    const stored = localStorage.getItem('idms_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return true;
    }
    return false;
  },

  getUser() {
    if (!this.currentUser) {
      const stored = localStorage.getItem('idms_user');
      if (stored) this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  },

  getRole() {
    const user = this.getUser();
    return user ? user.role : null;
  },

  getIndustryId() {
    const user = this.getUser();
    return user ? user.industry_id : null;
  },

  requireAuth(role) {
    if (!this.isAuthenticated()) {
      Router.navigate('login');
      return false;
    }
    if (role && this.getRole() !== role) {
      Router.navigate(this.getRole() === 'admin' ? 'admin-dashboard' : 'industry-dashboard');
      return false;
    }
    return true;
  }
};
