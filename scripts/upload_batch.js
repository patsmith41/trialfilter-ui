// scripts/upload_batch.js

require('dotenv').config({ path: './.env.local' });


const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using the new, secret variable

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Service Role Key is missing. Make sure it's in your .env.local file.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// The path to your master data folder
const dataIngestionPath = path.join(__dirname, '..', 'data_ingestion');

async function processAndUploadBatch() {
  const allTrialsToUpload = [];
  
  // Read all the trial folders inside data_ingestion
  const trialFolders = fs.readdirSync(dataIngestionPath).filter(
    folder => !folder.startsWith('_') && !folder.startsWith('.')
  );

  console.log(`Found ${trialFolders.length} trial folders to process...`);

  for (const folder of trialFolders) {
    try {
      // Construct paths to your two essential JSON files
      const extractedDataPath = path.join(dataIngestionPath, folder, '01_extracted_data.json');
      const eligibleCancersPath = path.join(dataIngestionPath, folder, '02_eligible_cancers.json');

      // Read the file contents
      const extractedData = JSON.parse(fs.readFileSync(extractedDataPath, 'utf-8'));
      const eligibleCancersData = JSON.parse(fs.readFileSync(eligibleCancersPath, 'utf-8'));

      // Merge the two data sources into one final object
      const finalTrialObject = {
        ...extractedData,
        eligible_cancers: eligibleCancersData
      };
      
      allTrialsToUpload.push(finalTrialObject);
      console.log(`✅ Successfully processed ${folder}`);

    } catch (error) {
      console.error(`❌ Failed to process folder ${folder}:`, error.message);
    }
  }

  if (allTrialsToUpload.length > 0) {
    console.log(`\nAttempting to upload ${allTrialsToUpload.length} trials to Supabase...`);

    // Use .upsert() - this will INSERT new trials into your empty table.
    const { data, error } = await supabase
      .from('trials')
      .upsert(allTrialsToUpload, { onConflict: 'nct_id' });

    if (error) {
      console.error('\nError uploading batch to Supabase:', error);
    } else {
      console.log('\n🎉 Batch upload successful!');
    }
  } else {
    console.log('\nNo trials were processed for upload.');
  }
}

processAndUploadBatch();