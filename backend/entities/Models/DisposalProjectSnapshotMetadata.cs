namespace Pims.Dal.Entities.Models
{
    public class DisposalProjectSnapshotMetadata : DisposalProjectMetadata
    {
        #region Properties
        /// <summary>
        /// get/set - The net proceeds baseline from the prior report.
        /// This is the difference between the prior net proceeds and the current.
        /// </summary>
        public decimal? BaselineIntegrity { get; set; }
        #endregion
    }
}
