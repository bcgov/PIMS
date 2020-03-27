using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Api.Policies;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Services.Admin;
using Pims.Dal.Security;
using Model = Pims.Api.Areas.Admin.Models;
using EModel = Pims.Dal.Entities.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    [HasPermission(Permissions.AdminUsers)]
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
        /// <param name="userId"></param>
        /// <returns>Paged object with an array of users.</returns>
        [HttpGet("/api/admin/users")]
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
        [HttpPost("/api/admin/users")]
        public IActionResult GetUsers(EModel.UserFilter filter)
        {
            var results = _pimsAdminService.User.GetNoTracking(filter);
            var users = _mapper.Map<Model.UserModel[]>(results.Items);
            var paged = new EModel.Paged<Model.UserModel>(users, filter.Page, filter.Quantity, results.Total);
            return new JsonResult(paged);
        }

        /// <summary>
        /// GET - Returns a paged array of users from the datasource that belong to the same agency (or sub-agency) as the current user.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns>Paged object with an array of users.</returns>
        [HttpPost("/api/admin/my/users")]
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
            var entity = _mapper.Map<Entity.User>(model);
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
        [HttpGet("/api/admin/access/requests")]
        public IActionResult GetAccessRequests(int page = 1, int quantity = 10, string sort = null, bool? isGranted = null)
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 20) quantity = 20;
            EModel.Paged<Entity.AccessRequest> result = _pimsAdminService.User.GetAccessRequestsNoTracking(page, quantity, sort, isGranted);
            var entities = _mapper.Map<Api.Models.AccessRequestModel[]>(result.Items);
            var paged = new EModel.Paged<Api.Models.AccessRequestModel>(entities, page, quantity, result.Total);
            return new JsonResult(paged);
        }
        #endregion
    }
}
