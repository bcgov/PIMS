using System;
using System.Linq;
using System.Net.Http;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Pims.Api.Data;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;
using Pims.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Pims.Api.Helpers.Extensions;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    // [Authorize (Roles = "administrator")]
    [ApiController]
    [Area("admin")]
    [Route("/api/[area]/[controller]")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;
        private readonly PIMSContext _dbContext;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="clientFactory"></param>
        /// <param name="dbContext"></param>
        /// <param name="mapper"></param>
        public UserController(ILogger<UserController> logger, IConfiguration configuration, IHttpClientFactory clientFactory, PIMSContext dbContext, IMapper mapper)
        {
            _logger = logger;
            _configuration = configuration;
            _clientFactory = clientFactory;
            _dbContext = dbContext;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// GET - Returns a paged array of users from the datasource.
        /// </summary>
        /// <returns>Paged object with an array of users.</returns>
        [HttpGet("/api/admin/users")]
        public IActionResult GetUsers(int page = 1, int quantity = 10, string sort = null) // TODO: sort and filter.
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 50) quantity = 50;

            var query = _dbContext.Users.AsNoTracking();
            var total = query.Count();
            var entities = query.Skip((page - 1) * quantity).Take(quantity);
            var users = _mapper.Map<Model.UserModel[]>(entities);
            var paged = new Paged<Model.UserModel>(users, page, quantity, total);
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
            var entity = _dbContext.Users.AsNoTracking().FirstOrDefault(u => u.Id == id);

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
            var userId = this.User.GetUserId();
            entity.CreatedById = userId;
            _dbContext.Users.Add(entity);
            _dbContext.CommitTransaction();
            var user = _mapper.Map<Model.UserModel>(entity);
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
            var entity = _dbContext.Users.Find(model.Id);

            if (entity == null) return BadRequest("Item does not exist");
            var userId = this.User.GetUserId();

            _mapper.Map(model, entity);
            entity.UpdatedOn = DateTime.UtcNow;
            entity.UpdatedById = userId;
            _logger.LogDebug($"userId: {userId}");
            _dbContext.Users.Update(entity);
            _dbContext.CommitTransaction();
            var user = _mapper.Map<Model.UserModel>(entity);
            return new JsonResult(user);
        }

        /// <summary>
        /// DELETE - Delete the user from the datasource.
        /// </summary>
        /// <param name="model">The user model.</param>
        /// <returns>The user who was deleted.</returns>
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(Guid id, [FromBody] Model.UserModel model)
        {
            var entity = _dbContext.Users.Find(id);

            if (entity == null) return BadRequest("Item does not exist");

            entity.RowVersion = Convert.FromBase64String(model.RowVersion);
            _dbContext.Users.Remove(entity);
            _dbContext.CommitTransaction();
            return new JsonResult(model);
        }
        #endregion
    }
}
