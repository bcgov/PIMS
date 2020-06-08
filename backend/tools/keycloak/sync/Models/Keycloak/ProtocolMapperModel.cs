using Pims.Tools.Keycloak.Sync.Configuration.Realm;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// ProtocolMapperModel class, provides a model to represent a keycloak protocol mapper.
    /// </summary>
    public class ProtocolMapperModel : Core.Keycloak.Models.ProtocolMapperModel
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProtocolMapperModel class.
        /// </summary>
        public ProtocolMapperModel() { }

        /// <summary>
        /// Creates a new instance of a ProtocolMapperModel, initializes with specified arguments.
        /// </summary>
        /// <param name="options"></param>
        public ProtocolMapperModel(ProtocolMapperOptions options)
        {
            this.Name = options.Name;
            this.Protocol = options.Protocol;
            this.ProtocolMapper = options.ProtocolMapper;
            this.Config = options.Config;
        }
        #endregion
    }
}
