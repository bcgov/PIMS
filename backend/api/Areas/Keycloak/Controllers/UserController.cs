using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal.Keycloak;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AdminModels = Pims.Api.Areas.Admin.Models.User;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users within keycloak.
    /// </summary>
    [HasPermission(Permissions.AdminUsers)]
    [ApiController]
    [Area("keycloak")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/users")]
    [Route("[area]/users")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly IMapper _mapper;
        private readonly IPimsKeycloakService _keycloakService;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="keycloakService"></param>
        /// <param name="mapper"></param>
        public UserController(IMapper mapper, IPimsKeycloakService keycloakService)
        {
            _keycloakService = keycloakService;
            _mapper = mapper;
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
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-user" })]
        [HasPermission(Permissions.AdminUsers)]
        public async Task<IActionResult> SyncUserAsync(Guid id)
        {
            var user = await _keycloakService.SyncUserAsync(id);
            var result = _mapper.Map<Model.UserModel>(user);

            return new JsonResult(result);
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
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.UserModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-user" })]
        [HasPermission(Permissions.AdminUsers)]
        public async Task<IActionResult> GetUsersAsync(int page = 1, int quantity = 10, string search = null)
        {
            var users = await _keycloakService.GetUsersAsync(page, quantity, search);
            var result = _mapper.Map<Model.UserModel[]>(users);

            return new JsonResult(result);
        }

        /// <summary>
        /// Fetch the user for the specified 'id'.
        /// If the user does not exist in keycloak or PIMS return a 400-BadRequest.
        /// </summary>
        /// <exception type="KeyNotFoundException">The user does not exist in keycloak.</exception>
        /// <returns></returns>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-user" })]
        [HasPermission(Permissions.AdminUsers)]
        public async Task<IActionResult> GetUserAsync(Guid id)
        {
            var user = await _keycloakService.GetUserAsync(id);
            var result = _mapper.Map<Model.UserModel>(user);

            return new JsonResult(result);
        }

        /// <summary>
        /// Update the user for the specified 'id'.
        /// If the user does not exist in Keycloak or PIMS return a 400-BadRequest.
        /// </summary>
        /// <exception type="KeyNotFoundException">The user does not exist in Keycloak or PIMS.</exception>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(AdminModels.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-user" })]
        [HasPermission(Permissions.AdminUsers)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Parameter 'id' is required for route.")]
        public async Task<IActionResult> UpdateUserAsync(Guid id, [FromBody] AdminModels.UserModel model)
        {
            var user = _mapper.Map<Entity.User>(model);
            var entity = await _keycloakService.UpdateUserAsync(user);
            var result = _mapper.Map<AdminModels.UserModel>(entity);
            return new JsonResult(result);
        }

        #region Access Request
        /// <summary>
        /// Update an access request, generally to grant/deny it.
        /// </summary>
        /// <returns></returns>
        [HttpPut("access/request")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "keycloak-user" })]
        [HasPermission(Permissions.AdminUsers)]
        public async Task<IActionResult> UpdateAccessRequestAsync(Model.AccessRequestModel updateModel)
        {
            var entity = _mapper.Map<Entity.AccessRequest>(updateModel);
            var updatedEntity = await _keycloakService.UpdateAccessRequestAsync(entity);
            var user = _mapper.Map<Model.AccessRequestModel>(updatedEntity);
            return new JsonResult(user);
        }
        #endregion
        #endregion
    }
}
