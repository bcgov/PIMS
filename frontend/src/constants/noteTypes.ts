/**
 * NoteTypes enum, identifying all types of notes.
 */
export enum NoteTypes {
  /** General purpose notes. */
  General = 0,
  /** Shared notes between SRES and agencies. */
  Public = 1,
  /** Private notes for SRES only. */
  Private = 2,
  /** Exemption rational note. */
  Exemption = 3,
  /** Agency interest note. */
  AgencyInterest = 4,
  /** Financial note. */
  Financial = 5,
  /** Pre-Marketing note. */
  PreMarketing = 6,
  /** Marketing note. */
  Marketing = 7,
  /** Contract in place note. */
  ContractInPlace = 8,
  /** Notes to include in reports. */
  Reporting = 9,
  /** Loan term information. */
  LoanTerms = 10,
  /** Adjustment note. */
  Adjustment = 11,
  /** Surplus Property Program Cost. */
  SplCost = 12,
  /** Surplus Property Program Gain. */
  SplGain = 13,
  /** Sales history of property. */
  SalesHistory = 14,
  /** Close out note. */
  CloseOut = 15,
  /** General comments. */
  Comments = 16,
  /** Appraisal information. */
  Appraisal = 17,
  /** Offer note. */
  Offer = 18,
  /** Remediation note. */
  Remediation = 19,
  /** Surplus Property List removal rationale. */
  SplRemoval = 20,
  /** Notes related to the provided documentation. */
  Documentation = 21,
  /** Notes displayed on ERP notifications. */
  ErpNotification = 22,
}
