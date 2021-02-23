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

namespace Pims.Dal.Keycloak
{
    /// <summary>
    /// PimsKeycloakService class, provides a way to integrate both PIMS and Keycloak datasources.
    /// </summary>
    public partial class PimsKeycloakService : IPimsKeycloakService
    {
        #region Methods
        /// <summary>
        /// Sync the user for the specified 'id' from keycloak to PIMS.
        /// If the user doesn't exist in PIMS it will add it.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.User> SyncUserAsync(Guid id)
        {
            var kuser = await _keycloakService.GetUserAsync(id) ?? throw new KeyNotFoundException();
            var kgroups = await _keycloakService.GetUserGroupsAsync(id);

            var euser = _pimsAdminService.User.Find(id);
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
            var eusers = kusers.Select(u => ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.User.Get(u.Id)) ?? _mapper.Map<Entity.User>(u));

            return eusers;
        }

        /// <summary>
        /// Get the user specified for the 'id', only if they exist in Keycloak and PIMS.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.User> GetUserAsync(Guid id)
        {
            var kuser = await _keycloakService.GetUserAsync(id) ?? throw new KeyNotFoundException();
            return _pimsAdminService.User.Get(kuser.Id);
        }

        /// <summary>
        /// Update the specified user in keycloak and PIMS.
        /// </summary>
        /// <param name="user"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.User> UpdateUserAsync(Entity.User user)
        {
            var kuser = await _keycloakService.GetUserAsync(user.Id) ?? throw new KeyNotFoundException();
            var euser = _pimsAdminService.User.Get(user.Id);

            if (user.Username != kuser.Username) throw new InvalidOperationException($"Cannot change the username from '{kuser.Username}' to '{user.Username}'.");

            var addRoles = user.Roles.Except(euser.Roles, new UserRoleRoleIdComparer()).ToArray();
            var removeRoles = euser.Roles.Except(user.Roles, new UserRoleRoleIdComparer()).ToArray();
            var addAgencies = user.Agencies.Except(euser.Agencies, new UserAgencyAgencyIdComparer()).ToArray();
            var removeAgencies = euser.Agencies.Except(user.Agencies, new UserAgencyAgencyIdComparer()).ToArray();

            // Update PIMS
            _mapper.Map(user, euser);

            // Update Roles.
            addRoles.ForEach(async r =>
            {
                var role = _pimsAdminService.Role.Find(r.RoleId) ?? throw new KeyNotFoundException("Cannot assign a role to a user, when the role does not exist.");
                if (role.KeycloakGroupId == null) throw new KeyNotFoundException("PIMS has not been synced with Keycloak.");
                euser.Roles.Add(new Entity.UserRole(euser, role));
                await _keycloakService.AddGroupToUserAsync(user.Id, role.KeycloakGroupId.Value);
            });
            removeRoles.ForEach(async r =>
            {
                var role = _pimsAdminService.Role.Find(r.RoleId) ?? throw new KeyNotFoundException("Cannot remove a role from a user, when the role does not exist.");
                if (role.KeycloakGroupId == null) throw new KeyNotFoundException("PIMS has not been synced with Keycloak.");
                euser.Roles.Remove(r);
                await _keycloakService.RemoveGroupFromUserAsync(user.Id, role.KeycloakGroupId.Value);
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
            kmodel.Attributes = new Dictionary<string, string[]>
            {
                ["agencies"] = _pimsService.User.GetAgencies(euser.Id).Select(a => a.ToString()).ToArray(),
                ["displayName"] = new[] { user.DisplayName }
            };
            await _keycloakService.UpdateUserAsync(kmodel);  // TODO: Fix issue where EmailVerified will be set to false.

            return euser;
        }

        /// <summary>
        /// Updates the specified access request in the datasource. if the request is granted, update the associated user as well.
        /// </summary>
        /// <param name="accessRequest"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public async Task<Entity.AccessRequest> UpdateAccessRequestAsync(Entity.AccessRequest accessRequest)
        {
            accessRequest.ThrowIfNull(nameof(accessRequest));
            accessRequest.ThrowIfNull(nameof(accessRequest.UserId));

            _user.ThrowIfNotAuthorized(Permissions.AdminUsers, Permissions.AgencyAdmin);
            var existingAccessRequest = _pimsAdminService.User.GetAccessRequest(accessRequest.Id);
            if (existingAccessRequest.Status != Entity.AccessRequestStatus.Approved && accessRequest.Status == Entity.AccessRequestStatus.Approved)
            {
                var user = _pimsAdminService.User.Get(existingAccessRequest.UserId);
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
                accessRequest.Roles.ForEach((accessRequestRole) =>
                {
                    if (!user.Roles.Any(r => r.RoleId == accessRequestRole.RoleId))
                    {
                        user.Roles.Add(new Entity.UserRole()
                        {
                            User = user,
                            RoleId = accessRequestRole.RoleId
                        });
                    }
                });
                await UpdateUserAsync(user);
            }

            return _pimsAdminService.User.UpdateAccessRequest(accessRequest);
        }
    }
    #endregion
}
