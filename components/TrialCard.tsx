// components/TrialCard.tsx

// @ts-nocheck 
// This line tells the VS Code TypeScript server to ignore this file for error checking.

import { Trial } from '@/types/trial';

interface TrialCardProps {
  trial: Trial;
}

const InfoPill = ({ children }: { children: any }) => (
  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
    {children}
  </span>
);

export default function TrialCard({ trial }: TrialCardProps) {
  const showPhase = trial.phase && trial.phase !== 'Not Applicable';
  const displayTitle = trial.brief_title || trial.official_title;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-shadow hover-shadow-lg">
      
      <div className="flex justify-between items-start mb-2">
        <div>
          {showPhase && <InfoPill>{trial.phase}</InfoPill>}
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          trial.recruitment_status === 'Recruiting' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {trial.recruitment_status}
        </span>
      </div>

      <a
        href={trial.link_to_trial || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-bold text-blue-800 hover:text-blue-600 hover:underline"
      >
        {displayTitle}
      </a>
      
      <p className="text-sm text-gray-500 mt-1 mb-4">{trial.nct_id}</p>
      <p className="font-semibold text-gray-800">{trial.cancer_type_display}</p>
      
      <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
        {trial.min_age && <InfoPill>{`Age: ${trial.min_age}${trial.max_age ? `-${trial.max_age}` : '+'}`}</InfoPill>}
        {trial.performance_status_values && (
          <InfoPill>
            <>ECOG {trial.performance_status_values.join('-')}</>
          </InfoPill>
        )}
        {trial.is_metastatic_allowed !== null && (
          <InfoPill>
            {trial.is_metastatic_allowed ? 'Metastatic Allowed' : 'Non-Metastatic Only'}
          </InfoPill>
        )}
      </div>

      {trial.key_inclusion_summary && (
        <div className="mt-4 text-sm text-gray-600">
          <h4 className="font-semibold text-gray-800">Key Inclusion Criteria:</h4>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {(trial.key_inclusion_summary as string[]).slice(0, 2).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t pt-3 flex justify-between items-center text-xs text-gray-500">
        <span>Last Updated: {trial.last_update_date}</span>
        <a
          href={trial.link_to_trial || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          View on ClinicalTrials.gov →
        </a>
      </div>
    </div>
  );
}