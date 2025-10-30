// safe_update.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');

// !! REPLACE WITH YOUR ACTUAL SUPABASE PROJECT URL AND SERVICE ROLE KEY !!
const supabaseUrl = "https://aulxdmvpxsjpzuyezxvt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bHhkbXZweHNqcHp1eWV6eHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzk5ODgsImV4cCI6MjA3NzE1NTk4OH0.ktbGCx4_wobTs1tQhcSNHSCHSbRHn_qn10x4W-1SGOs";
const supabase = createClient(supabaseUrl, supabaseKey);



async function processAndUpdate() {
  const eligibilityMap = new Map();

  fs.createReadStream('./categorized_trials.csv') // Make sure this file name is correct
    .pipe(csv())
    .on('data', (row) => {
      const nctId = row['NCT ID'];

      // If we haven't seen this NCT ID yet, initialize its array
      if (!eligibilityMap.has(nctId)) {
        eligibilityMap.set(nctId, []);
      }

      // Create the structured eligibility object from the spreadsheet row
      const eligibilityObject = {
        base_cancer: row['Base Cancer'],
        subtype: row['Subtype/Histology'],
        biomarkers: row['Biomarkers'],
        clinical_descriptors: row['Clinical State / Descriptors'],
        stage_category: row['Stage Category'],
      };
      
      // Add this eligibility pathway to the correct trial's array
      eligibilityMap.get(nctId).push(eligibilityObject);
    })
    .on('end', async () => {
      console.log('CSV file successfully processed. Preparing to update Supabase...');

      // Now, iterate through our map and run an UPDATE for each trial
      for (const [nctId, eligible_cancers_array] of eligibilityMap.entries()) {
        console.log(`Updating ${nctId}...`);

        const { data, error } = await supabase
          .from('trials')
          .update({ eligible_cancers: eligible_cancers_array }) // Update only this one column
          .eq('nct_id', nctId); // Where the ID matches

        if (error) {
          console.error(`Error updating ${nctId}:`, error);
        } else {
          console.log(`Successfully updated ${nctId}.`);
        }
      }
      console.log('All updates complete.');
    });
}

processAndUpdate();