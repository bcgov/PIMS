using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BackendApi.Controllers
{
    /// <summary>
    /// AuthController class, provides endpoints for authentication.
    /// </summary>
    [ApiController]
    [Route ("/api/[controller]")]
    public class AuthController : ControllerBase
    {
        #region Variables
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;
        #endregion

        #region Constructors
        public AuthController (ILogger<AuthController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Return environment variables for the frontend.
        /// </summary>
        /// <returns></returns>
        [HttpGet ("/api/env")]
        public IActionResult Environment ()
        {
            return new JsonResult (new
            {
                apiUrl = "",
                    environment = "Development",
                    googleApiKey = "",
                    mapboxApiKey = ""
            });
        }

        /// <summary>
        /// Return a list of claims for the current user.
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet ("[action]")]
        public JsonResult Claims ()
        {
            return new JsonResult (User.Claims.Select (c => new { c.Type, c.Value }));
        }

        /// <summary>
        /// Redirect to the keycloak login page.
        /// </summary>
        /// <returns></returns>
        [HttpGet ("[action]")]
        public IActionResult Login ()
        {
            var signinUrl = _configuration["Keycloak:Signin"];
            return Redirect ($"{signinUrl}&redirect_uri=");
        }

        /// <summary>
        /// Redirect user to registration page.
        /// </summary>
        /// <returns></returns>
        [HttpGet ("[action]")]
        public IActionResult Register ()
        {
            var registerUrl = _configuration["Keycloak:Register"];
            return Redirect ($"{registerUrl}&redirect_uri=");
        }

        /// <summary>
        /// Log the current user out.
        /// </summary>
        /// <returns></returns>
        [HttpPost ("[action]")]
        public IActionResult Logout ()
        {
            var signoff = _configuration["Keycloak:Signoff"];
            return Redirect ($"{signoff}?redirect_uri=");
        }

        /// <summary>
        /// Redirect the current user to the keycloak token request endpoint.
        /// </summary>
        /// <returns></returns>
        [HttpGet ("[action]")]
        public IActionResult Token ()
        {
            var token = _configuration["Keycloak:Token"];
            return Redirect (token);
        }

        /// <summary>
        /// Redirect the current user to the keycloak userinfo endpoint.
        /// /// </summary>
        /// <returns></returns>
        [HttpGet ("[action]")]
        public IActionResult UserInfo ()
        {
            var userInfo = _configuration["Keycloak:UserInfo"];
            return Redirect (userInfo);
        }
        #endregion
    }
}
