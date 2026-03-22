/* ============================
   APP.JS - Application Entry Point
   ============================ */

(function() {
  'use strict';

  // Register all routes
  Router.register('home', renderHomePage);
  Router.register('login', renderLoginPage);
  Router.register('register', renderRegisterPage);
  Router.register('industry-dashboard', renderIndustryDashboard);
  Router.register('industry-profile', renderIndustryProfile);
  Router.register('data-submission', renderDataSubmission);
  Router.register('submission-history', renderSubmissionHistory);
  Router.register('admin-dashboard', renderAdminDashboard);
  Router.register('industry-list', renderIndustryList);
  Router.register('industry-detail', renderIndustryDetail);
  Router.register('reports', renderReports);
  Router.register('compliance', renderCompliance);
  Router.register('notifications-page', renderNotificationsPage);

  // Init router
  Router.init();

  // Initialize Lucide icons after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  console.log('%c🏭 IDMS - Industrial Data Management System', 'color: #6366f1; font-size: 16px; font-weight: bold;');
  console.log('%cReady. Navigate to #login to get started.', 'color: #64748b;');
})();
