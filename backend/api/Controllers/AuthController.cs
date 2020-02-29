using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
        private readonly IConfiguration _configuration;
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AuthController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public AuthController(ILogger<AuthController> logger, IConfiguration configuration, IPimsService pimsService, IMapper mapper)
        {
            _logger = logger;
            _configuration = configuration;
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Redirect to the keycloak login page.
        /// </summary>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IActionResult Login()
        {
            var signinUrl = _configuration["Keycloak:Signin"];
            return Redirect($"{signinUrl}&redirect_uri=");
        }

        /// <summary>
        /// Redirect user to registration page.
        /// </summary>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IActionResult Register()
        {
            var registerUrl = _configuration["Keycloak:Register"];
            return Redirect($"{registerUrl}&redirect_uri=");
        }

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
        /// Log the current user out.
        /// </summary>
        /// <returns></returns>
        [HttpPost("[action]")]
        public IActionResult Logout()
        {
            var signoff = _configuration["Keycloak:Signoff"];
            return Redirect($"{signoff}?redirect_uri=");
        }

        /// <summary>
        /// Redirect the current user to the keycloak token request endpoint.
        /// </summary>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IActionResult Token()
        {
            var token = _configuration["Keycloak:Token"];
            return Redirect(token);
        }

        /// <summary>
        /// Return a list of claims for the current user.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet("[action]")]
        public JsonResult Claims()
        {
            return new JsonResult(User.Claims.Select(c => new { c.Type, c.Value }));
        }
        #endregion
    }
}
