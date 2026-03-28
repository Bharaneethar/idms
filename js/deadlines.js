/* ============================
   DEADLINE & REMINDER SERVICE
   Manages submission deadlines (monthly / quarterly)
   and auto-generates notifications for industries.
   ============================ */

const DeadlineService = {

  STORAGE_KEY: 'idms_deadline_config',

  // --- Default Config ---
  defaultConfig() {
    // Monthly: due on the last day of every month.
    // Quarterly: due on 31-Mar, 30-Jun, 30-Sep, 31-Dec.
    const now = new Date();
    return {
      period: 'monthly',          // 'monthly' | 'quarterly'
      warning_days: 7,            // Alert N days before deadline
      last_updated: now.toISOString()
    };
  },

  // --- Get / Save Config ---
  getConfig() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : this.defaultConfig();
    } catch { return this.defaultConfig(); }
  },

  saveConfig(cfg) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ ...cfg, last_updated: new Date().toISOString() }));
  },

  // --- Compute Current Deadline Date ---
  getNextDeadline(period) {
    const now = new Date();
    period = period || this.getConfig().period;

    if (period === 'quarterly') {
      // Quarters end: Mar 31, Jun 30, Sep 30, Dec 31
      const quarterEnds = [
        new Date(now.getFullYear(), 2, 31),   // Mar 31
        new Date(now.getFullYear(), 5, 30),   // Jun 30
        new Date(now.getFullYear(), 8, 30),   // Sep 30
        new Date(now.getFullYear(), 11, 31),  // Dec 31
      ];
      const future = quarterEnds.find(d => d >= now);
      return future || new Date(now.getFullYear() + 1, 2, 31);
    }

    // Monthly: last day of current month
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  },

  // --- Days Left Until Deadline ---
  getDaysLeft(deadline) {
    const msLeft = new Date(deadline) - new Date();
    return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  },

  // --- Check status for current period ---
  getPeriodLabel(period) {
    return period === 'quarterly' ? 'Quarterly' : 'Monthly';
  },

  // --- Determine if an industry has submitted THIS period ---
  hasSubmittedThisPeriod(investments, period) {
    if (!investments || investments.length === 0) return false;
    const deadline = this.getNextDeadline(period);
    const periodStart = period === 'quarterly'
      ? new Date(deadline.getFullYear(), deadline.getMonth() - 2, 1)
      : new Date(deadline.getFullYear(), deadline.getMonth(), 1);

    return investments.some(inv => {
      const d = new Date(inv.created_at || `${inv.year}-01-01`);
      return d >= periodStart;
    });
  },

  // --- Auto-notify if deadline is near and not yet submitted ---
  async checkAndNotify(industryId, investments) {
    const config = this.getConfig();
    const deadline = this.getNextDeadline(config.period);
    const daysLeft = this.getDaysLeft(deadline);
    const submitted = this.hasSubmittedThisPeriod(investments, config.period);

    if (!submitted && daysLeft <= config.warning_days) {
      try {
        const notifKey = `notif_sent_${industryId}_${deadline.toISOString().slice(0, 7)}`;
        if (!localStorage.getItem(notifKey)) {
          await SupabaseService.createNotification(industryId, {
            title: `📅 ${this.getPeriodLabel(config.period)} Submission Due in ${daysLeft} Day${daysLeft !== 1 ? 's' : ''}`,
            message: `Your ${config.period} data submission is due by ${deadline.toLocaleDateString('en-IN')}. Please submit your data to stay compliant.`,
            type: 'reminder'
          });
          localStorage.setItem(notifKey, '1');
        }
      } catch (e) {
        console.warn('DeadlineService: Could not create notification:', e);
      }
    }
    return { deadline, daysLeft, submitted };
  },

  // --- Render Reminder Banner HTML ---
  renderBanner(daysLeft, deadline, submitted, period) {
    if (submitted) {
      return `
        <div class="deadline-banner submitted">
          <i data-lucide="check-circle-2"></i>
          <div class="deadline-banner-text">
            <strong>Submission Complete ✓</strong>
            <span>${this.getPeriodLabel(period)} data submitted for this period. Next deadline: ${deadline.toLocaleDateString('en-IN')}</span>
          </div>
        </div>`;
    }

    const urgency = daysLeft <= 2 ? 'danger' : daysLeft <= 7 ? 'warning' : 'info';
    const icon = daysLeft <= 2 ? 'alert-triangle' : daysLeft <= 7 ? 'clock' : 'calendar';
    const label = daysLeft === 0 ? 'Due TODAY' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;

    return `
      <div class="deadline-banner ${urgency}">
        <i data-lucide="${icon}"></i>
        <div class="deadline-banner-text">
          <strong>${this.getPeriodLabel(period)} Data Submission — ${label}</strong>
          <span>Deadline: ${deadline.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <button class="btn btn-sm deadline-banner-btn" onclick="Router.navigate('data-submission')">
          Submit Now
        </button>
      </div>`;
  }
};
