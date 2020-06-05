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
        #endregion
    }
}
