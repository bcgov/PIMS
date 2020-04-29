using System;
using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// UserModel class, provides a model to represent a keycloak user.
    /// </summary>
    public class UserModel
    {
        #region Properties
        public Guid id { get; set; }

        public string username { get; set; }

        public bool enabled { get; set; }

        public bool totp { get; set; }

        public bool emailVerified { get; set; }

        public string firstName { get; set; }

        public string lastName { get; set; }

        public string email { get; set; }

        public Dictionary<string, string[]> attributes { get; set; }
        #endregion
    }
}
