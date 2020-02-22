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
        private readonly RequestClient _requestClient;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="requestClient"></param>
        public UserController(ILogger<UserController> logger, IConfiguration configuration, RequestClient requestClient)
        {
            _logger = logger;
            _configuration = configuration;
            _requestClient = requestClient;
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
        #endregion
    }
}
