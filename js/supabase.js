/* ============================
   SUPABASE CLIENT
   ============================ */

const SUPABASE_URL = 'https://qediuusubatugoqkkimd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZGl1dXN1YmF0dWdvcWtraW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTAzNTgsImV4cCI6MjA4ODk2NjM1OH0.iTkkMjsasyRGOkzaN_njq4Ea0Sg1t9B8RgePAXwUF5c';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SupabaseService = {
  // Auth
  async login(email, password) {
    return await supabaseClient.auth.signInWithPassword({ email, password });
  },
  async register(email, password, metadata) {
    return await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  },
  async logout() {
    return await supabaseClient.auth.signOut();
  },
  async getCurrentSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
  },

  // Users & Industries
  async getUserProfile(userId) {
    return await supabaseClient.from('users').select('*').eq('id', userId).single();
  },
  async getIndustryById(id) {
    return await supabaseClient.from('industries').select('*').eq('id', id).single();
  },
  async getIndustryProfile(userId) {
    return await supabaseClient.from('industries').select('*').eq('user_id', userId).single();
  },
  async getAllIndustries() {
    return await supabaseClient.from('industries').select('*').order('name');
  },
  async updateIndustryProfile(id, updates) {
    return await supabaseClient.from('industries').update(updates).eq('id', id);
  },

  // Data Fetching
  async getInvestmentData(industryId) {
    let query = supabaseClient.from('investment_data').select('*');
    if (industryId) query = query.eq('industry_id', industryId);
    return await query.order('year');
  },
  async getEmploymentData(industryId) {
    let query = supabaseClient.from('employment_data').select('*');
    if (industryId) query = query.eq('industry_id', industryId);
    return await query.order('year');
  },
  async getUtilitiesData(industryId) {
    let query = supabaseClient.from('utilities_data').select('*');
    if (industryId) query = query.eq('industry_id', industryId);
    return await query.order('year');
  },
  async getTurnoverData(industryId) {
    let query = supabaseClient.from('turnover_data').select('*');
    if (industryId) query = query.eq('industry_id', industryId);
    return await query.order('year');
  },
  async getCsrData(industryId) {
    let query = supabaseClient.from('csr_activities').select('*');
    if (industryId) query = query.eq('industry_id', industryId);
    return await query.order('year');
  },
  
  // Data Submission
  async submitData(table, data) {
    // Upsert based on industry_id and year
    return await supabaseClient.from(table).upsert(data, { onConflict: 'industry_id, year' });
  },
  async submitCsrData(data) {
    return await supabaseClient.from('csr_activities').insert(data);
  },

  // Admin and Notifications
  async getNotifications(userId) {
    return await supabaseClient.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  },
  async markNotificationRead(id) {
    return await supabaseClient.from('notifications').update({ is_read: true }).eq('id', id);
  },
  async markAllNotificationsRead(userId) {
    return await supabaseClient.from('notifications').update({ is_read: true }).eq('user_id', userId);
  },
  async createNotification(id, notification) {
    // We need to resolve the user_id for an industry first
    const { data: ind } = await this.getIndustryById(id);
    if (!ind || !ind.user_id) return { error: { message: 'Industry user not found' }};
    
    return await supabaseClient.from('notifications').insert({
        user_id: ind.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type
    });
  },
  async getAdminNotes(industryId) {
    return await supabaseClient.from('admin_notes').select('*, users(name)').eq('industry_id', industryId).order('created_at', { ascending: false });
  },
  async addAdminNote(industryId, adminId, text) {
    return await supabaseClient.from('admin_notes').insert({
        industry_id: industryId,
        admin_id: adminId,
        note_text: text
    });
  }
};
