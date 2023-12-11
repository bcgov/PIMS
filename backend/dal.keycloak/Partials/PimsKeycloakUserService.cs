using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Dal.Entities.Comparers;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using Microsoft.Extensions.Logging;

namespace Pims.Dal.Keycloak
{
    /// <summary>
    /// PimsKeycloakService class, provides a way to integrate both PIMS and Keycloak datasources.
    /// </summary>
    public partial class PimsKeycloakService : IPimsKeycloakService
    {
        #region Methods
        /// <summary>
        /// Sync the user for the specified 'keycloakUserId' from keycloak to PIMS.
        /// If the user doesn't exist in PIMS it will add it.
        /// </summary>
        /// <param name="keycloakUserId"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.User> SyncUserAsync(Guid keycloakUserId)
        {
            var kuser = await _keycloakService.GetUserAsync(keycloakUserId) ?? throw new KeyNotFoundException();
            var kgroups = await _keycloakService.GetUserGroupsAsync(keycloakUserId);

            var euser = _pimsAdminService.User.GetForKeycloakUserId(keycloakUserId);
            if (euser == null)
            {
                // The user does not exist in PIMS, it needs to be added.
                euser = _mapper.Map<Entity.User>(kuser);
                foreach (var group in kgroups)
                {
                    var erole = _pimsAdminService.Role.Find(group.Id);

                    // If the role doesn't exist, create it.
                    if (erole == null)
                    {
                        erole = _mapper.Map<Entity.Role>(group);
                        _pimsAdminService.Role.AddOne(erole);
                    }

                    euser.Roles.Add(new Entity.UserRole(euser, erole));
                }
                _pimsAdminService.User.AddOne(euser);
            }
            else
            {
                // The user exists in PIMS, it only needs to be updated.
                var roles = euser?.Roles.ToArray();
                _mapper.Map(kuser, euser);
                foreach (var group in kgroups)
                {
                    var erole = _pimsAdminService.Role.Find(group.Id);

                    // If the role doesn't exist, create it.
                    if (erole == null)
                    {
                        erole = _mapper.Map<Entity.Role>(group);
                        _pimsAdminService.Role.AddOne(erole);
                    }

                    // If the user isn't associated with the role, add a link.
                    if (!roles.Any(r => r.RoleId == group.Id))
                    {
                        euser.Roles.Add(new Entity.UserRole(euser, erole));
                    }
                }
                _pimsAdminService.User.UpdateOne(euser);
            }
            _pimsAdminService.CommitTransaction();

            return euser;
        }

        /// <summary>
        /// Get an array of users from keycloak and PIMS.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Entity.User>> GetUsersAsync(int page = 1, int quantity = 10, string search = null)
        {
            var kusers = await _keycloakService.GetUsersAsync((page - 1) * quantity, quantity, search);

            // TODO: Need better performing solution.
            var eusers = kusers.Select(u => ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.User.GetForKeycloakUserId(u.Id)) ?? _mapper.Map<Entity.User>(u));

            return eusers;
        }

        /// <summary>
        /// Get the user specified for the 'keycloakUserId', only if they exist in Keycloak and PIMS.
        /// </summary>
        /// <param name="keycloakUserId"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.User> GetUserAsync(Guid keycloakUserId)
        {
            var kuser = await _keycloakService.GetUserAsync(keycloakUserId) ?? throw new KeyNotFoundException();
            return _pimsAdminService.User.GetForKeycloakUserId(kuser.Id);
        }

