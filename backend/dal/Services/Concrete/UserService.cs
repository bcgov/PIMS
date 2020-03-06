using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Dal.Services
{
    /// <summary>
    /// UserService class, provides a service layer to interact with users within the datasource.
    /// </summary>
    public class UserService : BaseService<User>, IUserService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public UserService(PimsContext dbContext, ClaimsPrincipal user, ILogger<UserService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Determine if the user for the specified 'id' exists in the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool UserExists(Guid id)
        {
            this.User.ThrowIfNotAuthorized();

            return this.Context.Users.Any(u => u.Id == id);
        }

        /// <summary>
        /// Activate the new authenticated user with the PIMS datasource.
        /// </summary>
        /// <returns></returns>
        public User Activate()
        {
            this.User.ThrowIfNotAuthorized();

            var id = this.User.GetUserId();
            var display_name = this.User.GetDisplayName();
            var name = this.User.GetFirstName();
            var surname = this.User.GetLastName();
            var email = this.User.GetEmail();

            this.Logger.LogDebug($"User Activation: id:{id}, email:{email}, display:{display_name}, first:{name}, surname:{surname}");

            var entity = new User(id, display_name, email)
            {
                FirstName = name,
                LastName = surname
            };

            this.Context.Users.Add(entity);
            this.Context.CommitTransaction();

            this.Logger.LogInformation($"User Activated: '{id}' - '{display_name}'.");
            return entity;
        }

        /// <summary>
        /// Activate the new authenticated user with the PIMS datasource.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public AccessRequest AddAccessRequest(AccessRequest request)
        {
            if (request == null || request.Agencies == null || request.Roles == null) throw new ArgumentNullException();
            request.CreatedById = this.User.GetUserId();
            request.User = this.Context.Users.Find(this.User.GetUserId()) ?? throw new KeyNotFoundException();

            request.Agencies.ForEach((accessRequestAgency) =>
            {
                accessRequestAgency.Agency = this.Context.Agencies.Find(accessRequestAgency.AgencyId);
            });
            request.Roles.ForEach((accessRequestRole) =>
            {
                accessRequestRole.Role = this.Context.Roles.Find(accessRequestRole.RoleId);
            });
            this.Context.AccessRequests.Add(request);
            this.Context.CommitTransaction();
            return request;
        }
        #endregion
    }
}
