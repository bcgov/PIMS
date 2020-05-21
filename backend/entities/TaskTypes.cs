namespace Pims.Dal.Entities
{
    /// <summary>
    /// TaskTypes enum, provides a way to identify and organize tasks.
    /// </summary>
    public enum TaskTypes
    {
        None = 0,
        /// <summary>
        /// A list of tasks related to submitting a disposal project.
        /// </summary>
        DisposalProjectSubmit = 1,
        /// <summary>
        /// A list of tasks related to approving a disposal project.
        /// </summary>
        DisposalProjectApprove = 2,
    }
}
