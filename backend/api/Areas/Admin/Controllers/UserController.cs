using System;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Areas.Admin.Models;
using Entity = Pims.Dal.Entities;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    [HasPermission(Permissions.SystemAdmin)]
    [ApiController]
    [Area("admin")]
    [Route("/api/[area]/[controller]")]
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
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns>Paged object with an array of users.</returns>
        [HttpGet("/api/admin/users")]
        public IActionResult GetUsers(int page = 1, int quantity = 10, string sort = null) // TODO: sort and filter.
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 50) quantity = 50;

            var results = _pimsAdminService.User.GetNoTracking(page, quantity, sort);
            var users = _mapper.Map<Model.UserModel[]>(results.Items);
            var paged = new Pims.Dal.Entities.Models.Paged<Model.UserModel>(users, page, quantity, results.Total);
            return new JsonResult(paged);
        }

        /// <summary>
        /// GET - Returns a user for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the user to return.</param>
        /// <returns>The user requested.</returns>
        [HttpGet("{id}")]
        public IActionResult GetUser(Guid id)
        {
            var entity = _pimsAdminService.User.GetNoTracking(id);

            if (entity == null) return NoContent();

            var user = _mapper.Map<Model.UserModel>(entity);
            return new JsonResult(user);
        }

        /// <summary>
        /// POST - Add a new user to the datasource.
        /// </summary>
        /// <param name="model">The user model.</param>
        /// <returns>The user added.</returns>
        [HttpPost]
        public IActionResult AddUser([FromBody] Model.UserModel model)
        {
            var entity = _mapper.Map<Entity.User>(model); // TODO: Return bad request.
            var addedEntity = _pimsAdminService.User.Add(entity);
            var user = _mapper.Map<Model.UserModel>(addedEntity);
            return new JsonResult(user);
        }

        /// <summary>
        /// PUT - Update the user in the datasource.
        /// </summary>
        /// <param name="model">The user model.</param>
        /// <returns>The user updated.</returns>
        [HttpPut]
        public IActionResult UpdateUser([FromBody] Model.UserModel model)
        {
            var entity = _mapper.Map<Entity.User>(model);
            var updatedEntity = _pimsAdminService.User.Update(entity);

            if (updatedEntity == null) return BadRequest("Item does not exist");
            var user = _mapper.Map<Model.UserModel>(updatedEntity);
            return new JsonResult(user);
        }

        /// <summary>
        /// DELETE - Delete the user from the datasource.
        /// </summary>
        /// <param name="model">The user model.</param>
        /// <returns>The user who was deleted.</returns>
        [HttpDelete]
        public IActionResult DeleteUser([FromBody] Model.UserModel model)
        {
            var entity = _mapper.Map<Entity.User>(model);
            _pimsAdminService.User.Remove(entity);

            return new JsonResult(model);
        }

        /// <summary>
        /// Gets all of the access requests that have been submitted to the system.
        /// </summary>
        /// <returns></returns>
        [HttpGet("/api/access/requests")]
        public IActionResult GetAccessRequests(int page = 1, int quantity = 10, string sort = null, bool? isGranted = null)
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 20) quantity = 20;
            Entity.Models.Paged<Entity.AccessRequest> result = _pimsAdminService.User.GetAccessRequestsNoTracking(page, quantity, sort, isGranted);
            var entities = _mapper.Map<Api.Models.AccessRequestModel[]>(result.Items);
            var paged = new Models.Paged<Api.Models.AccessRequestModel>(entities, page, quantity, result.Total);
            return new JsonResult(paged);
        }
        #endregion
    }
}
