using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;

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
        /// <param name="sort"></param>
        /// <returns></returns>
        public Paged<Role> GetNoTracking(int page = 1, int quantity = 10, string sort = null)
        {
            this.User.ThrowIfNotAuthorized("system-administrator");

            var query = this.Context.Roles.AsNoTracking();
            var roles = query.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<Role>(roles.ToArray(), page, quantity, query.Count());
        }

        /// <summary>
        /// Get the user with the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Role GetNoTracking(Guid id)
        {
            this.User.ThrowIfNotAuthorized("system-administrator");

            return this.Context.Roles.AsNoTracking().FirstOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// Updates the specified user in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override Role Update(Role entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Roles.Find(entity.Id);
            if (user == null) throw new KeyNotFoundException();

            this.Context.Entry(user).CurrentValues.SetValues(entity);
            return base.Update(user);
        }

        /// <summary>
        /// Remove the specified user from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(Role entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Roles.Find(entity.Id);
            if (user == null) throw new KeyNotFoundException();

            this.Context.Entry(user).CurrentValues.SetValues(entity);
            base.Remove(user);
        }
        #endregion
    }
}
