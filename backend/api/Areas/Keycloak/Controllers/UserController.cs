using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal;
using Entity = Pims.Dal.Entities;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Model = Pims.Api.Areas.Keycloak.Models;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Keycloak;
using KModel = Pims.Keycloak.Models;
using Pims.Dal.Keycloak;

namespace Pims.Api.Areas.Keycloak.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users within keycloak.
    /// </summary>
    [HasPermission(Permissions.AdminUsers)]
    [ApiController]
    [Area("keycloak")]
    [Route("/api/[area]/users")]
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
        public UserController(IPimsKeycloakService keycloakService, IMapper mapper)
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
        public async Task<IActionResult> GetUsersAsync(int page = 1, int quantity = 10, string search = null)
        {
            var users = await _keycloakService.GetUsersAsync((page - 1) * quantity, quantity, search);
            var result = _mapper.Map<IEnumerable<Model.UserModel>>(users);

            return new JsonResult(result);
        }

        /// <summary>
        /// Fetch the user for the specified 'id'.
        /// If the user does not exist in keycloak or PIMS return a 400-BadRequest.
        /// </summary>
        /// <exception type="KeyNotFoundException">The user does not exist in keycloak.</exception>
        /// <returns></returns>
        [HttpGet("{id}")]
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
        public async Task<IActionResult> UpdateUserAsync(Guid id, [FromBody] Model.Update.UserModel model)
        {
            var user = _mapper.Map<Entity.User>(model);
            user.Id = id;
            await _keycloakService.UpdateUserAsync(user);
            var result = _mapper.Map<Model.UserModel>(user);

            return new JsonResult(result);
        }
        #endregion
    }
}
