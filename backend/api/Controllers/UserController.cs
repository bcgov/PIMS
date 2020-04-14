using MapsterMapper;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using Model = Pims.Api.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Api.Helpers.Extensions;
using Pims.Dal.Services;
using Pims.Keycloak;
using System.Linq;
using System.Threading.Tasks;
using Swashbuckle.AspNetCore.Annotations;
using Pims.Api.Helpers.Exceptions;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for managing users.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/users")]
    [Route("users")]
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
        [Produces("application/json")]
        [ProducesResponseType(typeof(KModel.UserInfoModel), 200)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public async Task<IActionResult> UserInfoAsync()
        {
            _optionsKeycloak.Validate(); // TODO: Validate configuration automatically.
            _optionsKeycloak.OpenIdConnect.Validate();
            var response = await _requestClient.ProxyGetAsync(Request, $"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.UserInfo}");
            return await response.HandleResponseAsync<KModel.UserInfoModel>();
        }

        /// <summary>
        /// Allows a user to submit an access request to the system, associating a role and agency to their user.
        /// </summary>
        /// <returns></returns>
        [HttpPost("access/request")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public IActionResult AddAccessRequest([FromBody] Model.AccessRequestModel accessRequestModel)
        {
            if (accessRequestModel == null || accessRequestModel.Agencies == null || accessRequestModel.Roles == null)
            {
                throw new BadRequestException("Invalid access request specified");
            }
            if (accessRequestModel.Agencies.Count() != 1)
            {
                throw new BadRequestException("Each access request can only contain one agency.");
            }
            if (accessRequestModel.Roles.Count() != 1)
            {
                throw new BadRequestException("Each access request can only contain one role.");
            }
            var entity = _mapper.Map<Entity.AccessRequest>(accessRequestModel);
            _userService.AddAccessRequest(entity);
            return new JsonResult(_mapper.Map<Model.AccessRequestModel>(entity)); // TODO: Should return 201.
        }
        #endregion
    }
}
