/**
 * NoteTypes enum, identifying all types of notes.
 */
export enum NoteTypes {
  /** General purpose notes. */
  GENERAL = 0,
  /** Shared notes between SRES and agencies. */
  PUBLIC = 1,
  /** Private notes for SRES only. */
  PRIVATE = 2,
  /** Exemption rational note. */
  EXEMPTION = 3,
  /** Agency interest note. */
  AGENCY_INTEREST = 4,
  /** Financial note. */
  FINANCIAL = 5,
  /** Pre-Marketing note. */
  PRE_MARKETING = 6,
  /** Marketing note. */
  MARKETING = 7,
  /** Contract in place note. */
  CONTRACT_IN_PLACE = 8,
  /** Notes to include in reports. */
  REPORTING = 9,
  /** Loan term information. */
  LOAN_TERMS = 10,
  /** Adjustment note. */
  ADJUSTMENT = 11,
  /** Surplus Property Program Cost. */
  SPL_COST = 12,
  /** Surplus Property Program Gain. */
  SPL_GAIN = 13,
  /** Sales history of property. */
  SALES_HISTORY = 14,
  /** Close out note. */
  CLOSE_OUT = 15,
  /** General comments. */
  COMMENTS = 16,
  /** Appraisal information. */
  APPRAISAL = 17,
  /** Offer note. */
  OFFER = 18,
  /** Remediation note. */
  REMEDIATION = 19,
  /** Surplus Property List removal rationale. */
  SPL_REMOVAL = 20,
  /** Notes related to the provided documentation. */
  DOCUMENTATION = 21,
  /** Notes displayed on ERP notifications. */
  ERP_NOTIFICATION = 22,
}
