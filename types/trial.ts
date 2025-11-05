// types/trial.ts
import { EligibleCancer } from './eligibleCancer';

// A new type to represent the structure of a single location object
export type TrialLocation = {
  facility: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  status: string | null;
  // You can add contacts and geoPoint here later if needed
};

export type Trial = {
  nct_id: string;
  official_title: string | null;
  brief_title: string | null;
  cancer_type_display: string | null;
  phase: string | null;
  min_age: number | null;
  max_age: number | null; // Added
  sex: string | null;
  is_metastatic_allowed: boolean | null;
  performance_status_values: number[] | null;
  
  eligible_cancers: EligibleCancer[] | null;
  
  key_inclusion_summary: unknown;
  key_exclusion_summary: unknown;

  recruitment_status: string | null;
  last_update_date: string | null;
  link_to_trial: string | null;

  principal_investigator: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  site_name: string | null; // Kept for MVP

  enrollment: number | null; // Added
  locations: TrialLocation[] | null; // Added
};