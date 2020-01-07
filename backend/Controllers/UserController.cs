using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using BackendApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MembershipModel = BackendApi.Membership.Models;
using Model = BackendApi.Models;

namespace BackendApi.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    [Authorize (Roles = "contributor")]
    [ApiController]
    [Route ("/api/[controller]")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="clientFactory"></param>
        public UserController (ILogger<AuthController> logger, IConfiguration configuration, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _configuration = configuration;
            _clientFactory = clientFactory;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Redirects user to the keycloak users list endpoint.
        /// </summary>
        /// <returns></returns>
        [HttpGet ("/api/users")]
        public IActionResult UserList ()
        {
            var usersUrl = _configuration.GetSection ("Keycloak:Users");

            return new RedirectResult (usersUrl?.Value);

            // var token = Request.Headers["Authorization"];
            // var request = new HttpRequestMessage (HttpMethod.Get, usersUrl?.Value);
            // request.Headers.Add ("Authorization", token.ToString ());
            // request.Headers.Add ("X-Forwarded-For", Request.Host.Value);

            // var client = _clientFactory.CreateClient ();
            // var response = await client.SendAsync (request);

            // if (response.IsSuccessStatusCode)
            // {
            //     using (var responseStream = await response.Content.ReadAsStreamAsync ())
            //     {
            //         var results = await JsonSerializer.DeserializeAsync<IEnumerable<MembershipModel.User>> (responseStream);
            //         var users = results.Select (r => new Model.User (r)).ToArray ();
            //         return new JsonResult (users);
            //     }
            // }
            // else
            // {
            //     return new StatusCodeResult ((int) response.StatusCode);
            // }
        }
        #endregion
    }
}
