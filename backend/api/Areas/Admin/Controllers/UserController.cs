using MapsterMapper;
using EModel = Pims.Dal.Entities.Models;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Areas.Admin.Models.User;
using Pims.Api.Policies;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Linq;
using Swashbuckle.AspNetCore.Annotations;

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
        /// GET - Returns a paged array of users from the datasource.
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
        /// GET - Returns a paged array of users from the datasource that belong to the same agency (or sub-agency) as the current user.
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
            if (!(filter?.Agencies?.Any() ?? false))
            {
                filter.Agencies = this.User.GetAgencies();
            }

            if (!(filter?.Agencies?.Any() ?? false)) return BadRequest("Current user does not belong to an agency");
            return GetUsers(filter);
        }

        /// <summary>
        /// GET - Returns a user for the specified 'id' from the datasource.
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
            var user = _mapper.Map<Model.UserModel>(entity);
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
            var addedEntity = _pimsAdminService.User.Add(entity);

            var user = _mapper.Map<Model.UserModel>(addedEntity);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        /// <summary>
        /// PUT - Update the user in the datasource.
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
            var updatedEntity = _pimsAdminService.User.Update(entity);

            var user = _mapper.Map<Model.UserModel>(updatedEntity);
            return new JsonResult(user);
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

        #region Access Request
        /// <summary>
        /// Gets all of the access requests that have been submitted to the system.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <param name="isGranted"></param>
        /// <returns></returns>
        [HttpGet("access/requests")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.AccessRequestModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-user" })]
        public IActionResult GetAccessRequests(int page = 1, int quantity = 10, string sort = null, bool? isGranted = null)
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 20) quantity = 20;

            var paged = _pimsAdminService.User.GetAccessRequests(page, quantity, sort, isGranted);
            var result = _mapper.Map<Api.Models.PageModel<Model.AccessRequestModel>>(paged);
            return new JsonResult(result);
        }
        #endregion
        #endregion
    }
}
