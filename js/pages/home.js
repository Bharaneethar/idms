/* ============================
   HOME PAGE (SIPCOT Style Landing Page)
   ============================ */

function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Top Configuration / Navbar -->
    <header class="home-header">
      <div class="home-container home-header-inner">
        <div class="home-logo">
          <div class="home-logo-icon">
            <i data-lucide="building-2"></i>
          </div>
          <div class="home-logo-text">
            <h1>State Industries Promotion Corporation of Tamil Nadu</h1>
            <span>(SIPCOT) Limited</span>
          </div>
        </div>
        <nav class="home-nav">
          <a href="#" class="home-nav-item active">Home</a>
          <a href="#about" class="home-nav-item">About Us</a>
          <a href="#parks" class="home-nav-item">Industrial Parks</a>
          <a href="#services" class="home-nav-item">Services</a>
          <button class="btn btn-primary" onclick="Router.navigate('login')">
            <i data-lucide="log-in"></i> Portal Login
          </button>
        </nav>
      </div>
    </header>

    <!-- Marquee News/Updates -->
    <div class="home-announcements">
      <div class="home-container">
        <div class="marquee-content">
          <span>📢 NEW: <strong>Single-Window Clearance</strong> portal is now open for phase 2 industrial plot allocations! &nbsp;;&nbsp; 🏢 <strong>Dindigul Industrial Park</strong> construction completed! &nbsp;&nbsp;&nbsp;💡 Check our revised <strong>Water Supply</strong> guidelines for 2026.</span>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="home-hero">
      <div class="home-container home-hero-content">
        <h1 class="hero-title">Thrive as an industry, <span>with SIPCOT!</span></h1>
        <p class="hero-subtitle">Catalyzing Industrial Growth in Tamil Nadu with state-of-the-art infrastructure, seamless land allocation, and a unified proactive ecosystem for global investments.</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" onclick="document.getElementById('parks').scrollIntoView({behavior: 'smooth'})">Explore Parks</button>
          <button class="btn btn-secondary btn-lg" style="background: rgba(255,255,255,0.1); color: white; border-color: rgba(255,255,255,0.3); backdrop-filter: blur(10px);" onclick="Router.navigate('login')">Apply for Land</button>
        </div>
      </div>
    </section>

    <!-- Quick Services Bar -->
    <div class="quick-services-bar">
      <div class="home-container quick-services-inner">
        <a href="#" class="quick-service-item">
          <i data-lucide="droplet"></i>
          <span>Water Supply</span>
        </a>
        <a href="#" class="quick-service-item">
          <i data-lucide="zap"></i>
          <span>Power Status</span>
        </a>
        <a href="#" class="quick-service-item">
          <i data-lucide="file-text"></i>
          <span>Apply for Shed</span>
        </a>
        <a href="#" class="quick-service-item">
          <i data-lucide="message-square"></i>
          <span>Grievances</span>
        </a>
        <a href="#" class="quick-service-item">
          <i data-lucide="map"></i>
          <span>GIS Mapping</span>
        </a>
      </div>
    </div>

    <!-- Statistics Section -->
    <section class="home-stats-section">
      <div class="home-container home-stats-grid">
        <div class="home-stat-card">
          <div class="stat-icon"><i data-lucide="map"></i></div>
          <h2 class="stat-value">39,000+</h2>
          <p class="stat-label">Acres of Land Bank</p>
        </div>
        <div class="home-stat-card">
          <div class="stat-icon"><i data-lucide="factory"></i></div>
          <h2 class="stat-value">28+</h2>
          <p class="stat-label">Industrial Parks</p>
        </div>
        <div class="home-stat-card">
          <div class="stat-icon"><i data-lucide="briefcase"></i></div>
          <h2 class="stat-value">3.5 Lakh+</h2>
          <p class="stat-label">Employment Generated</p>
        </div>
        <div class="home-stat-card">
          <div class="stat-icon"><i data-lucide="trending-up"></i></div>
          <h2 class="stat-value">₹2.3L Cr+</h2>
          <p class="stat-label">Total Investments</p>
        </div>
      </div>
    </section>

    <!-- Services / Focus Areas -->
    <section id="services" class="home-services-section">
      <div class="home-container">
        <div class="section-title-wrap">
          <h2 class="section-title">Our Core Services</h2>
          <p class="section-subtitle">Comprehensive solutions for a perfect industrial ecosystem</p>
        </div>
        
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon ind"><i data-lucide="building"></i></div>
            <h3>Industrial Infrastructure</h3>
            <p>World-class facilities including dedicated power substations, comprehensive road networks, and sophisticated water supply systems tailored for industrial needs.</p>
          </div>
          <div class="service-card">
            <div class="service-icon land"><i data-lucide="map-pin"></i></div>
            <h3>Land Allocation</h3>
            <p>Transparent and simplified procedures to allocate plots, sheds, and commercial spaces on lease or outright purchase basis for various sectors.</p>
          </div>
          <div class="service-card">
            <div class="service-icon swc"><i data-lucide="check-circle"></i></div>
            <h3>Single-Window Clearance</h3>
            <p>A unified digital portal to streamline statutory approvals and clearances from over 14 government departments to accelerate project setups.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why SIPCOT / Advantages -->
    <section class="home-advantages-section">
      <div class="home-container">
        <div class="section-title-wrap">
          <h2 class="section-title">The SIPCOT Advantage</h2>
          <p class="section-subtitle">Why global leaders choose Tamil Nadu as their manufacturing destination</p>
        </div>
        
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="adv-icon"><i data-lucide="zap"></i></div>
            <h4>Power Surplus State</h4>
            <p>Uninterrupted dedicated power supply to all industrial parks with extensive green energy focus.</p>
          </div>
          <div class="advantage-card">
            <div class="adv-icon"><i data-lucide="users"></i></div>
            <h4>Skilled Manpower</h4>
            <p>Access to the highest number of technical graduates and skilled workforce in India.</p>
          </div>
          <div class="advantage-card">
            <div class="adv-icon"><i data-lucide="anchor"></i></div>
            <h4>Robust Logistics</h4>
            <p>Excellent connectivity with 4 major seaports, 6 airports, and a vast highway network.</p>
          </div>
          <div class="advantage-card">
            <div class="adv-icon"><i data-lucide="shield-check"></i></div>
            <h4>Proactive Governance</h4>
            <p>Industry-friendly policies, transparent processes, and swift clearances through SWP.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Parks -->
    <section id="parks" class="home-parks-section">
      <div class="home-container">
        <div class="section-title-wrap">
          <h2 class="section-title">Featured Industrial Parks</h2>
          <p class="section-subtitle">Strategically located hubs driving Tamil Nadu's industrial dominance</p>
        </div>
        
        <div class="parks-grid">
          <div class="park-card">
            <div class="park-img" style="background: linear-gradient(to top, rgba(15,23,42,0.9), transparent), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'); background-size: cover; background-position: center;">
              <span class="park-badge">Electronics / EV</span>
            </div>
            <div class="park-content">
              <h3>Hosur Industrial Park</h3>
              <p>State-of-the-art facility located near the key tech-corridor focusing on Electric Vehicles, Auto components, and high-tech manufacturing.</p>
            </div>
          </div>
          <div class="park-card">
            <div class="park-img" style="background: linear-gradient(to top, rgba(15,23,42,0.9), transparent), url('https://images.unsplash.com/photo-1565439390119-a681cc054d5b?auto=format&fit=crop&q=80&w=800'); background-size: cover; background-position: center;">
              <span class="park-badge">Heavy Engineering</span>
            </div>
            <div class="park-content">
              <h3>Oragadam Industrial Growth Center</h3>
              <p>The largest automobile hub in South Asia housing global giants and providing world-class infrastructure for heavy engineering.</p>
            </div>
          </div>
          <div class="park-card">
            <div class="park-img" style="background: linear-gradient(to top, rgba(15,23,42,0.9), transparent), url('https://images.unsplash.com/photo-1555928121-722a45d0de70?auto=format&fit=crop&q=80&w=800'); background-size: cover; background-position: center;">
              <span class="park-badge">Automobile / Components</span>
            </div>
            <div class="park-content">
              <h3>Sriperumbudur Industrial Park</h3>
              <p>A sprawling expanse offering prime plots for electronics, automotive, and general manufacturing with seamless logistics access.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- District Presence -->
    <section class="home-districts-section">
      <div class="home-container">
        <div class="section-title-wrap">
          <h2 class="section-title">Our Growing Presence</h2>
          <p class="section-subtitle">Spanning across Tamil Nadu with 28+ thriving industrial parks</p>
        </div>
        <div class="districts-cloud">
          <span class="district-badge">Chengalpattu</span>
          <span class="district-badge">Cuddalore</span>
          <span class="district-badge">Dindigul</span>
          <span class="district-badge">Erode</span>
          <span class="district-badge" style="background:var(--primary-600);color:white;border-color:var(--primary-600);">Kancheepuram (5 Parks)</span>
          <span class="district-badge" style="background:var(--secondary-600);color:white;border-color:var(--secondary-600);">Krishnagiri (4 Parks)</span>
          <span class="district-badge">Perambalur</span>
          <span class="district-badge">Pudukottai</span>
          <span class="district-badge">Ranipet</span>
          <span class="district-badge">Sivagangai</span>
          <span class="district-badge" style="background:var(--primary-600);color:white;border-color:var(--primary-600);">Thiruvallur (4 Parks)</span>
          <span class="district-badge">Thoothukudi</span>
          <span class="district-badge">Tiruchirappalli</span>
          <span class="district-badge">Tirunelveli</span>
          <span class="district-badge">Tiruvannamalai</span>
          <span class="district-badge">Viluppuram</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="home-container">
        <div class="footer-grid">
          <div class="footer-col">
            <div class="home-logo mb-4">
              <div class="home-logo-icon">
                <i data-lucide="factory"></i>
              </div>
              <div class="home-logo-text" style="color: white;">
                <h3 style="color: white; font-size: 1.1rem; margin: 0;">SIPCOT</h3>
              </div>
            </div>
            <p style="color: var(--slate-400); font-size: 0.85rem; max-width: 250px;">
              Catalyzing the industrial growth of Tamil Nadu by developing robust infrastructure and facilitating easy investments.
            </p>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">About SIPCOT</a></li>
              <li><a href="#">Apply for Land</a></li>
              <li><a href="#">Industrial Parks List</a></li>
              <li><a href="#">Tenders & Policies</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Help & Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Grievance Redressal</a></li>
              <li><a href="#">RTI Act</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact Info</h4>
            <p style="color: var(--slate-400); font-size: 0.85rem; margin-bottom: 8px;">
              <i data-lucide="map-pin" style="width:14px;height:14px;display:inline-block;margin-right:4px;"></i> 19-A, Rukmini Lakshmipathy Road, Egmore, Chennai 600 008.
            </p>
            <p style="color: var(--slate-400); font-size: 0.85rem; margin-bottom: 8px;">
              <i data-lucide="phone" style="width:14px;height:14px;display:inline-block;margin-right:4px;"></i> +91 44 2855 4704
            </p>
            <p style="color: var(--slate-400); font-size: 0.85rem;">
              <i data-lucide="mail" style="width:14px;height:14px;display:inline-block;margin-right:4px;"></i> info@sipcot.in
            </p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 State Industries Promotion Corporation of Tamil Nadu Limited. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  `;
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
