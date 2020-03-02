using System.Collections.Generic;
using System.Threading.Tasks;
using api.Helpers.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Pims.Api.Helpers;
using Pims.Dal.Exceptions;
using MembershipModel = Pims.Dal.Membership.Models;
using Pims.Api.Models;
using Pims.Dal.Services;
using System.Linq;
using Entity = Pims.Dal.Entities;
using AutoMapper;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    [Authorize(Roles = "contributor")]
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IRequestClient _requestClient;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="requestClient"></param>
        public UserController(ILogger<UserController> logger, IConfiguration configuration, IUserService userService, IMapper mapper, IRequestClient requestClient)
        {
            _logger = logger;
            _configuration = configuration;
            _requestClient = requestClient;
            _userService = userService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Redirects user to the keycloak users list endpoint.
        /// </summary>
        /// <returns></returns>
        [HttpGet("/api/users")]
        public async Task<IActionResult> UserListAsync()
        {
            var users_url = _configuration.GetSection("Keycloak:Users") ?? throw new ConfigurationException("The configuration for Keycloak:Users is invalid or missing.");
            var response = await _requestClient.GetAsync(Request, users_url?.Value);

            return await response.HandleResponseAsync<IEnumerable<MembershipModel.User>>();
        }

        /// <summary>
        /// Redirects user to the keycloak user info endpoint.
        /// </summary>
        /// <returns></returns>
        [HttpGet("info")]
        public async Task<IActionResult> UserInfo()
        {
            var user_info_url = _configuration.GetSection("Keycloak:UserInfo") ?? throw new ConfigurationException("The configuration for Keycloak:UserInfo is invalid or missing.");
            var response = await _requestClient.GetAsync(Request, user_info_url?.Value);

            return await response.HandleResponseAsync<MembershipModel.User>();
        }

        /// <summary>
        /// Allows a user to submit an access request to the system, associating a role and agency to their user.
        /// </summary>
        /// <returns></returns>
        [HttpPost("/api/accessRequest")]
        public IActionResult AddAccessRequest([FromBody] AccessRequestModel accessRequestModel)
        {
            if(accessRequestModel.Agencies.Count() > 1)
            {
                return BadRequest("Each access request can only contain one agency.");
            }
            if(accessRequestModel.Roles.Count() > 1)
            {
                return BadRequest("Each access request can only contain one role.");
            }
            var entity = _mapper.Map<Entity.AccessRequest>(accessRequestModel);
            _userService.AddAccessRequest(entity);
            return new JsonResult(_mapper.Map<AccessRequestModel>(entity));
        }
        #endregion
    }
}
