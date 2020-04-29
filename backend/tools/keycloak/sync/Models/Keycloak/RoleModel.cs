using System;
using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// RoleModel class, provides a model to represent a keycloak role.
    /// </summary>
    public class RoleModel
    {
        #region Properties
        public Guid id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public bool composite { get; set; }

        public bool clientRole { get; set; }

        public string containerId { get; set; }

        public Dictionary<string, string[]> attributes { get; set; }
        #endregion
    }
}
