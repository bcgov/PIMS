using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Configuration.Realm
{
    /// <summary>
    /// ProtocolMapperOptions class, provides a way to configure protocol mappings.
    /// </summary>
    public class ProtocolMapperOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The protocal for the mapper.
        /// </summary>
        public string Protocol { get; set; } = "openid-connect";

        /// <summary>
        /// get/set - The name of the mapper.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The mapper type.
        /// </summary>
        public string ProtocolMapper { get; set; }

        /// <summary>
        /// get/set - Wether consent is required.
        /// </summary>
        public bool ConsentRequired { get; set; }

        /// <summary>
        /// get/set - Configuration.
        /// </summary>
        public Dictionary<string, string> Config { get; set; }
        #endregion
    }
}
