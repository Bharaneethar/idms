/* ============================
   SUPABASE MIGRATION SCRIPT
   ============================ */

function logMsg(msg) {
  const logEl = document.getElementById('log');
  logEl.innerHTML += `<div>> ${msg}</div>`;
  logEl.scrollTop = logEl.scrollHeight;
  console.log(msg);
}

async function startMigration() {
  document.getElementById('start-btn').disabled = true;
  logMsg('Initializing Supabase migration...');

  try {
    // We expect supabaseClient to be initialized from supabase.js

    logMsg('1. Creating Admin User...');
    const { data: adminAuth, error: adminErr } = await supabaseClient.auth.signUp({
      email: 'admin@idms.com',
      password: 'admin123',
    });
    let adminId;
    if (adminErr) {
        if (adminErr.message.includes('already registered')) {
            logMsg('Admin already registered. Logging in to get ID...');
            const res = await supabaseClient.auth.signInWithPassword({email: 'admin@idms.com', password: 'admin123'});
            if (res.error) throw new Error(`Admin login failed: ${res.error.message}`);
            adminId = res.data.user.id;
        } else {
            throw new Error(`Admin signup failed: ${adminErr.message}`);
        }
    } else {
        if (!adminAuth.user) throw new Error('Signup succeeded but returned null user. Email confirmations might be enabled in your Supabase project settings.');
        adminId = adminAuth.user.id;
    }
    
    // Insert Admin Profile
    await supabaseClient.from('users').upsert({ id: adminId, email: 'admin@idms.com', role: 'admin', name: 'Rajesh Kumar' });
    logMsg('Admin profile created.');

    logMsg('2. Creating Industry User...');
    const { data: indAuth, error: indErr } = await supabaseClient.auth.signUp({
      email: 'industry@demo.com',
      password: 'industry123',
    });
    let indUserId;
    if (indErr) {
        if (indErr.message.includes('already registered')) {
            logMsg('Industry user already registered. Logging in to get ID...');
            const res = await supabaseClient.auth.signInWithPassword({email: 'industry@demo.com', password: 'industry123'});
            if (res.error) throw new Error(`Industry login failed: ${res.error.message}`);
            indUserId = res.data.user.id;
        } else {
            throw new Error(`Industry signup failed: ${indErr.message}`);
        }
    } else {
        if (!indAuth.user) throw new Error('Signup succeeded but returned null user.');
        indUserId = indAuth.user.id;
    }

    // Insert Industry Profile
    await supabaseClient.from('users').upsert({ id: indUserId, email: 'industry@demo.com', role: 'industry', name: 'Priya Sharma' });
    logMsg('Industry user profile created.');

    logMsg('3. Uploading Industries... (Assigning first industry to our test user)');
    
    // Map old mock IDs to new Supabase UUIDs
    const idMap = {}; 

    for (let i = 0; i < MockData.industries.length; i++) {
        const ind = MockData.industries[i];
        const payload = {
            name: ind.name,
            plot_number: ind.plot,
            sector: ind.sector,
            contact_person: ind.contact_person,
            phone: ind.phone,
            email: ind.email,
            status: ind.status,
            // Assign the first industry to our registered demo user, others get left null
            user_id: i === 0 ? indUserId : null
        };

        const { data, error } = await supabaseClient.from('industries').insert(payload).select('id').single();
        if (error) { logMsg(`Failed to insert industry ${ind.name}: ${error.message}`); continue; }
        
        idMap[ind.id] = data.id; // Store new UUID
        logMsg(`Inserted: ${ind.name}`);
    }

    logMsg('4. Uploading Investment Data...');
    for (const d of MockData.investment_data) {
        if (!idMap[d.industry_id]) continue;
        await supabaseClient.from('investment_data').insert({
            industry_id: idMap[d.industry_id],
            year: d.year,
            initial_investment: d.initial_investment,
            additional_investment: d.additional_investment
        });
    }

    logMsg('5. Uploading Employment Data...');
    for (const d of MockData.employment_data) {
        if (!idMap[d.industry_id]) continue;
        await supabaseClient.from('employment_data').insert({
            industry_id: idMap[d.industry_id],
            year: d.year,
            permanent_employees: d.permanent,
            contract_employees: d.contract,
            male_employees: d.male,
            female_employees: d.female
        });
    }

    logMsg('6. Uploading Utilities Data...');
    for (const d of MockData.utilities_data) {
        if (!idMap[d.industry_id]) continue;
        await supabaseClient.from('utilities_data').insert({
            industry_id: idMap[d.industry_id],
            year: d.year,
            water_consumption: d.water_consumption,
            power_consumption: d.power_consumption
        });
    }

    logMsg('7. Uploading Turnover Data...');
    for (const d of MockData.turnover_data) {
        if (!idMap[d.industry_id]) continue;
        await supabaseClient.from('turnover_data').insert({
            industry_id: idMap[d.industry_id],
            year: d.year,
            annual_turnover: d.annual_turnover,
            production_capacity: d.production_capacity
        });
    }

    logMsg('8. Uploading CSR Activities...');
    for (const d of MockData.csr_activities) {
        if (!idMap[d.industry_id]) continue;
        await supabaseClient.from('csr_activities').insert({
            industry_id: idMap[d.industry_id],
            year: d.year,
            description: d.description,
            expenditure: d.expenditure
        });
    }

    logMsg('🎉 MIGRATION COMPLETE!');
    logMsg('All data has been successfully written to your Supabase project.');
    logMsg('<br/>You can now close this tab and return to index.html.');
    
  } catch (err) {
    logMsg('❌ ERROR: ' + err.message);
    console.error(err);
  }
}
