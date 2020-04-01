namespace Pims.Api.Areas.Keycloak.Models.User.Update
{
    /// <summary>
    /// BaseModel class, provides a model that represents the base properties of an update model.
    /// </summary>
    public abstract class BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The rowversion of the item.
        /// </summary>
        /// <value></value>
        public string RowVersion { get; set; }
        #endregion
    }
}
