/* ============================
   DATA SERVICE - LIVE SUPABASE
   ============================ */

const MockData = {
    // Demo Users for easy login fallback
    users: [
      { id: '00000000-0000-0000-0000-000000000001', email: 'admin@idms.com', password: 'admin123', role: 'admin', name: 'Rajesh Kumar', avatar: 'RK' },
      { id: '00000000-0000-0000-0000-000000000002', email: 'industry@demo.com', password: 'industry123', role: 'industry', name: 'Priya Sharma', avatar: 'PS', industry_id: '11111111-1111-1111-1111-111111111101' },
    ],
    sectors: ['Manufacturing', 'IT/Software', 'Chemical', 'Automotive', 'Pharmaceutical', 'Renewable Energy', 'Food Processing', 'Electronics', 'Textile', 'Construction', 'Aerospace'],
};

const DataService = {
  // --- INDIVIDUAL LOOKUPS ---
  async getIndustry(id) {
    const { data } = await SupabaseService.getIndustryById(id);
    return data;
  },
  async getInvestmentByIndustry(id) {
    const { data } = await SupabaseService.getInvestmentData(id);
    return data || [];
  },
  async getEmploymentByIndustry(id) {
    const { data } = await SupabaseService.getEmploymentData(id);
    return data || [];
  },
  async getUtilitiesByIndustry(id) {
    const { data } = await SupabaseService.getUtilitiesData(id);
    return data || [];
  },
  async getTurnoverByIndustry(id) {
    const { data } = await SupabaseService.getTurnoverData(id);
    return data || [];
  },
  async getCSRByIndustry(id) {
    const { data } = await SupabaseService.getCsrData(id);
    // Remap database fields to match UI expectations if necessary
    return (data || []).map(d => ({ ...d, year: d.year, description: d.description, expenditure: d.expenditure }));
  },
  async getNotesByIndustry(id) {
    const { data } = await SupabaseService.getAdminNotes(id);
    return (data || []).map(n => ({ 
        id: n.id, 
        author: n.users?.name || 'Admin', 
        date: new Date(n.created_at).toLocaleDateString(), 
        text: n.note_text 
    }));
  },
  async getNotifications(role) {
    const user = Auth.getUser();
    if (!user) return [];
    const { data } = await SupabaseService.getNotifications(user.id);
    return (data || []).map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        time: this.formatRelativeTime(n.created_at),
        read: n.is_read
    }));
  },

  // --- GLOBAL STATS ---
  async getTotalInvestment() {
    const { data } = await SupabaseService.getInvestmentData();
    const latest = {};
    (data || []).forEach(d => {
      if (!latest[d.industry_id] || d.year > latest[d.industry_id].year) latest[d.industry_id] = d;
    });
    return Object.values(latest).reduce((sum, d) => sum + Number(d.initial_investment) + Number(d.additional_investment), 0);
  },
  async getTotalEmployment() {
    const { data } = await SupabaseService.getEmploymentData();
    const latest = {};
    (data || []).forEach(d => {
      if (!latest[d.industry_id] || d.year > latest[d.industry_id].year) latest[d.industry_id] = d;
    });
    return Object.values(latest).reduce((sum, d) => sum + Number(d.permanent_employees) + Number(d.contract_employees), 0);
  },
  async getTotalWater() {
    const { data } = await SupabaseService.getUtilitiesData();
    const latest = {};
    (data || []).forEach(d => {
      if (!latest[d.industry_id] || d.year > latest[d.industry_id].year) latest[d.industry_id] = d;
    });
    return Object.values(latest).reduce((sum, d) => sum + Number(d.water_consumption), 0);
  },
  async getTotalPower() {
    const { data } = await SupabaseService.getUtilitiesData();
    const latest = {};
    (data || []).forEach(d => {
      if (!latest[d.industry_id] || d.year > latest[d.industry_id].year) latest[d.industry_id] = d;
    });
    return Object.values(latest).reduce((sum, d) => sum + Number(d.power_consumption), 0);
  },
  async getSectorDistribution() {
    const { data } = await SupabaseService.getAllIndustries();
    const sectors = {};
    (data || []).forEach(i => {
      sectors[i.sector] = (sectors[i.sector] || 0) + 1;
    });
    return sectors;
  },
  async getDataCompleteness(industryId) {
    // This is a heavy operation, usually done via a view in SQL but for demo:
    const results = await Promise.all([
      SupabaseService.getInvestmentData(industryId),
      SupabaseService.getEmploymentData(industryId),
      SupabaseService.getUtilitiesData(industryId),
      SupabaseService.getTurnoverData(industryId),
      SupabaseService.getCsrData(industryId)
    ]);
    let filled = results.filter(r => r.data && r.data.length > 0).length;
    return Math.round((filled / 5) * 100);
  },

  // --- HELPERS ---
  formatCurrency(num) {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + ' L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + Number(num).toLocaleString('en-IN');
  },
  formatNumber(num) {
    return Number(num).toLocaleString('en-IN');
  },
  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago';
    return date.toLocaleDateString();
  }
};
