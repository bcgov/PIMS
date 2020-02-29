using System;
using System.Net.Http;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Services.Admin;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// RoleController class, provides endpoints for managing roles.
    /// </summary>
    [Authorize(Roles = "system-administrator")]
    [ApiController]
    [Area("admin")]
    [Route("/api/[area]/[controller]")]
    public class RoleController : ControllerBase
    {
        #region Variables
        private readonly ILogger<RoleController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RoleController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="clientFactory"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public RoleController(ILogger<RoleController> logger, IConfiguration configuration, IHttpClientFactory clientFactory, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _configuration = configuration;
            _clientFactory = clientFactory;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// GET - Returns a paged array of roles from the datasource.
        /// </summary>
        /// <returns>Paged object with an array of roles.</returns>
        [HttpGet("/api/admin/roles")]
        public IActionResult GetRoles(int page = 1, int quantity = 10, string sort = null) // TODO: sort and filter.
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 50) quantity = 50;

            var result = _pimsAdminService.Role.GetNoTracking(page, quantity, sort);
            var roles = _mapper.Map<Model.RoleModel[]>(result.Items);
            var paged = new Paged<Model.RoleModel>(roles, page, quantity, result.Total); // TODO: Better way to go from one Paged type to another.
            return new JsonResult(paged);
        }

        /// <summary>
        /// GET - Returns a role for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the role to return.</param>
        /// <returns>The role requested.</returns>
        /// [HttpGet ("{id}")]
        public IActionResult GetRole(Guid id)
        {
            var entity = _pimsAdminService.Role.GetNoTracking(id);

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
        public IActionResult AddRole([FromBody] Model.RoleModel model)
        {
            var entity = _mapper.Map<Entity.Role>(model); // TODO: Return bad request.
            _pimsAdminService.Role.Add(entity);
            var role = _mapper.Map<Model.RoleModel>(entity);
            return new JsonResult(role);
        }

        /// <summary>
        /// PUT - Update the role in the datasource.
        /// </summary>
        /// <param name="model">The role model.</param>
        /// <returns>The role updated.</returns>
        [HttpPut]
        public IActionResult UpdateRole([FromBody] Model.RoleModel model)
        {
            var entity = _mapper.Map<Role>(model);
            _pimsAdminService.Role.Update(entity);

            var role = _mapper.Map<Model.RoleModel>(entity);
            return new JsonResult(role);
        }

        /// <summary>
        /// DELETE - Delete the role from the datasource.
        /// </summary>
        /// <param name="model">The role model.</param>
        /// <returns>The role who was deleted.</returns>
        [HttpDelete("{id}")]
        public IActionResult DeleteRole(Guid id, [FromBody] Model.RoleModel model)
        {
            var entity = _mapper.Map<Role>(model);
            _pimsAdminService.Role.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
