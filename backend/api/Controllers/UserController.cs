using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AutoMapper;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Models;
using Pims.Dal.Services;
using Pims.Keycloak;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using System.Text;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly ILogger<UserController> _logger;
        private readonly Keycloak.Configuration.KeycloakOptions _optionsKeycloak;
        private readonly IKeycloakRequestClient _requestClient;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="optionsKeycloak"></param>
        /// <param name="userService"></param>
        /// <param name="mapper"></param>
        /// <param name="requestClient"></param>
        public UserController(ILogger<UserController> logger, IOptionsMonitor<Keycloak.Configuration.KeycloakOptions> optionsKeycloak, IUserService userService, IMapper mapper, IKeycloakRequestClient requestClient)
        {
            _logger = logger;
            _optionsKeycloak = optionsKeycloak.CurrentValue;
            _requestClient = requestClient;
            _userService = userService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Redirects user to the keycloak user info endpoint.
        /// </summary>
        /// <returns></returns>
        [HttpGet("info")]
        public async Task<IActionResult> UserInfo()
        {
            _optionsKeycloak.Validate(); // TODO: Validate configuration automatically.
            _optionsKeycloak.OpenIdConnect.Validate();
            var response = await _requestClient.ProxyGetAsync(Request, $"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.UserInfo}");

            using var responseStream = await response.Content.ReadAsStreamAsync();

            var readStream = new System.IO.StreamReader(responseStream, Encoding.UTF8);
            var json = readStream.ReadToEnd();
            _logger.LogInformation(json);
            responseStream.Position = 0;

            return await response.HandleResponseAsync<KModel.UserInfoModel>();
        }

        /// <summary>
        /// Allows a user to submit an access request to the system, associating a role and agency to their user.
        /// </summary>
        /// <returns></returns>
        [HttpPost("/api/access/request")]
        public IActionResult AddAccessRequest([FromBody] AccessRequestModel accessRequestModel)
        {
            if (accessRequestModel == null || accessRequestModel.Agencies == null || accessRequestModel.Roles == null)
            {
                return BadRequest("Invalid access request specified");
            }
            if (accessRequestModel.Agencies.Count() != 1)
            {
                return BadRequest("Each access request can only contain one agency.");
            }
            if (accessRequestModel.Roles.Count() != 1)
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
