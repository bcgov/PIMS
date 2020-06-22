using Pims.Core.Helpers;
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
        /// Sync all the groups in keycloak with PIMS.
        /// This will delete any additional roles within PIMS.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Entity.Role>> SyncRolesAsync()
        {
            var gcount = await _keycloakService.GetGroupCountAsync();

            var roles = new List<Entity.Role>();
            for (var i = 0; i < gcount; i += 10)
            {
                var kgroups = await _keycloakService.GetGroupsAsync(i, 10);

                foreach (var kgroup in kgroups)
                {
                    var erole = _pimsAdminService.Role.GetByName(kgroup.Name);

                    if (erole == null)
                    {
                        // Need to add the group as a role within PIMS.
                        erole = _mapper.Map<Entity.Role>(kgroup);
                        _pimsAdminService.Role.AddOne(erole);
                    }
                    else
                    {
                        _mapper.Map(kgroup, erole);
                        _pimsAdminService.Role.UpdateOne(erole);
                    }

                    roles.Add(erole);
                }

                _pimsAdminService.CommitTransaction();
            }

            // Remove groups in PIMS that don't exist in keycloak.
            var roleIds = roles.Select(g => g.Id).ToArray();
            _pimsAdminService.Role.RemoveAll(roleIds);

            return roles;
        }

        /// <summary>
        /// Get an array of roles from keycloak and PIMS.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Entity.Role>> GetRolesAsync(int page = 1, int quantity = 10, string search = null)
        {
            var kgroups = await _keycloakService.GetGroupsAsync((page - 1) * quantity, quantity, search);

            // TODO: Need better performing solution.
            var eroles = kgroups.Select(g => ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Role.GetByKeycloakId(g.Id)) ?? _mapper.Map<Entity.Role>(g));

            return eroles;
        }

        /// <summary>
        /// Get the role specified by the 'id', if they exist in keycloak and PIMS.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.Role> GetRoleAsync(Guid id)
        {
            var role = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Role.Get(id));
            if (role == null)
            {
                var kgroup = await _keycloakService.GetGroupAsync(id) ?? throw new KeyNotFoundException();
                return _mapper.Map<Entity.Role>(kgroup);
            }
            return role;
        }

        /// <summary>
        /// Update the specified role in keycloak and PIMS.
        /// This will add the role to PIMS if it does not current exist.
        /// </summary>
        /// <param name="role"></param>
        /// <exception type="KeyNotFoundException">User does not exist in keycloak or PIMS.</exception>
        /// <returns></returns>
        public async Task<Entity.Role> UpdateRoleAsync(Entity.Role role)
        {
            if (await _keycloakService.GetGroupAsync(role.Id) == null) throw new KeyNotFoundException();

            // Role does not exist in PIMS, it needs to be added.
            if (_pimsAdminService.Role.Find(role.Id) == null)
            {
                _pimsAdminService.Role.Add(role);
            }
            else
            {
                _pimsAdminService.Role.Update(role);
            }

            var kmodel = _mapper.Map<KModel.GroupModel>(role);
            await _keycloakService.UpdateGroupAsync(kmodel);

            return role;
        }
    }
    #endregion
}
