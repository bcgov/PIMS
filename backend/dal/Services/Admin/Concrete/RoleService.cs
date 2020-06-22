using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// RoleService class, provides a service layer to administrate users within the datasource.
    /// </summary>
    public class RoleService : BaseService<Role>, IRoleService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RoleService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public RoleService(PimsContext dbContext, ClaimsPrincipal user, ILogger<RoleService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of users from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public Paged<Role> Get(int page, int quantity, string name = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminRoles);

            var query = this.Context.Roles.AsNoTracking();

            if (!String.IsNullOrWhiteSpace(name))
                query = query.Where(r => EF.Functions.Like(r.Name, $"%{name}%"));

            var roles = query.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<Role>(roles.ToArray(), page, quantity, query.Count());
        }

        /// <summary>
        /// Get the user with the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Role Get(Guid id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminRoles);

            return this.Context.Roles
                .Include(r => r.Claims)
                .ThenInclude(r => r.Claim)
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the role with the specified name.
        /// </summary>
        /// <param name="name"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Role GetByName(string name)
        {
            return this.Context.Roles
                .Include(r => r.Claims)
                .ThenInclude(r => r.Claim)
                .AsNoTracking()
                .FirstOrDefault(r => r.Name == name) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the user with the specified keycloak group 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Role GetByKeycloakId(Guid id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminRoles);

            return this.Context.Roles
                .Include(r => r.Claims)
                .ThenInclude(r => r.Claim)
                .AsNoTracking()
                .FirstOrDefault(u => u.KeycloakGroupId == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Updates the specified role in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override Role Update(Role entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.AdminRoles);

            var role = this.Context.Roles.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(role).CurrentValues.SetValues(entity);
            base.Update(role);
            this.Context.Detach(role);
            return role;
        }

        /// <summary>
        /// Remove the specified role from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        public override void Remove(Role entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.AdminRoles);

            var role = this.Context.Roles.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(role).CurrentValues.SetValues(entity);
            base.Remove(role);
        }

        /// <summary>
        /// Remove the roles from the datasource, excluding those listed.
        /// </summary>
        /// <param name="exclude"></param>
        /// <returns></returns>
        public int RemoveAll(Guid[] exclude)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminRoles);
            var roles = this.Context.Roles.Include(r => r.Claims).Include(r => r.Users).Where(r => !exclude.Contains(r.Id));
            roles.ForEach(r =>
            {
                r.Claims.Clear();
                r.Users.Clear();
            });

            this.Context.Roles.RemoveRange(roles);
            var result = this.Context.CommitTransaction();
            return result;
        }
        #endregion
    }
}
