using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Keycloak;
using KModel = Pims.Keycloak.Models;
using Model = Pims.Api.Areas.Keycloak.Models;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal;
using Entity = Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Api.Models;
using Pims.Dal.Services.Admin;
using Pims.Core.Extensions;

namespace Pims.Api.Areas.Keycloak.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users within keycloak.
    /// </summary>
    [HasPermission(Permissions.SystemAdmin)]
    [ApiController]
    [Area("keycloak")]
    [Route("/api/[area]/users")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly ILogger<UserController> _logger;
        private readonly IPimsService _pimsService;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        private readonly IKeycloakAdmin _keycloakAdmin;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsService"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        /// <param name="keycloakAdmin"></param>
        public UserController(ILogger<UserController> logger, IPimsService pimsService, IPimsAdminService pimsAdminService, IMapper mapper, IKeycloakAdmin keycloakAdmin)
        {
            _logger = logger;
            _pimsService = pimsService;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
            _keycloakAdmin = keycloakAdmin;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Sync the user for the specified 'id' from keycloak with PIMS.
        /// If the user does not exist in keycloak it will return a 400-BadRequest.
        /// If the user does not exist in PIMS it will add it.
        /// Also links the user to the appropriate groups it is a member of within keycloak.!--
        /// If the group does not exist in PIMS it will add it.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">The user does not exist in keycloak.</exception>
        /// <returns></returns>
        [HttpPost("sync/{id}")]
        public async Task<IActionResult> SyncUserAsync(Guid id)
        {
            var kuser = await _keycloakAdmin.GetUserAsync(id) ?? throw new KeyNotFoundException();
            var kgroups = await _keycloakAdmin.GetUserGroupsAsync(id);

            var euser = _pimsAdminService.User.Find(id);
            if (euser == null)
            {
                // The user does not exist in PIMS, it needs to be added.
                euser = _mapper.Map<Entity.User>(kuser);
                euser.DisplayName = $"{kuser.LastName}, {kuser.FirstName}";
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

            return new JsonResult(kuser);
        }


        /// <summary>
        /// Fetch an array of users from keycloak.
        /// This endpoint supports paging.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync(int page = 1, int quantity = 10, string search = null)
        {
            var kusers = await _keycloakAdmin.GetUsersAsync((page - 1) * quantity, quantity, search);

            // TODO: Need better performing solution.
            var eusers = kusers.Select(u => _pimsAdminService.User.Find(u.Id) ?? new Entity.User(u.Id, $"{u.LastName}, {u.FirstName}", u.Email)
            {
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsDisabled = u.Enabled
            });
            // TODO: Apply search to this query.
            // TODO: Use a mapper.
            var result = eusers.Select(u => new Model.UserModel(u));

            return new JsonResult(result);
        }

        /// <summary>
        /// Fetch the user for the specified 'id'.
        /// If the user does not exist in keycloak or PIMS return a 400-BadRequest.
        /// </summary>
        /// <exception type="KeyNotFoundException">The user does not exist in keycloak.</exception>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAsync(Guid id)
        {
            var kuser = await _keycloakAdmin.GetUserAsync(id) ?? throw new KeyNotFoundException();
            var euser = _pimsAdminService.User.Get(kuser.Id) ?? throw new KeyNotFoundException();
            var result = _mapper.Map<Model.UserModel>(euser);

            return new JsonResult(result);
        }

        /// <summary>
        /// Update the user for the specified 'id'.
        /// If the user does not exist in Keycloak or PIMS return a 400-BadRequest.
        /// </summary>
        /// <exception type="KeyNotFoundException">The user does not exist in Keycloak or PIMS.</exception>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserAsync(Guid id, [FromBody] Model.Update.UserModel model)
        {
            var euser = _pimsAdminService.User.Get(model.Id) ?? throw new KeyNotFoundException();
            var kuser = await _keycloakAdmin.GetUserAsync(id) ?? throw new KeyNotFoundException();

            // Update PIMS
            _mapper.Map(model, euser);
            _pimsAdminService.User.UpdateOne(euser);
            var eroles = euser.Roles.ToArray();
            var eagencies = euser.Agencies.ToArray();

            foreach (var group in model.Groups)
            {
                switch (group.Action)
                {
                    case (UpdateActions.Add):
                        {
                            var erole = _pimsAdminService.Role.Find(group.Id) ?? throw new InvalidOperationException("Cannot assign a role to a user, when the role does not exist.");
                            if (!eroles.Any(r => r.RoleId == group.Id))
                            {
                                euser.Roles.Add(new Entity.UserRole(euser, erole));
                            }
                            break;
                        }
                    case (UpdateActions.Remove):
                        {
                            var erole = eroles.FirstOrDefault(r => r.RoleId == group.Id);
                            if (erole != null)
                            {
                                euser.Roles.Remove(erole);
                            }
                            break;
                        }
                }
            }

            foreach (var agency in model.Agencies)
            {
                switch (agency.Action)
                {
                    case (UpdateActions.Add):
                        {
                            var eagency = _pimsAdminService.Agency.Find(agency.Id) ?? throw new InvalidOperationException("Cannot assign an agency to a user, when the agency does not exist.");
                            if (!eagencies.Any(a => a.AgencyId == agency.Id))
                            {
                                euser.Agencies.Add(new Entity.UserAgency(euser, eagency));
                            }
                            break;
                        }
                    case (UpdateActions.Remove):
                        {
                            var eagency = eagencies.FirstOrDefault(r => r.AgencyId == agency.Id);
                            if (eagency != null)
                            {
                                euser.Agencies.Remove(eagency);
                            }
                            break;
                        }
                }
            }

            _pimsAdminService.CommitTransaction();

            // Now update keycloak
            var kmodel = _mapper.Map<KModel.UserModel>(model);
            if (kmodel.Attributes == null)
                kmodel.Attributes = new Dictionary<string, string[]>();
            kmodel.Attributes["agencies"] = _pimsService.User.GetAgencies(euser.Id).Select(a => a.ToString()).ToArray();
            await _keycloakAdmin.UpdateUserAsync(kmodel);  // TODO: Fix issue where EmailVerified will be set to false.

            // Update user group membership.
            model.Groups.Where(g => g.Action == UpdateActions.Add).ForEach(async g =>
            {
                await _keycloakAdmin.AddGroupToUserAsync(id, g.Id);
            });
            model.Groups.Where(g => g.Action == UpdateActions.Remove).ForEach(async g =>
            {
                await _keycloakAdmin.RemoveGroupFromUserAsync(id, g.Id);
            });

            var result = _mapper.Map<Model.UserModel>(euser);

            return new JsonResult(result);
        }
        #endregion
    }
}
