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
    /// UserService class, provides a service layer to administrate users within the datasource.
    /// </summary>
    public class UserService : BaseService<User>, IUserService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public UserService(PimsContext dbContext, ClaimsPrincipal user, ILogger<UserService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of users from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public Paged<User> GetNoTracking(int page = 1, int quantity = 10, string sort = null)
        {
            this.User.ThrowIfNotAuthorized("system-administrator");

            var query = this.Context.Users.AsNoTracking();
            var users = query.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<User>(users.ToArray(), page, quantity, query.Count());
        }

        /// <summary>
        /// Get the user with the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public User GetNoTracking(Guid id)
        {
            this.User.ThrowIfNotAuthorized("system-administrator");

            return this.Context.Users.AsNoTracking().FirstOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// Updates the specified user in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override User Update(User entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Users.Find(entity.Id);
            if (user == null) throw new KeyNotFoundException();

            this.Context.Entry(user).CurrentValues.SetValues(entity);
            return base.Update(user);
        }

        /// <summary>
        /// Remove the specified user from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(User entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Users.Find(entity.Id);
            if (user == null) throw new KeyNotFoundException();

            this.Context.Entry(user).CurrentValues.SetValues(entity);
            base.Remove(user);
        }

        /// <summary>
        /// Get all the access requests that users have submitted to the system
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <param name="isGranted"></param>
        public Paged<AccessRequest> GetAccessRequestsNoTracking(int page = 1, int quantity = 10, string sort = null, bool? isGranted = null)
        {
            var query = this.Context.AccessRequests
                .Include(p => p.Agencies)
                .ThenInclude(p => p.Agency)
                .Include(p => p.Roles)
                .ThenInclude(p => p.Role)
                .Include(p => p.User)
                .AsNoTracking();

            if (isGranted.HasValue)
            {
                query = query.Where(request => request.IsGranted == isGranted);
            }
            var accessRequests = query.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<AccessRequest>(accessRequests, page, quantity, query.Count());
        }
        #endregion
    }
}
