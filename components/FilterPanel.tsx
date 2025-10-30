// components/FilterPanel.tsx
'use client';

// Props definition remains the same
interface FilterPanelProps {
  baseCancers: string[];
  availableSubtypes: string[];
  availableBiomarkers: string[];
  availableClinicalStates: string[];
  filters: {
    baseCancer: string;
    subtype: string;
    biomarker: string;
    clinicalState: string;
    performanceValue: string;
    metastaticStatus: string;
    age: string;
    linesOfTherapy: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onReset: () => void;
}

export default function FilterPanel({
  baseCancers,
  availableSubtypes,
  availableBiomarkers,
  availableClinicalStates,
  filters,
  onFilterChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md sticky top-8">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">
        Patient Profile
      </h2>
      
      {/* --- REORDERED SECTION 1: Disease-Specific Criteria --- */}
      <div className="space-y-4">
        <div>
          <label htmlFor="base-cancer" className="block text-sm font-medium text-gray-700">Primary Cancer Type</label>
          <select
            id="base-cancer"
            value={filters.baseCancer}
            onChange={(e) => onFilterChange('baseCancer', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
          >
            <option value="">Any</option>
            {baseCancers.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>

        {availableSubtypes.length > 0 && (
          <div>
            <label htmlFor="subtype" className="block text-sm font-medium text-gray-700">Subtype / Histology</label>
            <select
              id="subtype"
              value={filters.subtype}
              onChange={(e) => onFilterChange('subtype', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
            >
              <option value="">Any</option>
              {availableSubtypes.map((subtype) => <option key={subtype} value={subtype}>{subtype}</option>)}
            </select>
          </div>
        )}

        {availableBiomarkers.length > 0 && (
          <div>
            <label htmlFor="biomarker" className="block text-sm font-medium text-gray-700">Biomarkers</label>
            <select
              id="biomarker"
              value={filters.biomarker}
              onChange={(e) => onFilterChange('biomarker', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
            >
              <option value="">Any</option>
              {availableBiomarkers.map((marker) => <option key={marker} value={marker}>{marker}</option>)}
            </select>
          </div>
        )}

        {availableClinicalStates.length > 0 && (
          <div>
            <label htmlFor="clinical-state" className="block text-sm font-medium text-gray-700">Clinical State</label>
            <select
              id="clinical-state"
              value={filters.clinicalState}
              onChange={(e) => onFilterChange('clinicalState', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
            >
              <option value="">Any</option>
              {availableClinicalStates.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>
        )}
      </div>

      <hr className="my-6" />

      {/* --- REORDERED SECTION 2: Patient-Specific Criteria --- */}
      <div className="space-y-4">
        <div>
          <label htmlFor="performance-status" className="block text-sm font-medium text-gray-700">ECOG Performance Status</label>
          <select
            id="performance-status"
            value={filters.performanceValue}
            onChange={(e) => onFilterChange('performanceValue', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
          >
            <option value="">Any</option>
            <option value="0">0 - Fully active</option>
            <option value="1">1 - Restricted strenuous activity</option>
            <option value="2">2 - Ambulatory, unable to work</option>
            <option value="3">3 - Limited self-care</option>
          </select>
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            id="age"
            value={filters.age}
            onChange={(e) => onFilterChange('age', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
            placeholder="e.g., 65"
          />
        </div>
        <div>
          <label htmlFor="metastatic-status" className="block text-sm font-medium text-gray-700">Metastatic Status</label>
          <select
            id="metastatic-status"
            value={filters.metastaticStatus}
            onChange={(e) => onFilterChange('metastaticStatus', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900"
          >
            <option value="Any">Any</option>
            <option value="Metastatic">Metastatic</option>
            <option value="Non-Metastatic">Non-Metastatic</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button type="button" onClick={onReset} className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300">
          Reset All Filters
        </button>
      </div>
    </div>
  );
}