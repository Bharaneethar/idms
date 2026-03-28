/* ============================
HOME PAGE (SIPCOT High-Fidelity Reconstruction - FINAL ROBUST VERSION)
Matches: https://sipcotweb.tn.gov.in/
============================ */

function renderHomePage() {
  const app = document.getElementById('app');
  
  const content = `
    <!-- 1. Top Utility Header (Hidden on Mobile) -->
    <div class="hidden md:flex bg-[#2d3748] text-white py-2 px-12 justify-between items-center text-[10px] font-bold tracking-wider relative z-[60]">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 border-r border-white/20 pr-3">
          <span class="material-symbols-outlined text-[14px]">call</span>
          <span>044-45261777</span>
        </div>
        <div class="flex items-center gap-1.5 pr-3">
          <span class="material-symbols-outlined text-[14px]">mail</span>
          <span>tapals@sipcot.in</span>
        </div>
        <div class="flex items-center gap-1.5 border-l border-white/20 pl-3">
          <span class="material-symbols-outlined text-[14px]">handshake</span>
          <span>Reach MD</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <button class="hover:text-amber-400">A+</button>
          <button class="hover:text-amber-400">A</button>
          <button class="hover:text-amber-400">A-</button>
          <span class="material-symbols-outlined text-[14px] cursor-pointer">visibility</span>
          <span class="material-symbols-outlined text-[14px] cursor-pointer text-amber-400">lightbulb</span>
          <span class="cursor-pointer hover:text-amber-400 border-l border-white/20 pl-3">தமிழ்</span>
          <span class="material-symbols-outlined text-[14px] cursor-pointer">volume_up</span>
        </div>
        <div class="flex gap-1.5">
           <button class="bg-[#008080] hover:bg-teal-600 px-3 py-1 rounded text-[9px] uppercase font-black transition-all">Application for Plots</button>
           <button class="bg-[#3182ce] hover:bg-blue-600 px-3 py-1 rounded text-[9px] uppercase font-black transition-all">EOI for Lands</button>
        </div>
        <div class="flex items-center gap-2 border-l border-white/20 pl-3">
           <span class="material-symbols-outlined text-[14px] cursor-pointer">facebook</span>
           <span class="material-symbols-outlined text-[14px] cursor-pointer">alternate_email</span>
        </div>
      </div>
    </div>

    <!-- 2. Main Header -->
    <header class="sticky top-0 z-50 bg-white shadow-md h-20 border-b border-slate-100">
      <div class="container mx-auto px-6 md:px-12 h-full flex justify-between items-center">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Toggle (Always show below xl) -->
          <button class="xl:hidden p-2 text-[#2d3748] hover:bg-slate-100 rounded-lg transition-all" onclick="Components.toggleMobileSidebar()">
            <span class="material-symbols-outlined text-[28px]">menu</span>
          </button>
          <img src="https://sipcotweb.tn.gov.in/assets-new/img/tn.svg" alt="TN Gov" class="h-12 md:h-14" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/8/81/Tamil_Nadu_Government_Logo_White.png'; this.style.filter='invert(1)'">
        </div>
        
        <nav class="hidden xl:flex items-center gap-8 h-full">
          <a class="text-[11px] font-black text-[#2d3748] hover:text-blue-700 uppercase cursor-pointer py-8" onclick="Router.navigate('home')">Home</a>
          
          <div class="group relative h-full flex items-center">
            <a class="text-[11px] font-black text-[#2d3748] hover:text-blue-700 uppercase cursor-pointer flex items-center gap-1 h-full">
              About SIPCOT <span class="material-symbols-outlined text-[14px]">expand_more</span>
            </a>
            <!-- Mega Menu: About Us -->
            <div class="hidden group-hover:block absolute top-full left-0 mt-0 pt-0 w-[800px] z-[100] transform translate-y-0 transition-all opacity-0 group-hover:opacity-100">
              <div class="bg-white rounded-b-2xl shadow-2xl border border-slate-100 p-10 grid grid-cols-4 gap-8">
                <div class="col-span-1">
                  <h4 class="text-blue-600 font-black text-[12px] uppercase mb-5 border-b pb-2">About Us</h4>
                  <ul class="space-y-3 font-bold text-slate-600 text-[11px]">
                    <li class="hover:text-blue-600 cursor-pointer">SIPCOT Overview</li>
                    <li class="hover:text-blue-600 cursor-pointer">Board Of Directors</li>
                    <li class="hover:text-blue-600 cursor-pointer">RTI</li>
                  </ul>
                </div>
                <div class="col-span-1">
                  <h4 class="text-blue-600 font-black text-[12px] uppercase mb-5 border-b pb-2">Why SIPCOT?</h4>
                  <ul class="space-y-3 font-bold text-slate-600 text-[11px]">
                    <li class="hover:text-blue-600 cursor-pointer font-black text-blue-600">❯ Advantages</li>
                    <li class="hover:text-blue-600 cursor-pointer">❯ Services</li>
                  </ul>
                </div>
                <div class="col-span-1">
                  <h4 class="text-blue-600 font-black text-[12px] uppercase mb-5 border-b pb-2">Dashboards</h4>
                  <ul class="space-y-3 font-bold text-slate-600 text-[11px]">
                    <li class="hover:text-blue-600 cursor-pointer">❯ Land Allotment</li>
                  </ul>
                </div>
                <div class="col-span-1 border-l pl-6">
                  <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=300" class="rounded-xl shadow-md h-32 object-cover w-full">
                  <p class="text-[9px] font-black uppercase text-slate-400 mt-2 tracking-widest">Industrial Growth</p>
                </div>
              </div>
            </div>
          </div>

          <a class="text-[11px] font-black text-[#2d3748] hover:text-blue-700 uppercase cursor-pointer py-8">Industrial Parks</a>
          <a class="text-[11px] font-black text-[#2d3748] hover:text-blue-700 uppercase cursor-pointer py-8">Tenders</a>

          <div class="group relative h-full flex items-center">
            <a class="text-[11px] font-black text-[#2d3748] hover:text-blue-700 uppercase cursor-pointer flex items-center gap-1 h-full">
              Resources <span class="material-symbols-outlined text-[14px]">expand_more</span>
            </a>
            <div class="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-0 w-[900px] z-[100] transform translate-y-0 opacity-0 group-hover:opacity-100">
              <div class="bg-white rounded-b-2xl shadow-2xl border border-slate-100 p-10 grid grid-cols-4 gap-8">
                <div class="col-span-1 border-r pr-6">
                  <h4 class="text-blue-600 font-black text-[12px] uppercase mb-5 border-b pb-2">Resources</h4>
                  <ul class="space-y-3 font-bold text-slate-600 text-[11px]">
                    <li class="hover:text-blue-600 cursor-pointer">❯ Policies</li>
                    <li class="hover:text-blue-600 cursor-pointer">❯ FAQ</li>
                  </ul>
                </div>
                <div class="col-span-1 pr-6">
                  <h4 class="text-blue-600 font-black text-[12px] uppercase mb-5 border-b pb-2">Office Orders</h4>
                  <ul class="space-y-3 font-bold text-slate-600 text-[11px]">
                    <li class="hover:text-blue-600 cursor-pointer">❯ Sub Leasing</li>
                  </ul>
                </div>
                <div class="col-span-1 pr-6">
                  <h4 class="text-blue-600 font-black text-[12px] uppercase mb-5 border-b pb-2 text-rose-500">Circulars</h4>
                  <ul class="space-y-3 font-bold text-slate-600 text-[11px]">
                    <li class="hover:text-rose-600 cursor-pointer">❯ Compendium</li>
                  </ul>
                </div>
                <div class="col-span-1">
                   <h4 class="text-blue-600 font-black text-[12px] uppercase mb-5 border-b pb-2">Environment</h4>
                   <ul class="space-y-3 font-bold text-slate-600 text-[11px]">
                    <li class="hover:text-blue-600 cursor-pointer">❯ Clearance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <a class="text-[11px] font-black text-[#2d3748] hover:text-blue-700 uppercase cursor-pointer py-8" onclick="Router.navigate('login')">Logins</a>
        </nav>

        <img src="https://sipcotweb.tn.gov.in/assets-new/img/sipcotlogo.gif" alt="SIPCOT" class="h-10 md:h-12" onerror="this.src='https://sipcot.tn.gov.in/img/sipcot_logo.png'">
      </div>
    </header>

    <!-- 3. Hero Section (Ultra Robust) -->
    <section class="relative min-h-[500px] h-[50vh] bg-[#0f172a] flex items-center overflow-hidden">
      <!-- Fallback color ensured by bg-[#0f172a] -->
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920" class="w-full h-full object-cover opacity-60" 
             onload="this.classList.remove('opacity-0'); this.classList.add('opacity-60')" 
             onerror="this.classList.add('hidden')">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
      </div>
      <div class="container mx-auto px-6 md:px-12 relative z-20 text-white">
        <div class="max-w-3xl">
           <p class="text-teal-400 font-black uppercase tracking-[0.4em] text-[11px] mb-5">State Industries Promotion</p>
           <h2 class="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-8">
             Building the future <br/> of <span class="text-teal-400">Industry in Tamil Nadu.</span>
           </h2>
           <div class="flex flex-wrap gap-5 mt-10">
              <button class="bg-[#008080] hover:bg-teal-600 text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95" onclick="Router.navigate('login')">
                Login to Portal
              </button>
              <button class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all">
                Learn More
              </button>
           </div>
        </div>
      </div>
    </section>

    <!-- 4. Introduction Tabs -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-6 md:px-12">
        <div class="flex flex-wrap items-stretch h-14 bg-white shadow-xl border rounded-xl overflow-hidden mb-20">
          <button class="flex-1 bg-[#4bc0c0] text-white font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 active">Introduction</button>
          <button class="flex-1 bg-[#3182ce] text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-600">Services</button>
          <button class="flex-1 bg-[#2b6cb0] text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-800">Advantage</button>
          <button class="flex-1 bg-[#4299e1] text-white font-black text-[10px] uppercase tracking-widest hover:bg-sky-500">Industrial Park</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div class="lg:col-span-7">
             <h2 class="text-4xl md:text-5xl font-black text-[#2d3748] mb-8 leading-tight tracking-tight">
               State Industries Promotion Corporation of Tamil Nadu Limited
             </h2>
             <p class="text-slate-600 text-lg leading-relaxed mb-12 font-medium">
               SIPCOT has nurtured the development of 50 Industrial Parks including 8 SEZs, spread over 24 districts in a total extent of about 48,926.48 acres.
             </p>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-12 font-bold">
                <div class="flex gap-4">
                   <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[30px]">analytics</span>
                   </div>
                   <div>
                      <h4 class="text-slate-800 text-lg mb-1">SIPCOT Mission</h4>
                      <p class="text-slate-500 text-xs uppercase leading-relaxed">Instrumental to the growth of 3,390 Industrial units.</p>
                   </div>
                </div>
                <div class="flex gap-4">
                   <div class="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-[30px]">architecture</span>
                   </div>
                   <div>
                      <h4 class="text-slate-800 text-lg mb-1">Our Vision</h4>
                      <p class="text-slate-500 text-xs uppercase leading-relaxed">Investor's preferred destination with standard infrastructure.</p>
                   </div>
                </div>
             </div>
          </div>
          <div class="lg:col-span-5 relative">
             <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800" class="rounded-3xl shadow-2xl h-[400px] w-full object-cover">
             <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-100 hidden md:flex">
                <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                   <span class="material-symbols-outlined">play_arrow</span>
                </div>
                <div>
                   <p class="text-[10px] font-black text-slate-400 uppercase">Watch Video</p>
                   <p class="text-xs font-black text-slate-800">SIPCOT Overview</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Footer -->
    <footer class="bg-[#2d3748] text-white py-20 border-t-8 border-teal-500">
      <div class="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div class="lg:col-span-4">
           <div class="flex items-center gap-4 mb-10">
              <img src="https://sipcot.tn.gov.in/img/sipcot_logo.png" alt="Logo" class="h-16 brightness-0 invert">
              <h3 class="text-3xl font-black tracking-tighter">SIPCOT</h3>
           </div>
           <p class="text-slate-400 text-sm leading-relaxed mb-10 pr-10">
             Nurturing industrial landscapes with world-class infrastructure and business-friendly policies.
           </p>
           <button class="bg-[#008080] hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95">
             Enquiry Now
           </button>
        </div>
        <div class="lg:col-span-8 bg-slate-800/50 backdrop-blur-md p-10 rounded-3xl border border-white/5">
           <h4 class="text-2xl font-black mb-10 border-b border-white/10 pb-4 flex justify-between items-center">
             Office Address
             <span class="w-12 h-1 bg-teal-500 rounded-full"></span>
           </h4>
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 font-bold text-slate-300">
              <div class="flex gap-4">
                 <span class="material-symbols-outlined text-teal-400">location_on</span>
                 <p class="text-xs leading-relaxed uppercase">19-A, Rukmani Lakshmipathy Road, Egmore, Chennai.</p>
              </div>
              <div class="flex gap-4">
                 <span class="material-symbols-outlined text-teal-400">call</span>
                 <p class="text-lg font-black">044-45261777</p>
              </div>
              <div class="flex gap-4">
                 <span class="material-symbols-outlined text-teal-400">mail</span>
                 <p class="text-sm">tapals@sipcot.in</p>
              </div>
           </div>
        </div>
      </div>
      <div class="text-center mt-20 pt-10 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
        © 2026 State Industries Promotion Corporation of Tamil Nadu - All Rights Reserved.
      </div>
    </footer>
  `;

  app.innerHTML = content;
}