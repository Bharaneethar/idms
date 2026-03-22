/* ============================
   ROUTER - Simple Hash-based SPA Router
   ============================ */

const Router = {
  routes: {},
  currentRoute: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path) {
    window.location.hash = path;
  },

  getParams() {
    const hash = window.location.hash.slice(1);
    const parts = hash.split('/');
    return parts;
  },

  getParam(index) {
    return this.getParams()[index];
  },

  init() {
    window.addEventListener('hashchange', () => this._handleRoute());
    window.addEventListener('load', () => {
      if (!window.location.hash) {
        window.location.hash = '#home';
      }
      this._handleRoute();
    });
  },

  async _handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const path = hash.split('/')[0];

    if (this.routes[path]) {
      this.currentRoute = path;
      await this.routes[path]();
    } else {
      // Default → home
      this.navigate('home');
    }
  }
};
