using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Keycloak;
using Pims.Dal.Services.Admin;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using Model = Pims.Api.Areas.Keycloak.Models;
using Pims.Api.Policies;
using Pims.Dal.Security;
using System.Linq;
using System.Collections.Generic;

namespace Pims.Api.Areas.Keycloak.Controllers
{
    /// <summary>
    /// GroupController class, provides endpoints for managing groups within keycloak.
    /// </summary>
    [HasPermission(Permissions.AdminRoles)]
    [ApiController]
    [Area("keycloak")]
    [Route("/api/[area]/groups")]
    public class GroupController : ControllerBase
    {
        #region Variables
        private readonly ILogger<GroupController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        private readonly IKeycloakAdmin _keycloakAdmin;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a GroupController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        /// <param name="keycloakAdmin"></param>
        public GroupController(ILogger<GroupController> logger, IPimsAdminService pimsAdminService, IMapper mapper, IKeycloakAdmin keycloakAdmin)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
            _keycloakAdmin = keycloakAdmin;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Sync keycloak groups into PIMS roles.
        /// </summary>
        /// <returns></returns>
        [HttpPost("sync")]
        public async Task<IActionResult> SyncGroupsAsync()
        {
            var gcount = await _keycloakAdmin.GetGroupCountAsync();

            var groups = new List<KModel.GroupModel>();
            for (var i = 0; i < gcount; i += 10)
            {
                var kgroups = await _keycloakAdmin.GetGroupsAsync(i, 10);

                foreach (var kgroup in kgroups)
                {
                    var erole = _pimsAdminService.Role.Find(kgroup.Id);

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

                    groups.Add(kgroup);
                }

                _pimsAdminService.CommitTransaction();
            }

            // Remove groups in PIMS that don't exist in keycloak.
            var groupIds = groups.Select(g => g.Id).ToArray();
            _pimsAdminService.Role.RemoveAll(groupIds);

            var result = _mapper.Map<Model.GroupModel[]>(groups);

            return new JsonResult(result);
        }

        /// <summary>
        /// Fetch a list of groups from keycloak.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetGroupsAsync(int page = 1, int quantity = 10, string search = null)
        {
            var kgroups = await _keycloakAdmin.GetGroupsAsync((page - 1) * quantity, quantity, search);

            // TODO: Need better performing solution.
            var eroles = kgroups.Select(g => _pimsAdminService.Role.Find(g.Id) ?? _mapper.Map<Entity.Role>(g));
            var result = _mapper.Map<Model.GroupModel[]>(eroles);

            return new JsonResult(result);
        }

        /// <summary>
        /// Fetch the group for the specified 'id'.
        /// If the group doesn't exist in keycloak it will return a 400 BadRequest.
        /// If the group doesn't exist in PIMS it will return a 400 BadRequest.
        /// </summary>
        /// <exception type="KeyNotFoundException">The group does not exist for the specified 'id'.</exception>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroupAsync(Guid id)
        {
            var kgroup = await _keycloakAdmin.GetGroupAsync(id);
            if (kgroup == null) throw new KeyNotFoundException();
            var erole = _pimsAdminService.Role.GetNoTracking(kgroup.Id);
            var result = _mapper.Map<Model.GroupModel>(erole);

            return new JsonResult(result);
        }

        /// <summary>
        /// Update the group for the specified 'id'.
        /// If the group doesn't exist in keycloak it will return a 400 BadRequest.
        /// If the group doesn't exist in PIMS it will create it.
        /// </summary>
        /// <exception type="KeyNotFoundException">The group does not exist for the specified 'id'.</exception>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroupAsync(Guid id, [FromBody] Model.Update.GroupModel model)
        {
            var kgroup = await _keycloakAdmin.GetGroupAsync(id);
            if (kgroup == null) throw new KeyNotFoundException();

            // Update PIMS first.
            var entity = _pimsAdminService.Role.Find(id);
            if (entity == null)
            {
                // Role does not exist in PIMS, it needs to be added.
                _pimsAdminService.Role.Add(entity);
            }
            else
            {
                _mapper.Map(model, entity);
                _pimsAdminService.Role.Update(entity);
            }

            // Update Keycloak second.
            var kmodel = _mapper.Map<KModel.GroupModel>(model);
            await _keycloakAdmin.UpdateGroupAsync(kmodel);

            var result = _mapper.Map<Model.GroupModel>(entity);

            return new JsonResult(result);
        }
        #endregion
    }
}
