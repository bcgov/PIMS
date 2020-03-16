using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Dal;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// AuthController class, provides endpoints for authentication.
    /// </summary>
    [ApiController]
    [Route("/api/[controller]")]
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
        [HttpPost("[action]")]
        public IActionResult Activate()
        {
            var user_id = this.User.GetUserId();
            var exists = _pimsService.User.UserExists(user_id);

            if (!exists)
            {
                var user = _pimsService.User.Activate();
                return new CreatedResult($"{user.Id}", new { user.Id });
            }
            else
            {
                return new JsonResult(new { Id = user_id });
            }
        }

        /// <summary>
        /// Redirect to the keycloak login page.
        /// </summary>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IActionResult Login(string redirect_uri)
        {
            var loginUrl = $"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.Login}";
            return Redirect($"{loginUrl}&redirect_uri={redirect_uri}");
        }

        /// <summary>
        /// Redirect user to registration page.
        /// </summary>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IActionResult Register(string redirect_uri)
        {
            var registerUrl = $"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.Register}";
            return Redirect($"{registerUrl}&redirect_uri={redirect_uri}");
        }

        /// <summary>
        /// Log the current user out.
        /// </summary>
        /// <returns></returns>
        [HttpPost("[action]")]
        public IActionResult Logout(string redirect_uri)
        {
            var logoutUrl = $"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.Logout}";
            return Redirect($"{logoutUrl}?redirect_uri={redirect_uri}");
        }

        /// <summary>
        /// Redirect the current user to the keycloak token request endpoint.
        /// </summary>
        /// <returns></returns>
        [HttpPost("[action]")]
        public IActionResult Token()
        {
            var tokenUrl = $"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.Token}";
            return Redirect(tokenUrl);
        }

        /// <summary>
        /// Return a list of claims for the current user.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet("[action]")]
        public IActionResult Claims()
        {
            return new JsonResult(User.Claims.Select(c => new { c.Type, c.Value }));
        }
        #endregion
    }
}
