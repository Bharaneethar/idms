/* ============================
   CHARTS - Chart.js wrapper for analytics
   ============================ */

const Charts = {
  instances: {},

  destroy(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  destroyAll() {
    Object.keys(this.instances).forEach(id => this.destroy(id));
  },

  // Default styling
  defaults: {
    colors: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9', '#8b5cf6', '#f97316', '#14b8a6', '#ec4899', '#84cc16'],
    gridColor: 'rgba(226,232,240,0.6)',
    fontFamily: "'Inter', sans-serif",
    fontColor: '#64748b',
  },

  _baseOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: { family: this.defaults.fontFamily, size: 12 },
            color: this.defaults.fontColor,
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8,
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleFont: { family: this.defaults.fontFamily, size: 13, weight: '600' },
          bodyFont: { family: this.defaults.fontFamily, size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
        }
      },
      scales: {
        x: {
          grid: { color: this.defaults.gridColor, drawBorder: false },
          ticks: { font: { family: this.defaults.fontFamily, size: 11 }, color: this.defaults.fontColor },
        },
        y: {
          grid: { color: this.defaults.gridColor, drawBorder: false },
          ticks: { font: { family: this.defaults.fontFamily, size: 11 }, color: this.defaults.fontColor },
          beginAtZero: true,
        }
      }
    };
  },

  lineChart(canvasId, labels, datasets, options = {}) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const styledDatasets = datasets.map((ds, i) => ({
      ...ds,
      borderColor: ds.borderColor || this.defaults.colors[i],
      backgroundColor: ds.backgroundColor || this.defaults.colors[i] + '20',
      borderWidth: 2.5,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: ds.borderColor || this.defaults.colors[i],
      tension: 0.4,
      fill: ds.fill !== undefined ? ds.fill : true,
    }));

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: styledDatasets },
      options: { ...this._baseOptions(), ...options },
    });
  },

  barChart(canvasId, labels, datasets, options = {}) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const styledDatasets = datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || this.defaults.colors[i] + 'cc',
      borderColor: ds.borderColor || this.defaults.colors[i],
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }));

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: styledDatasets },
      options: { ...this._baseOptions(), ...options },
    });
  },

  doughnutChart(canvasId, labels, data, options = {}) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const baseOpts = this._baseOptions();
    delete baseOpts.scales;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.defaults.colors.slice(0, data.length).map(c => c + 'cc'),
          borderColor: this.defaults.colors.slice(0, data.length),
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        ...baseOpts,
        cutout: '65%',
        plugins: {
          ...baseOpts.plugins,
          legend: { ...baseOpts.plugins.legend, position: 'bottom' },
        },
        ...options,
      }
    });
  },

  areaChart(canvasId, labels, datasets, options = {}) {
    this.destroy(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const styledDatasets = datasets.map((ds, i) => ({
      ...ds,
      borderColor: ds.borderColor || this.defaults.colors[i],
      backgroundColor: ds.backgroundColor || this._gradient(ctx, this.defaults.colors[i]),
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: ds.borderColor || this.defaults.colors[i],
    }));

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: styledDatasets },
      options: { ...this._baseOptions(), ...options },
    });
  },

  _gradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '05');
    return gradient;
  },

  initHomeDemoCharts() {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    
    // Line Chart - Investment Trends
    Charts.lineChart('demo-line-chart', months, [
      { label: 'Domestic Investment (Cr)', data: [120, 150, 180, 220, 210, 280, 310, 350, 420, 480, 520, 580] },
      { label: 'FDI (Cr)', data: [80, 90, 110, 150, 190, 240, 280, 310, 350, 410, 460, 510], borderColor: '#10b981' }
    ]);

    // Bar Chart - Employment
    Charts.barChart('demo-bar-chart', ['North', 'South', 'West', 'Central'], [
      { label: 'Direct Jobs', data: [45000, 85000, 35000, 25000] }
    ]);

    // Pie Chart - Sectors
    Charts.doughnutChart('demo-pie-chart', ['Auto', 'Electronics', 'Textiles', 'Pharma', 'IT'], [35, 25, 15, 15, 10]);
  }
};

window.initHomeDemoCharts = () => Charts.initHomeDemoCharts();
