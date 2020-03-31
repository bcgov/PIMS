using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Dal.Services
{
    /// <summary>
    /// UserService class, provides a service layer to interact with users within the datasource.
    /// </summary>
    public class UserService : BaseService<User>, IUserService
    {
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="options"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public UserService(PimsContext dbContext, ClaimsPrincipal user, IOptionsMonitor<PimsOptions> options, ILogger<UserService> logger) : base(dbContext, user, logger)
        {
            _options = options.CurrentValue;
        }
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
        /// If activating a service account, then the configuration must be provided to set the default attributes.
        /// </summary>
        /// <returns></returns>
        public User Activate()
        {
            this.User.ThrowIfNotAuthorized();

            var id = this.User.GetUserId();

            var entity = this.Context.Users.Find(id);
            if (entity != null) return entity;

            var username = this.User.GetFirstName() ?? _options.ServiceAccount?.Username ??
                throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:Username' is invalid or missing.");
            var givenName = this.User.GetFirstName() ?? _options.ServiceAccount?.FirstName ??
                throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:FirstName' is invalid or missing.");
            var surname = this.User.GetLastName() ?? _options.ServiceAccount?.LastName ??
                throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:LastName' is invalid or missing.");
            var email = this.User.GetEmail() ?? _options.ServiceAccount?.Email ??
                throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:Email' is invalid or missing.");

            this.Logger.LogInformation($"User Activation: id:{id}, email:{email}, username:{username}, first:{givenName}, surname:{surname}");

            entity = new User(id, username, email, givenName, surname);
            this.Context.Users.Add(entity);
            this.Context.CommitTransaction();

            this.Logger.LogInformation($"User Activated: '{id}' - '{username}'.");
            return entity;
        }

        /// <summary>
        /// Activate the new authenticated user with the PIMS datasource.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public AccessRequest AddAccessRequest(AccessRequest request)
        {
            if (request == null || request.Agencies == null || request.Roles == null) throw new ArgumentNullException(nameof(request));
            request.CreatedById = this.User.GetUserId();
            request.User = this.Context.Users.Find(this.User.GetUserId()) ??
                throw new KeyNotFoundException();

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

        /// <summary>
        /// Get an array of agency IDs for the specified 'userId'.
        /// This only returns the first two layers (direct parents, their immediate children).
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IEnumerable<int> GetAgencies(Guid userId)
        {
            var user = this.Context.Users.Include(u => u.Agencies).ThenInclude(a => a.Agency).ThenInclude(a => a.Children).Single(u => u.Id == userId) ?? throw new KeyNotFoundException();
            var agencies = user.Agencies.Select(a => a.AgencyId).ToList();
            agencies.AddRange(user.Agencies.SelectMany(a => a.Agency?.Children).Select(a => a.Id));

            return agencies.ToArray();
        }
        #endregion
    }
}
