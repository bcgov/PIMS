using System;

namespace Pims.Dal.Security
{
    /// <summary>
    /// ClaimNameAttribute class, provides a way to provide a string name value to the enum.
    /// </summary>
    [AttributeUsage(AttributeTargets.Field, AllowMultiple = false)]
    public class ClaimNameAttribute : Attribute
    {
        #region Properties
        /// <summary>
        /// get/set - The name of the role within Keycloak.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The description of this claim.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ClaimNameAttribute class.
        /// </summary>
        public ClaimNameAttribute() { }

        /// <summary>
        /// Creates a new instance of a ClaimNameAttribute class, initializes it with specified arguments.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="description"></param>
        public ClaimNameAttribute(string name, string description = null)
        {
            this.Name = name;
            this.Description = description;
        }
        #endregion
    }
}
