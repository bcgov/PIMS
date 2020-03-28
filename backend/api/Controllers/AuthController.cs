using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal;
using Pims.Dal.Helpers.Extensions;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// AuthController class, provides endpoints for authentication.
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/auth")]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        #region Variables
        private readonly ILogger<AuthController> _logger;
        private readonly Keycloak.Configuration.KeycloakOptions _optionsKeycloak;
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AuthController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="optionsKeycloak"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public AuthController(ILogger<AuthController> logger, IOptionsMonitor<Keycloak.Configuration.KeycloakOptions> optionsKeycloak, IPimsService pimsService, IMapper mapper)
        {
            _logger = logger;
            _optionsKeycloak = optionsKeycloak.CurrentValue;
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Activates the new authenticated user with PIMS.
        /// If the user is new it will return 201 if successful.
        /// If the user exists already it will return 200 if successful.
        /// Note - This requires KeyCloak client mapping to include the appropriate claims to activate the user (email, family name, given name, groups, realm roles).
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpPost("activate")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Models.Auth.UserModel), 200)]
        [SwaggerOperation(Tags = new[] { "auth" })]
        public IActionResult Activate()
        {
            var user_id = this.User.GetUserId();
            var exists = _pimsService.User.UserExists(user_id);

            if (!exists)
            {
                var user = _pimsService.User.Activate();
                return new CreatedResult($"{user.Id}", new Models.Auth.UserModel(user));
            }
            else
            {
                return new JsonResult(new Models.Auth.UserModel(user_id));
            }
        }

        /// <summary>
        /// Redirect user to registration page.
        /// </summary>
        /// <returns></returns>
        [HttpGet("register")]
        [SwaggerOperation(Tags = new[] { "auth" })]
        public IActionResult Register(string redirect_uri)
        {
            var uri = new UriBuilder($"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.Register}");
            uri.AppendQuery("client_id", _optionsKeycloak.Client);
            uri.AppendQuery("redirect_uri", redirect_uri);
            return Redirect(uri.ToString());
        }

        /// <summary>
        /// Redirect to the keycloak login page.
        /// </summary>
        /// <returns></returns>
        [HttpGet("login")]
        [SwaggerOperation(Tags = new[] { "auth" })]
        public IActionResult Login(string redirect_uri)
        {
            var uri = new UriBuilder($"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.Login}");
            uri.AppendQuery("client_id", _optionsKeycloak.Client);
            uri.AppendQuery("redirect_uri", redirect_uri);
            return Redirect(uri.ToString());
        }

        /// <summary>
        /// Log the current user out.
        /// </summary>
        /// <returns></returns>
        [HttpPost("logout")]
        [SwaggerOperation(Tags = new[] { "auth" })]
        public IActionResult Logout(string redirect_uri)
        {
            var uri = new UriBuilder($"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.Logout}");
            uri.AppendQuery("client_id", _optionsKeycloak.Client);
            uri.AppendQuery("redirect_uri", redirect_uri);
            return Redirect(uri.ToString());
        }

        /// <summary>
        /// Return a list of claims for the current user.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet("claims")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Models.Auth.ClaimModel>), 200)]
        [SwaggerOperation(Tags = new[] { "auth" })]
        public IActionResult Claims()
        {
            return new JsonResult(User.Claims.Select(c => new Models.Auth.ClaimModel(c.Type, c.Value)));
        }
        #endregion
    }
}
