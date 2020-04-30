using System;
using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// ClientModel class, provides a model to represent a keycloak client.
    /// </summary>
    public class ClientModel
    {
        #region Properties
        /// <summary>
        /// get/set - A unique primary key id.
        /// </summary>
        public Guid? Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify this client.
        /// </summary>
        public string Name { get; set; }
        #endregion
    }
}
