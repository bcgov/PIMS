using System.Collections;
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
        /// Determine if the user for the specified 'KeycloakUserId' exists in the datasource.
        /// </summary>
        /// <param name="KeycloakUserId"></param>
        /// <returns></returns>
        public bool UserExists(Guid KeycloakUserId)
        {
            this.User.ThrowIfNotAuthorized();

            return this.Context.Users.Any(u => u.KeycloakUserId == KeycloakUserId);
        }

        /// <summary>
        /// Get the user for the specified 'keycloakUserId'.
        /// </summary>
        /// <param name="keycloakUserId"></param>
        /// <returns></returns>
        public User GetUserForKeycloakId(Guid keycloakUserId)
        {
            return this.Context.Users.FirstOrDefault(u => u.KeycloakUserId == keycloakUserId);
        }

        /// <summary>
        /// Activate the new authenticated user with the PIMS datasource.
        /// If activating a service account, then the configuration must be provided to set the default attributes.
        /// </summary>
        /// <returns></returns>
        public User Activate()
        {
            this.User.ThrowIfNotAuthorized();

            Guid keycloakUserId = this.User.GetGuid();

            User user = GetUserForKeycloakId(keycloakUserId);
            bool exists = user != null;
            if (!exists)
            {
                string username = this.User.GetUsername() ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:Username' is invalid or missing.");
                string givenName = this.User.GetFirstName() ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:FirstName' is invalid or missing.");
                string surname = this.User.GetLastName() ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:LastName' is invalid or missing.");
                string email = this.User.GetEmail() ??
                    throw new ConfigurationException($"Configuration 'Pims:ServiceAccount:Email' is invalid or missing.");

                this.Logger.LogInformation($"User Activation: keycloak id:{keycloakUserId}, email:{email}, username:{username}, first:{givenName}, surname:{surname}");

                user = new User(keycloakUserId, username, email, givenName, surname);
                this.Context.Users.Add(user);
            }
            else
            {
                user.LastLogin = DateTime.UtcNow;
                this.Context.Entry(user).State = EntityState.Modified;
            }

            this.Context.CommitTransaction();
            if (!exists) this.Logger.LogInformation($"User Activated: '{keycloakUserId}' - '{user.Username}'.");
            return user;
        }

        #region Access Requests
        /// <summary>
        /// Get the most recent access request that has not been disabled for the current user.
        /// </summary>
        /// <returns></returns>
        public AccessRequest GetAccessRequest()
        {
            var keycloakUserId = this.User.GetGuid();
            var user = GetUserForKeycloakId(keycloakUserId);

            var accessRequest = this.Context.AccessRequests
                .Include(a => a.Agencies)
                .ThenInclude(a => a.Agency)
                .Include(a => a.Roles)
                .ThenInclude(r => r.Role)
                .Include(a => a.User)
                .AsNoTracking()
                .OrderByDescending(a => a.CreatedOn)
                .FirstOrDefault(a => a.UserId == user.Id && a.Status == AccessRequestStatus.OnHold);
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
            var keycloakUserId = this.User.GetGuid();
            var user = this.GetUserForKeycloakId(keycloakUserId);
            if (accessRequest.UserId != user.Id) throw new NotAuthorizedException();
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
            var keycloakUserId = this.User.GetGuid();
            var position = request.User.Position;
            request.User = this.GetUserForKeycloakId(keycloakUserId) ?? throw new KeyNotFoundException("Your account has not been activated.");
            request.UserId = request.User.Id;
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
            var keycloakUserId = this.User.GetGuid();
            var position = request.User.Position;
            request.User = this.GetUserForKeycloakId(keycloakUserId) ?? throw new KeyNotFoundException("Your account has not been activated.");

            if (request.UserId != request.User.Id) throw new NotAuthorizedException(); // Not allowed to update someone elses request.

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

        public IEnumerable<int> GetUsersAgencies(Guid id)
        {
            if (id != this.User.GetKeycloakUserId())
            {
                throw new UnauthorizedAccessException();
            }
            var user = this.Context.Users
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .ThenInclude(a => a.Children)
                .Single(u => u.Id == id) ?? throw new KeyNotFoundException();
            var agencies = user.Agencies.Select(a => a.AgencyId).ToList();
            agencies.AddRange(user.Agencies.SelectMany(a => a.Agency?.Children.Where(ac => !ac.IsDisabled)).Select(a => a.Id));

            return agencies.ToArray();
        }

        /// <summary>
        /// Get the all of the agency ids that a user belongs to, given the Guid. 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEnumerable<int> GetUsersAgencies(Guid id)
        {
            if (id != this.User.GetGuid())
            {
                throw new UnauthorizedAccessException();
            }
            User user = this.Context.Users
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .ThenInclude(a => a.Children)
                .SingleOrDefault(u => u.Id == id);

            if (user == null)
            {
                return new int[0];
            }

            List<int> agencies = user.Agencies.Select(a => a.AgencyId).ToList();
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
