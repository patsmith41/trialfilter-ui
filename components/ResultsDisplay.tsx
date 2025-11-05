// components/ResultsDisplay.tsx
'use client';

import TrialCard from './TrialCard';
import { Trial } from '@/types/trial'; // Use our shared type definition

interface ResultsDisplayProps {
  trials: Trial[];
  totalTrials: number;
}

export default function ResultsDisplay({ trials, totalTrials }: ResultsDisplayProps) {
  // If no trials match the filter, show a helpful message
  if (trials.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">No Matching Trials Found</h3>
        <p className="text-gray-500 mt-2">
          Try adjusting your filters or click "Reset" to see all available trials.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl text-gray-800 font-semibold">
          Showing {trials.length} of {totalTrials} trials
        </h2>
      </div>

      <div className="space-y-4">
        {trials.map((trial) => (
          <TrialCard key={trial.nct_id} trial={trial} />
        ))}
      </div>
    </div>
  );
}