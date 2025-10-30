// app/page.tsx
import { supabase } from '@/lib/supabaseClient';
import TrialSearch from '@/components/TrialSearch';
import { EligibleCancer } from '@/types/eligibleCancer';


export default async function Home() {
  const { data: initialTrials, error } = await supabase
    .from('trials')
    .select('*')
    .order('last_update_date', { ascending: false });

  if (error) {
    console.error(error);
  }

  const allBaseCancers = initialTrials?.flatMap(
    trial => trial.eligible_cancers?.map(
      (cancerDef: EligibleCancer) => cancerDef.base_cancer
    ) || []
  ) || [];
  const uniqueBaseCancers = Array.from(new Set(allBaseCancers)).sort();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 bg-gray-50">
      <div className="w-full max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">StudyFilter.com</h1>
          <p className="text-lg text-gray-600">
            An intelligent search tool for clinical trials.
          </p>
        </header>

        {/* The server page now just prepares data and renders our main client component */}
        <TrialSearch
          initialTrials={initialTrials || []}
          baseCancers={uniqueBaseCancers}
        />
      </div>
    </main>
  );
}