        /// <summary>
        /// Update the specified user in keycloak and PIMS.
        /// </summary>
        /// <param name="user"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.User> UpdateUserAsync(Entity.User user)
        {
            var kuser = await _keycloakService.GetUserAsync(user.KeycloakUserId.Value) ?? throw new KeyNotFoundException("User does not exist in Keycloak");
            var euser = _pimsAdminService.User.GetForKeycloakUserId(user.KeycloakUserId.Value);

            if (user.Username != kuser.Username) throw new InvalidOperationException($"Cannot change the username from '{kuser.Username}' to '{user.Username}'.");

            var addRoles = user.Roles.Except(euser.Roles, new UserRoleRoleIdComparer()).ToArray();
            var removeRoles = euser.Roles.Except(user.Roles, new UserRoleRoleIdComparer()).ToArray();
            var addAgencies = user.Agencies.Except(euser.Agencies, new UserAgencyAgencyIdComparer()).ToArray();
            var removeAgencies = euser.Agencies.Except(user.Agencies, new UserAgencyAgencyIdComparer()).ToArray();

            // Update PIMS
            _mapper.Map(user, euser);

            // Remove all keycloak groups from user.  // TODO: Only add/remove the ones that should be removed.
            var userGroups = await _keycloakService.GetUserGroupsAsync(euser.KeycloakUserId.Value);
            foreach (var group in userGroups)
            {
                await _keycloakService.RemoveGroupFromUserAsync(user.KeycloakUserId.Value, group.Id);
            }
            foreach (var r in user.Roles)
            {
                var role = _pimsAdminService.Role.Find(r.RoleId) ?? throw new KeyNotFoundException("Cannot assign a role to a user, when the role does not exist.");
                if (role.KeycloakGroupId == null) throw new KeyNotFoundException("PIMS has not been synced with Keycloak.");
                _logger.LogInformation($"Adding keycloak group '{role.Name}' to user '{euser.Username}'.");
                await _keycloakService.AddGroupToUserAsync(user.KeycloakUserId.Value, role.KeycloakGroupId.Value);
            }

            // Update Roles.
            removeRoles.ForEach(r =>
            {
                var role = _pimsAdminService.Role.Find(r.RoleId) ?? throw new KeyNotFoundException("Cannot remove a role from a user, when the role does not exist.");
                if (role.KeycloakGroupId == null) throw new KeyNotFoundException("PIMS has not been synced with Keycloak.");
                euser.Roles.Remove(r);
            });
            addRoles.ForEach(r =>
            {
                var role = _pimsAdminService.Role.Find(r.RoleId) ?? throw new KeyNotFoundException("Cannot assign a role to a user, when the role does not exist.");
                if (role.KeycloakGroupId == null) throw new KeyNotFoundException("PIMS has not been synced with Keycloak.");
                euser.Roles.Add(new Entity.UserRole(euser, role));
            });

            // Update Agencies
            addAgencies.ForEach(a =>
            {
                var agency = _pimsAdminService.Agency.Find(a.AgencyId) ?? throw new KeyNotFoundException("Cannot assign an agency to a user, when the agency does not exist.");
                euser.Agencies.Add(new Entity.UserAgency(euser, agency));
            });
            removeAgencies.ForEach(a =>
            {
                euser.Agencies.Remove(a);
            });

            _pimsAdminService.User.Update(euser);

            // Now update keycloak
            var kmodel = _mapper.Map<KModel.UserModel>(user);
            kmodel.Id = user.KeycloakUserId.Value;
            kmodel.Attributes = new Dictionary<string, string[]>
            {
                ["agencies"] = _pimsService.User.GetAgencies(euser.Id).Select(a => a.ToString()).ToArray(),
                ["displayName"] = new[] { user.DisplayName }
            };
            _logger.LogInformation($"Updating keycloak agency attribute '{kmodel.Attributes["agencies"]}' for user '{euser.Username}'.");
            await _keycloakService.UpdateUserAsync(kmodel);  // TODO: Fix issue where EmailVerified will be set to false.

            return euser;
        }

        /// <summary>
        /// Updates the specified access request in the datasource. if the request is granted, 
        /// update the associated user as well.
        /// </summary>
        /// <param name="accessRequest"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public async Task<Entity.AccessRequest> UpdateAccessRequestAsync(Entity.AccessRequest accessRequest)
        {
            accessRequest.ThrowIfNull(nameof(accessRequest));
            accessRequest.ThrowIfNull(nameof(accessRequest.UserId));

            // User approving/denying the request must be authorized to do so.
            _user.ThrowIfNotAuthorized(Permissions.AdminUsers, Permissions.AgencyAdmin);

            var existingAccessRequest = _pimsAdminService.User.GetAccessRequest(accessRequest.Id);
            // If user is being granted access.
            if (existingAccessRequest.Status != Entity.AccessRequestStatus.Approved && accessRequest.Status == Entity.AccessRequestStatus.Approved)
            {
                var user = _pimsAdminService.User.Get(existingAccessRequest.UserId);

                // Add Agency to user to update.
                accessRequest.Agencies.ForEach((accessRequestAgency) =>
                {
                    if (!user.Agencies.Any(a => a.AgencyId == accessRequestAgency.AgencyId))
                    {
                        user.Agencies.Add(new Entity.UserAgency()
                        {
                            User = user,
                            AgencyId = accessRequestAgency.AgencyId
                        });
                    }
                });

                _logger.LogDebug($"Test Logging for Keycloak before going into GetUsersPreferredUsername using keycloakuserid: '{user.KeycloakUserId}' and idp should be IDIR: '{user.Username.Split("@").Last()}'");
                // Add role to user to update, and add role in keycloak.
                var preferred_username = await _pimsAdminService.User.GetUsersPreferredUsername(user.KeycloakUserId ?? Guid.Empty, user.Username.Split("@").Last());
                accessRequest.Roles.ForEach(async (accessRequestRole) =>
                {
                    if (!user.Roles.Any(r => r.RoleId == accessRequestRole.RoleId))
                    {
                        var roleEntity = _pimsAdminService.Role.Get(accessRequestRole.RoleId);
                        await _pimsAdminService.User.AddRoleToUser(preferred_username, roleEntity.Name);
                        user.Roles.Add(new Entity.UserRole()
                        {
                            User = user,
                            RoleId = accessRequestRole.RoleId
                        });
                    }
                });

                // Update user in datasource.
                _pimsAdminService.User.Update(user);
            }

            // Update Access Request and approvedById + approvedOn.
            return _pimsAdminService.User.UpdateAccessRequest(accessRequest);
        }
    }
    #endregion
}
