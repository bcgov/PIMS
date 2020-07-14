using Microsoft.AspNetCore.Mvc;
using Pims.Dal.Security;
using System;
using System.Linq;

namespace Pims.Api.Policies
{
    /// <summary>
    /// HasPermissionAttribute class, provides an attribute that will authorize a users claims to determine if they have permission to perform the requested action.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class HasPermissionAttribute : TypeFilterAttribute
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a HasPermissionAttribute.
        /// </summary>
        public HasPermissionAttribute() : base(typeof(PermissionFilter)) { }

        /// <summary>
        /// Creates a new instance of a HasPermissionAttribute, initializes it with the specified permission.
        /// </summary>
        /// <param name="permission"></param>
        /// <returns></returns>
        public HasPermissionAttribute(Permissions permission) : base(typeof(PermissionFilter))
        {
            this.Arguments = new object[] { permission };
        }

        /// <summary>
        /// Creates a new instance of a HasPermissionAttribute, initializes it with the specified permissions.
        /// </summary>
        /// <param name="permissions"></param>
        /// <returns></returns>
        public HasPermissionAttribute(params Permissions[] permissions) : base(typeof(PermissionFilter))
        {
            this.Arguments = permissions.Select(p => p).Cast<object>().ToArray();
        }
        #endregion
    }
}
