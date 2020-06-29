namespace Pims.Dal
{
    /// <summary>
    /// ProjectOptions class, provides a way to configure projects.
    /// </summary>
    public class ProjectOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The format for draft project numbers.
        /// </summary>
        public string DraftFormat { get; set; } = "DRAFT-{0:00000}";

        /// <summary>
        /// get/set - The format for submitted project numbers.
        /// </summary>
        public string NumberFormat { get; set; } = "SPP-{0:00000}";

        /// <summary>
        /// get/set - An array of project status codes for when the project is in draft.
        /// </summary>
        public string[] DraftStatus { get; set; }

        /// <summary>
        /// get/set - An array of project status codes for when the project is closed.
        /// </summary>
        public string[] ClosedStatus { get; set; }

        /// <summary>
        /// get/set - An array of project status codes for when the project is terminated.
        /// These are used to identify which status do not require validation.
        /// </summary>
        public string[] TerminateStatus { get; set; }
        #endregion
    }
}
