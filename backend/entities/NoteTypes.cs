namespace Pims.Dal.Entities
{
    /// <summary>
    /// NoteTypes enum, provides note type options.
    /// </summary>
    public enum NoteTypes
    {
        /// <summary>
        /// General default notes.
        /// </summary>
        General = 0,
        /// <summary>
        /// Publically shared notes.
        /// </summary>
        Public = 1,
        /// <summary>
        /// Private notes only visible to SRES.
        /// </summary>
        Private = 2,
        /// <summary>
        /// Exception notes.
        /// </summary>
        Exemption = 3,
        /// <summary>
        /// ERP agency interest notes.
        /// </summary>
        AgencyInterest = 4,
        /// <summary>
        /// Financial notes.
        /// </summary>
        Financial = 5,
        /// <summary>
        /// Pre-marketing notes for SPL.
        /// </summary>
        PreMarketing = 6,
        /// <summary>
        /// Marketing notes for SPL.
        /// </summary>
        Marketing = 7,
        /// <summary>
        /// Contract in place notes for SPL.
        /// </summary>
        ContractInPlace = 8,
        /// <summary>
        /// Notes to include in reports.
        /// </summary>
        Reporting = 9,
        /// <summary>
        /// Loan term notes.
        /// </summary>
        LoanTerms = 10,
        /// <summary>
        /// Adjustment notes.
        /// </summary>
        Adjustment = 11,
        /// <summary>
        /// SPL program cost notes.
        /// </summary>
        SplCost = 12,
        /// <summary>
        /// SPL gain or loss notes.
        /// </summary>
        SplGain = 13,
        /// <summary>
        /// Sales history notes.
        /// </summary>
        SalesHistory = 14,
        /// <summary>
        /// Close out form notes.
        /// </summary>
        CloseOut = 15,
        /// <summary>
        /// General comments.
        /// </summary>
        Comments = 16,
        /// <summary>
        /// Appraisal note.
        /// </summary>
        Appraisal = 17,
        /// <summary>
        /// A purchaser has made an offer.
        /// </summary>
        Offer = 18,
        /// <summary>
        /// A disposed project remediation note.
        /// </summary>
        Remediation = 19,
        /// <summary>
        /// Rational for being removed from SPL.
        /// </summary>
        SplRemoval = 20,
        /// <summary>
        /// Notes related to the provided documentation.
        /// </summary>
        Documentation = 21,
        /// <summary>
        /// Notes displayed on ERP notifications.
        /// </summary>
        ErpNotification = 22
    }
}
