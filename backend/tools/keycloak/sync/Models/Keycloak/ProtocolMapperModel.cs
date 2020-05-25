using Pims.Tools.Keycloak.Sync.Configuration.Realm;
using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// ProtocolMapperModel class, provides a model to represent a keycloak protocol mapper.
    /// </summary>
    public class ProtocolMapperModel
    {
        #region Properties
        /// <summary>
        /// get/set - A primary key for the protocol mapper.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the protocol mapper.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A protocol.
        /// </summary>
        public string Protocol { get; set; }

        /// <summary>
        /// get/set - The protocol mapper.
        /// </summary>
        public string ProtocolMapper { get; set; }

        /// <summary>
        /// get/set - The protocol mapper configuration.
        /// </summary>
        public Dictionary<string, string> Config { get; set; }
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
