using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Pims.Core.Extensions;
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
            var eusers = kusers.Select(u => _pimsAdminService.User.Find(u.Id) ?? _mapper.Map<Entity.User>(u));

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

            var addRoles = user.Roles.Except(euser.Roles).ToArray();
            var removeRoles = euser.Roles.Except(user.Roles).ToArray();
            var addAgencies = user.Agencies.Except(euser.Agencies).ToArray();
            var removeAgencies = euser.Agencies.Except(user.Agencies).ToArray();

            // Update PIMS
            _pimsAdminService.User.SetCurrentValues(user, euser);
            _pimsAdminService.User.UpdateOne(euser);

            // Update Roles.
            addRoles.ForEach(async r =>
            {
                var role = _pimsAdminService.Role.Find(r.RoleId) ?? throw new KeyNotFoundException("Cannot assign a role to a user, when the role does not exist.");
                euser.Roles.Add(new Entity.UserRole(euser, role));
                await _keycloakService.AddGroupToUserAsync(user.Id, r.RoleId);
            });
            removeRoles.ForEach(async r =>
            {
                euser.Roles.Remove(r);
                await _keycloakService.RemoveGroupFromUserAsync(user.Id, r.RoleId);
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

            _pimsAdminService.CommitTransaction();

            // Now update keycloak
            var kmodel = _mapper.Map<KModel.UserModel>(user);
            kmodel.Attributes = new Dictionary<string, string[]>
            {
                ["agencies"] = _pimsService.User.GetAgencies(euser.Id).Select(a => a.ToString()).ToArray()
            };
            await _keycloakService.UpdateUserAsync(kmodel);  // TODO: Fix issue where EmailVerified will be set to false.

            return euser;
        }
    }
    #endregion
}
