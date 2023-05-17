using MapsterMapper;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using System;
using EModel = Pims.Dal.Entities.Models;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;
using GoldModel = Pims.Api.Areas.Admin.Models.GoldUser;
using System.Linq;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    [HasPermission(Permissions.AdminUsers)]
    [ApiController]
    [Area("admin")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/users")]
    [Route("[area]/users")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly ILogger<UserController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        private readonly object res;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public UserController(ILogger<UserController> logger, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// GET - Returns a paged array of users from the datasource.
        /// </summary>
        /// <returns>Paged object with an array of users.</returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.UserModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult GetUsers()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetUsers(new EModel.UserFilter(query));
        }

        /// <summary>
        /// POST - Returns a paged array of users from the datasource.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns>Paged object with an array of users.</returns>
        [HttpPost("filter")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.UserModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult GetUsers(EModel.UserFilter filter)
        {
            var page = _pimsAdminService.User.Get(filter);
            var result = _mapper.Map<Api.Models.PageModel<Model.UserModel>>(page);
            return new JsonResult(result);
        }

        /// <summary>
        /// POST /api/admin/users/my/agency - Returns a paged array of users from the datasource that belong to the same agency (or sub-agency) as the current user.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns>Paged object with an array of users.</returns>
        [HttpPost("my/agency")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.UserModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult GetMyUsers(EModel.UserFilter filter)
        {
            return GetUsers(filter);
        }

        /// <summary>
        /// GET /api/admin/users/${id} - Returns a user for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the user to return.</param>
        /// <returns>The user requested.</returns>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult GetUser(Guid id)
        {
            var entity = _pimsAdminService.User.Get(id);
            var user = _mapper.Map<GoldModel.GoldUser>(entity);
            return new JsonResult(user);
        }

        /// <summary>
        /// POST - Add a new user to the datasource.
        /// </summary>
        /// <param name="model">The user model.</param>
        /// <returns>The user added.</returns>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 201)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult AddUser([FromBody] Model.UserModel model)
        {
            var entity = _mapper.Map<Entity.User>(model);
            _pimsAdminService.User.Add(entity);

            var user = _mapper.Map<Model.UserModel>(entity);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        /// <summary>
        /// PUT /api/admin/user/{id} - Update the user in the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The user model.</param>
        /// <returns>The user updated.</returns>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Parameter 'id' is required for route.")]
        public IActionResult UpdateUser(Guid id, [FromBody] Model.UserModel model)
        {
            var entity = _mapper.Map<Entity.User>(model);
            _pimsAdminService.User.Update(entity);
            var user = _mapper.Map<Model.UserModel>(entity);
            return new JsonResult(user);
        }
        public class AddRolesToUserRequest
        {
            public string[] Roles { get; set; }
        }
        public class RemoveRolesToUserRequest
        {
            public string[] Roles { get; set; }
        }

        /// <summary>
        /// POST - Get all roles from the Keycloak Gold API.
        /// </summary>
        /// <returns>JSON Array of the user roles.</returns>
        [HttpGet("getroles")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult GetRoles()
        {
            var res = _pimsAdminService.User.GetRolesAsync().Result;
            return new JsonResult(res);

        }

        /// <summary>
        /// DELETE - Remove a role from the user by calling the Keycloak Gold API.
        /// </summary>
        /// <param name="username">The user's username</param>
        /// <param name="request"></param>
        /// <returns>JSON Array of the users roles, updated with the one just added.</returns>
        [HttpDelete("roles/{username}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult DeleteRoleFromUser(string username, [FromBody] RemoveRolesToUserRequest request)
        {
            var user = _pimsAdminService.User.Get(username);
            var preferred_username = _pimsAdminService.User.GetUsersPreferredUsername(user.KeycloakUserId ?? Guid.Empty, user.Username.Split("@").Last()).Result;
            foreach (var role in request.Roles)
            {
                var res = _pimsAdminService.User.DeleteRoleFromUser(preferred_username, role).Result;
            }
            return new JsonResult(res);
        }


        /// <summary>
        /// POST - Add a role to the user by calling the Keycloak Gold API.
        /// </summary>
        /// <param name="username">The user's username</param>
        /// <param name="request"></param>
        /// <returns>JSON Array of the users roles, updated with the one just added.</returns>
        [HttpPost("roles/{username}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult AddRoleToUser(string username, [FromBody] AddRolesToUserRequest request)
        {
            var user = _pimsAdminService.User.Get(username);
            var preferred_username = _pimsAdminService.User.GetUsersPreferredUsername(user.KeycloakUserId ?? Guid.Empty, user.Username.Split("@").Last()).Result;
            foreach (var role in request.Roles)
            {
                var res = _pimsAdminService.User.AddRoleToUser(preferred_username, role).Result;
            }
            return new JsonResult(res);
        }

        /// <summary>
        /// POST - Get roles for a specific user from the Keycloak Gold API.
        /// </summary>
        /// <returns>JSON Array of the user's roles.</returns>
        [HttpGet("roles/{username}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult UserRoles(string username)
        {
            var res = _pimsAdminService.User.GetGoldUsersRolesAsync(username).Result;
            return new JsonResult(res);

        }

        /// <summary>
        /// DELETE - Delete the user from the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The user model.</param>
        /// <returns>The user who was deleted.</returns>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.UserModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Parameter 'id' is required for route.")]
        public IActionResult DeleteUser(Guid id, [FromBody] Model.UserModel model)
        {
            var entity = _mapper.Map<Entity.User>(model);
            _pimsAdminService.User.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
