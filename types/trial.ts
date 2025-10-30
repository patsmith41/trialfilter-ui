// types/trial.ts
import { EligibleCancer } from './eligibleCancer'; 

export type Trial = {
  nct_id: string;
  title: string | null;
  cancer_type_display: string | null;
  phase: string | null;
  is_metastatic_allowed: boolean | null;
  performance_status_values: number[] | null;
  min_age: number | null;
  
  eligible_cancers: EligibleCancer[] | null; 

  key_inclusion_summary: unknown; // Use 'unknown' for now, we'll fix in a sec
  key_exclusion_summary: unknown; // Use 'unknown' for now
  
  recruitment_status: string | null;
  last_update_date: string | null;
  link_to_trial: string | null;
};