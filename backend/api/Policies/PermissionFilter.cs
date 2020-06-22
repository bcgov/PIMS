using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Policies
{
    /// <summary>
    /// PermissionFilter class, provides a authorization filter that validates the specified permissions.
    /// </summary>
    public class PermissionFilter : IAuthorizationFilter
    {
        #region Variables
        readonly Permissions[] _permissions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PermissionFilter class, initializes it with the specified permission.
        /// </summary>
        /// <param name="permission"></param>
        public PermissionFilter(Permissions permission)
        {
            _permissions = new Permissions[] { permission };
        }

        /// <summary>
        /// Creates a new instance of a PermissionFilter class, initializes it with the specified permissions.
        /// </summary>
        /// <param name="permissions"></param>
        public PermissionFilter(params Permissions[] permissions)
        {
            _permissions = permissions;
        }

        /// <summary>
        /// Creates a new instance of a PermissionFilter class, initializes it with the specified permissions.
        /// </summary>
        /// <param name="permissions"></param>
        public PermissionFilter(IEnumerable<Permissions> permissions)
        {
            _permissions = permissions.ToArray();
        }
        #endregion

        #region Methods
        /// <summary>
        /// On the authorization trigger validated that the user has the specified claim permissions.
        /// If they do not return an HTTP 403.
        /// </summary>
        /// <param name="context"></param>
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var hasRole = context.HttpContext.User.HasPermission(_permissions);
            if (!hasRole)
            {
                context.Result = new ForbidResult();
            }
        }
        #endregion
    }
}
