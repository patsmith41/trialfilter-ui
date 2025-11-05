// safe_update.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using the new, secret variable

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Service Role Key is missing. Make sure it's in your .env.local file.");
}
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