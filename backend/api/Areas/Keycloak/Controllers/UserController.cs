using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Api.Helpers;
using Pims.Api.Helpers.Extensions;
using Pims.Dal.Services.Admin;
using Model = Pims.Api.Models.Keycloak;

namespace Pims.Api.Areas.Keycloak.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users within keycloak.
    /// </summary>
    [Authorize(Roles = "system-administrator")]
    [ApiController]
    [Area("keycloak")]
    [Route("/api/[area]/users")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly ILogger<UserController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        private readonly Pims.Api.Configuration.KeycloakOptions _optionsKeycloak;
        private readonly IKeycloakRequestClient _requestClient;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        /// <param name="optionsKeycloak"></param>
        /// <param name="requestClient"></param>
        public UserController(ILogger<UserController> logger, IPimsAdminService pimsAdminService, IMapper mapper, IOptionsMonitor<Pims.Api.Configuration.KeycloakOptions> optionsKeycloak, IKeycloakRequestClient requestClient)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
            _optionsKeycloak = optionsKeycloak.CurrentValue;
            _requestClient = requestClient;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Fetch a list of users from keycloak.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync()
        {
            _optionsKeycloak.Admin.Validate();
            var response = await _requestClient.GetAsync($"{_optionsKeycloak.Admin.Authority}{_optionsKeycloak.Admin.Users}");

            return await response.HandleResponseAsync<IEnumerable<Model.UserModel>>();
        }

        /// <summary>
        /// Fetch the user for the specified 'id'.
        /// </summary>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAsync(string id)
        {
            _optionsKeycloak.Admin.Validate();
            var response = await _requestClient.GetAsync($"{_optionsKeycloak.Admin.Authority}{_optionsKeycloak.Admin.Users}/{id}");

            return await response.HandleResponseAsync<IEnumerable<Model.UserModel>>();
        }

        /// <summary>
        /// Update the user for the specified 'id'.
        /// </summary>
        /// /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserAsync(string id, [FromBody] Model.UserModel model)
        {
            _optionsKeycloak.Admin.Validate();
            var json = JsonSerializer.Serialize(model);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _requestClient.PutAsync($"{_optionsKeycloak.Admin.Authority}{_optionsKeycloak.Admin.Users}/{id}", content);

            return await response.HandleResponseAsync<IEnumerable<Model.UserModel>>();
        }
        #endregion
    }
}
