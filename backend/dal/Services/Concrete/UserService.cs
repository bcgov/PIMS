using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Comparers;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

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
        /// <param name="service"></param>
        /// <param name="options"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public UserService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, IOptionsMonitor<PimsOptions> options, ILogger<UserService> logger) : base(dbContext, user, service, logger)
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

            var user = this.Context.Users.Find(id);
            var exists = user != null;
            if (!exists)
            {
                var username = this.User.GetUsername() ?? _options.ServiceAccount?.Username ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:Username' is invalid or missing.");
                var givenName = this.User.GetFirstName() ?? _options.ServiceAccount?.FirstName ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:FirstName' is invalid or missing.");
                var surname = this.User.GetLastName() ?? _options.ServiceAccount?.LastName ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:LastName' is invalid or missing.");
                var email = this.User.GetEmail() ?? _options.ServiceAccount?.Email ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:Email' is invalid or missing.");

                this.Logger.LogInformation($"User Activation: id:{id}, email:{email}, username:{username}, first:{givenName}, surname:{surname}");

                user = new User(id, username, email, givenName, surname);
                this.Context.Users.Add(user);
            }
            else
            {
                user.LastLogin = DateTime.UtcNow;
                this.Context.Entry(user).State = EntityState.Modified;
            }

            this.Context.CommitTransaction();
            if (!exists) this.Logger.LogInformation($"User Activated: '{id}' - '{user.Username}'.");
            return user;
        }

        #region Access Requests
        /// <summary>
        /// Get the most recent access request that has not been disabled for the current user.
        /// </summary>
        /// <returns></returns>
        public AccessRequest GetAccessRequest()
        {
            var userId = this.User.GetUserId();
            var accessRequest = this.Context.AccessRequests
                .Include(a => a.Agencies)
                .ThenInclude(a => a.Agency)
                .Include(a => a.Roles)
                .ThenInclude(r => r.Role)
                .Include(a => a.User)
                .AsNoTracking()
                .OrderByDescending(a => a.CreatedOn)
                .FirstOrDefault(a => a.UserId == userId && a.Status == AccessRequestStatus.OnHold);
            return accessRequest;
        }

        /// <summary>
        /// Get the access request for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public AccessRequest GetAccessRequest(int id)
        {
            var accessRequest = this.Context.AccessRequests
                .Include(a => a.Agencies)
                .ThenInclude(a => a.Agency)
                .Include(a => a.Roles)
                .ThenInclude(r => r.Role)
                .Include(a => a.User)
                .AsNoTracking()
                .FirstOrDefault(a => a.Id == id) ?? throw new KeyNotFoundException();
            var userId = this.User.GetUserId();
            if (accessRequest.UserId != userId) throw new NotAuthorizedException();
            return accessRequest;
        }
        /// <summary>
        /// Delete an access request
        /// </summary>
        /// <param name="accessRequest">The item to be deleted</param>
        /// <returns></returns>
        public AccessRequest DeleteAccessRequest(AccessRequest accessRequest)
        {
            var entity = Context.AccessRequests
                             .Include(a => a.Agencies)
                             .ThenInclude(a => a.Agency)
                             .Include(a => a.Roles)
                             .ThenInclude(r => r.Role)
                             .Include(a => a.User)
                             .AsNoTracking()
                             .FirstOrDefault(a => a.Id == accessRequest.Id) ?? throw new KeyNotFoundException();
            Context.AccessRequests.Remove(entity);
            Context.CommitTransaction();

            return accessRequest;
        }

        /// <summary>
        /// Add a new access request for the current user.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public AccessRequest AddAccessRequest(AccessRequest request)
        {
            if (request == null || request.Agencies == null || request.Roles == null) throw new ArgumentNullException(nameof(request));
            var userId = this.User.GetUserId();
            var position = request.User.Position;
            request.User = this.Context.Users.Find(userId) ??
                throw new KeyNotFoundException("Your account has not been activated.");

            request.UserId = userId;
            request.User.Position = position;
            this.Context.Entry(request.User).State = EntityState.Modified;

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
        /// Update the access request for the current user.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public AccessRequest UpdateAccessRequest(AccessRequest request)
        {
            if (request == null || request.Agencies == null || request.Roles == null) throw new ArgumentNullException(nameof(request));
            var userId = this.User.GetUserId();
            var position = request.User.Position;
            request.User = this.Context.Users.Find(userId) ??
                throw new KeyNotFoundException("Your account has not been activated.");

            if (request.UserId != userId) throw new NotAuthorizedException(); // Not allowed to update someone elses request.

            // fetch the existing request from the datasource.
            var entity = this.Context.AccessRequests
                .Include(a => a.Agencies)
                .ThenInclude(a => a.Agency)
                .Include(a => a.Roles)
                .ThenInclude(r => r.Role)
                .Include(a => a.User)
                .FirstOrDefault(a => a.Id == request.Id) ?? throw new KeyNotFoundException();

            if (entity.User.Position != position)
            {
                entity.User.Position = position;
                this.Context.Entry(entity.User).State = EntityState.Modified;
            }

            // Remove agencies and roles if required.
            var removeAgencies = entity.Agencies.Except(request.Agencies, new AccessRequestAgencyAgencyIdComparer());
            if (removeAgencies.Any()) entity.Agencies.RemoveAll(a => removeAgencies.Any(r => r.AgencyId == a.AgencyId));

            var removeRoles = entity.Roles.Except(request.Roles, new AccessRequestRoleRoleIdComparer());
            if (removeRoles.Any()) entity.Roles.RemoveAll(a => removeRoles.Any(r => r.RoleId == a.RoleId));

            // Add agencies and roles if required.
            var addAgencies = request.Agencies.Except(entity.Agencies, new AccessRequestAgencyAgencyIdComparer());
            addAgencies.ForEach(a => entity.Agencies.Add(a));

            var addRoles = request.Roles.Except(entity.Roles, new AccessRequestRoleRoleIdComparer());
            addRoles.ForEach(r => entity.Roles.Add(r));

            // Copy values into entity.
            this.Context.Entry(entity).CurrentValues.SetValues(request);
            this.Context.SetOriginalRowVersion(entity);

            this.Context.AccessRequests.Update(entity);
            this.Context.CommitTransaction();
            this.Context.Entry(request).CurrentValues.SetValues(entity);
            return entity;
        }
        #endregion

        /// <summary>
        /// Get an array of agency IDs for the specified 'userId'.
        /// This only returns the first two layers (direct parents, their immediate children).
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IEnumerable<int> GetAgencies(Guid userId)
        {
            var user = this.Context.Users
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .ThenInclude(a => a.Children)
                .Single(u => u.Id == userId) ?? throw new KeyNotFoundException();
            var agencies = user.Agencies.Select(a => a.AgencyId).ToList();
            agencies.AddRange(user.Agencies.SelectMany(a => a.Agency?.Children.Where(ac => !ac.IsDisabled)).Select(a => a.Id));

            return agencies.ToArray();
        }

        /// <summary>
        /// Get all the system administrators, and agency administrators for the specified 'agencyId'.
        /// </summary>
        /// <param name="agencies"></param>
        /// <returns></returns>
        public IEnumerable<User> GetAdmininstrators(params int[] agencies)
        {
            if (agencies == null) throw new ArgumentNullException(nameof(agencies));

            return this.Context.Users
                .AsNoTracking()
                .Where(u => u.Roles.Any(r => r.Role.Claims.Any(c => c.Claim.Name == Permissions.SystemAdmin.GetName()))
                    || (u.Agencies.Any(a => agencies.Contains(a.AgencyId)) && u.Roles.Any(r => r.Role.Claims.Any(c => c.Claim.Name == Permissions.AgencyAdmin.GetName())))
                );
        }
        #endregion
    }
}
