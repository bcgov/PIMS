namespace Pims.Api.Areas.Keycloak.Models.User.Update
{
    /// <summary>
    /// UserAgencyModel class, provides a model to represent a user agency.
    /// </summary>
    public class UserAgencyModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique identify for the agency.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The unique name to identify the agency.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }
        #endregion
    }
}
