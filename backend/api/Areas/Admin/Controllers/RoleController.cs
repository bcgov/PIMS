using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Areas.Admin.Models.Role;
using Pims.Api.Policies;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using Swashbuckle.AspNetCore.Annotations;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// RoleController class, provides endpoints for managing roles.
    /// </summary>
    [HasPermission(Permissions.SystemAdmin)]
    [ApiController]
    [Area("admin")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/roles")]
    [Route("[area]/roles")]
    public class RoleController : ControllerBase
    {
        #region Variables
        private readonly ILogger<RoleController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RoleController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public RoleController(ILogger<RoleController> logger, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// GET - Returns a paged array of roles from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <returns>Paged object with an array of roles.</returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Paged<Model.RoleModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-role" })]
        public IActionResult GetRoles(int page = 1, int quantity = 10) // TODO: sort and filter.
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 50) quantity = 50;

            var result = _pimsAdminService.Role.Get(page, quantity);
            var roles = _mapper.Map<Model.RoleModel[]>(result.Items);
            var paged = new Paged<Model.RoleModel>(roles, page, quantity, result.Total); // TODO: Better way to go from one Paged type to another.
            return new JsonResult(paged);
        }

        /// <summary>
        /// GET - Returns a role for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the role to return.</param>
        /// <returns>The role requested.</returns>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.RoleModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-role" })]
        public IActionResult GetRole(Guid id)
        {
            var entity = _pimsAdminService.Role.Get(id);

            if (entity == null) return NoContent();

            var role = _mapper.Map<Model.RoleModel>(entity);
            return new JsonResult(role);
        }

        /// <summary>
        /// POST - Add a new role to the datasource.
        /// </summary>
        /// <param name="model">The role model.</param>
        /// <returns>The role added.</returns>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.RoleModel), 201)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-role" })]
        public IActionResult AddRole([FromBody] Model.RoleModel model)
        {
            var entity = _mapper.Map<Entity.Role>(model); // TODO: Return bad request.
            _pimsAdminService.Role.Add(entity);
            var role = _mapper.Map<Model.RoleModel>(entity);

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, role);
        }

        /// <summary>
        /// PUT - Update the role in the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The role model.</param>
        /// <returns>The role updated.</returns>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.RoleModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-role" })]
        public IActionResult UpdateRole(Guid id, [FromBody] Model.RoleModel model)
        {
            var entity = _mapper.Map<Role>(model);
            _pimsAdminService.Role.Update(entity);

            var role = _mapper.Map<Model.RoleModel>(entity);
            return new JsonResult(role);
        }

        /// <summary>
        /// DELETE - Delete the role from the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The role model.</param>
        /// <returns>The role who was deleted.</returns>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.RoleModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-role" })]
        public IActionResult DeleteRole(Guid id, [FromBody] Model.RoleModel model)
        {
            var entity = _mapper.Map<Role>(model);
            _pimsAdminService.Role.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
