using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal.Keycloak;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.Role;

namespace Pims.Api.Areas.Keycloak.Controllers
{
    /// <summary>
    /// RoleController class, provides endpoints for managing the integration between keycloak groups and PIMS roles.
    /// </summary>
    [HasPermission(Permissions.AdminRoles)]
    [ApiController]
    [Area("keycloak")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/roles")]
    [Route("[area]/roles")]
    public class RoleController : ControllerBase
    {
        #region Variables
        private readonly IPimsKeycloakService _keycloakService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RoleController class, initializes with specified arguments.
        /// </summary>
        /// <param name="keycloakService"></param>
        /// <param name="mapper"></param>
        public RoleController(IPimsKeycloakService keycloakService, IMapper mapper)
        {
            _mapper = mapper;
            _keycloakService = keycloakService;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Sync keycloak groups into PIMS roles.
        /// </summary>
        /// <returns></returns>
        [HttpPost("sync")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.RoleModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-role" })]
        [HasPermission(Permissions.AdminRoles)]
        public async Task<IActionResult> SyncRolesAsync()
        {
            var roles = await _keycloakService.SyncRolesAsync();
            var result = _mapper.Map<Model.RoleModel[]>(roles);

            return new JsonResult(result);
        }

        /// <summary>
        /// Fetch a list of groups from Keycloak and their associated role within PIMS.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.RoleModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-role" })]
        [HasPermission(Permissions.AdminRoles)]
        public async Task<IActionResult> GetRolesAsync(int page = 1, int quantity = 10, string search = null)
        {
            var roles = await _keycloakService.GetRolesAsync(page, quantity, search);
            var result = _mapper.Map<Model.RoleModel[]>(roles);

            return new JsonResult(result);
        }

        /// <summary>
        /// Fetch role for the specified 'id'.
        /// If the group doesn't exist in keycloak it will return a 400 BadRequest.
        /// If the role doesn't exist in PIMS it will return a 400 BadRequest.
        /// </summary>
        /// <exception type="KeyNotFoundException">The role does not exist for the specified 'id'.</exception>
        /// <returns></returns>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.RoleModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-role" })]
        [HasPermission(Permissions.AdminRoles)]
        public async Task<IActionResult> GetRoleAsync(Guid id)
        {
            var role = await _keycloakService.GetRoleAsync(id);
            var result = _mapper.Map<Model.RoleModel>(role);

            return new JsonResult(result);
        }

        /// <summary>
        /// Update the keycloak group and PIMS role for the specified 'id'.
        /// If the group doesn't exist in keycloak it will return a 400 BadRequest.
        /// If the role doesn't exist in PIMS it will create it.
        /// </summary>
        /// <exception type="KeyNotFoundException">The role does not exist for the specified 'id'.</exception>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.RoleModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-role" })]
        [HasPermission(Permissions.AdminRoles)]
        public async Task<IActionResult> UpdateRoleAsync(Guid id, [FromBody] Model.Update.RoleModel model)
        {
            var role = _mapper.Map<Entity.Role>(model);
            role.Id = id;
            await _keycloakService.UpdateRoleAsync(role);
            var result = _mapper.Map<Model.RoleModel>(role);

            return new JsonResult(result);
        }
        #endregion
    }
}
