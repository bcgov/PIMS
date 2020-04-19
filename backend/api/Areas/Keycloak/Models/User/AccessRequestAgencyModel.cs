namespace Pims.Api.Areas.Keycloak.Models.User
{
    /// <summary>
    /// AccessRequestAgencyModel class, provides a model that represents a role attached to an access request.
    /// </summary>
    public class AccessRequestAgencyModel : Api.Models.CodeModel<int>
    {
        #region Properties
        public string Description { get; set; }
        #endregion
    }
}
