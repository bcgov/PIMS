namespace Pims.Api.Models.Auth
{
    /// <summary>
    /// ClaimModel class, provides a model to represent a claim.
    /// </summary>
    public class ClaimModel
    {
        #region Properties
        /// <summary>
        /// get/set - The claim name.
        /// </summary>
        /// <value></value>
        public string Claim { get; set; }

        /// <summary>
        /// get/set - The claim value.
        /// </summary>
        /// <value></value>
        public string Value { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ClaimModel object.
        /// </summary>
        public ClaimModel() { }

        /// <summary>
        /// Creates a new instance of a ClaimModel object, initializes it with specified arguments.
        /// </summary>
        /// <param name="claim"></param>
        /// <param name="value"></param>
        public ClaimModel(string claim, string value)
        {
            this.Claim = claim;
            this.Value = value;
        }
        #endregion
    }
}
