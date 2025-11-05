// components/TrialSearch.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import FilterPanel from './FilterPanel';
import ResultsDisplay from './ResultsDisplay';
import { Trial } from '@/types/trial';

interface TrialSearchProps {
  initialTrials: Trial[];
  baseCancers: string[];
}

export default function TrialSearch({ initialTrials, baseCancers }: TrialSearchProps) {
  // --- NEW: Expanded filters state to include everything ---
  const [filters, setFilters] = useState({
    baseCancer: '',
    subtype: '',
    biomarker: '',
    clinicalState: '',
    performanceValue: '',
    metastaticStatus: 'Any',
    age: '',
    linesOfTherapy: 'Any',
  });

  const [displayedTrials, setDisplayedTrials] = useState<Trial[]>(initialTrials);

  // --- LOGIC FOR CASCADING FILTERS ---

  // 1. Available Subtypes (no changes here)
  const availableSubtypes = useMemo(() => {
    if (!filters.baseCancer) return [];
    const relevantTrials = initialTrials.filter(trial => 
      trial.eligible_cancers?.some(def => def.base_cancer === filters.baseCancer)
    );
    const allSubtypes = relevantTrials.flatMap(trial =>
      trial.eligible_cancers
        ?.filter(def => def.base_cancer === filters.baseCancer)
        .map(def => def.subtype_histology) || []
    );
    return Array.from(new Set(allSubtypes)).filter(s => s !== 'N/A').sort();
  }, [filters.baseCancer, initialTrials]);

  // --- NEW: Logic for Biomarkers and Clinical State ---

  // 2. Available Biomarkers (appears after Subtype is chosen, or if no Subtypes exist)
  const availableBiomarkers = useMemo(() => {
    if (!filters.baseCancer) return [];
    // Start with trials matching the base cancer
    let relevantTrials = initialTrials.filter(trial => 
      trial.eligible_cancers?.some(def => def.base_cancer === filters.baseCancer)
    );
    // If a subtype is also selected, narrow the pool further
    if (filters.subtype) {
      relevantTrials = relevantTrials.filter(trial => 
        trial.eligible_cancers?.some(def => def.subtype_histology === filters.subtype)
      );
    }
    const allBiomarkers = relevantTrials.flatMap(trial =>
      trial.eligible_cancers
        ?.flatMap(def => def.biomarkers?.split(',').map(b => b.trim()) || []) || []
    );
    return Array.from(new Set(allBiomarkers)).filter(b => b && b !== 'N/A').sort();
  }, [filters.baseCancer, filters.subtype, initialTrials]);

  // 3. Available Clinical States
  const availableClinicalStates = useMemo(() => {
    if (!filters.baseCancer) return [];
    let relevantTrials = initialTrials.filter(trial => 
        trial.eligible_cancers?.some(def => def.base_cancer === filters.baseCancer)
    );
    if (filters.subtype) {
      relevantTrials = relevantTrials.filter(trial => 
        trial.eligible_cancers?.some(def => def.subtype_histology === filters.subtype)
      );
    }
    const allStates = relevantTrials.flatMap(trial =>
      trial.eligible_cancers
        ?.flatMap(def => def.clinical_descriptors?.split(',').map(s => s.trim()) || []) || []
    );
    return Array.from(new Set(allStates)).filter(s => s && s !== 'N/A').sort();
  }, [filters.baseCancer, filters.subtype, initialTrials]);


  // --- NEW: Expanded automatic filtering logic ---
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      let filtered = initialTrials;

      // Dynamic Cancer Filters
      if (filters.baseCancer) {
        filtered = filtered.filter(trial =>
          trial.eligible_cancers?.some(def => def.base_cancer === filters.baseCancer)
        );
      }
      if (filters.subtype) {
        filtered = filtered.filter(trial =>
          trial.eligible_cancers?.some(def => 
            def.base_cancer === filters.baseCancer && def.subtype_histology === filters.subtype
          )
        );
      }
      // (Future: Add biomarker and clinical state filtering here)

      // Static Foundational Filters
      if (filters.age) {
        const ageNum = parseInt(filters.age, 10);
        filtered = filtered.filter(trial => {
          const minAgeOk = trial.min_age === null || ageNum >= trial.min_age;
          const maxAgeOk = trial.max_age === null || ageNum <= trial.max_age; // <-- NEW LOGIC
          return minAgeOk && maxAgeOk; // Patient must meet both min and max age criteria
        });
      }
      if (filters.performanceValue) {
        const perfNum = parseInt(filters.performanceValue, 10);
        filtered = filtered.filter(trial => trial.performance_status_values?.includes(perfNum));
      }
      if (filters.metastaticStatus !== 'Any') {
        const isMetastatic = filters.metastaticStatus === 'Metastatic';
        filtered = filtered.filter(trial => trial.is_metastatic_allowed === isMetastatic);
      }
      // (Future: Add lines of therapy filtering here)

      setDisplayedTrials(filtered);
    }, 400);

    return () => clearTimeout(searchTimer);
  }, [filters, initialTrials]);

  // --- NEW: Smarter state management ---
  const handleFilterChange = (filterName: string, value: string) => {
    // Reset "child" filters when a "parent" filter changes to avoid impossible combinations
    if (filterName === 'baseCancer') {
      setFilters(prev => ({ ...prev, baseCancer: value, subtype: '', biomarker: '', clinicalState: '' }));
    } else if (filterName === 'subtype') {
      setFilters(prev => ({ ...prev, subtype: value, biomarker: '', clinicalState: '' }));
    } else {
      setFilters(prev => ({ ...prev, [filterName]: value }));
    }
  };
  
  const handleReset = () => {
    setFilters({
      baseCancer: '', subtype: '', biomarker: '', clinicalState: '',
      performanceValue: '', metastaticStatus: 'Any', age: '', linesOfTherapy: 'Any',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <FilterPanel
          baseCancers={baseCancers}
          availableSubtypes={availableSubtypes}
          availableBiomarkers={availableBiomarkers}
          availableClinicalStates={availableClinicalStates}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </aside>
      <section className="lg:col-span-3">
        <ResultsDisplay
          trials={displayedTrials}
          totalTrials={initialTrials.length}
        />
      </section>
    </div>
  );
}