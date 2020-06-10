using Pims.Tools.Keycloak.Sync.Configuration.Realm;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// RoleModel class, provides a model to represent a keycloak role.
    /// </summary>
    public class RoleModel : Core.Keycloak.Models.RoleModel
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RoleModel class.
        /// </summary>
        public RoleModel() { }

        /// <summary>
        /// Creates a new instance of a RoleModel class, initializes with specified arguments.
        /// </summary>
        /// <param name="role"></param>
        public RoleModel(RoleOptions role)
        {
            this.Name = role.Name;
            this.Description = role.Description;
            this.Composite = role.Composite;
            this.ClientRole = role.ClientRole;
        }
        #endregion
    }
}
