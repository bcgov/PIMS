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
using System.Linq;
using System.Threading.Tasks;
using Swashbuckle.AspNetCore.Annotations;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Http;

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
        private readonly IProxyRequestClient _requestClient;
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
        public UserController(ILogger<UserController> logger, IOptionsMonitor<Keycloak.Configuration.KeycloakOptions> optionsKeycloak, IUserService userService, IMapper mapper, IProxyRequestClient requestClient)
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
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public async Task<IActionResult> UserInfoAsync()
        {
            _optionsKeycloak.Validate(); // TODO: Validate configuration automatically.
            _optionsKeycloak.OpenIdConnect.Validate();
            var response = await _requestClient.ProxyGetAsync(Request, $"{_optionsKeycloak.Authority}{_optionsKeycloak.OpenIdConnect.UserInfo}");
            return await response.HandleResponseAsync<KModel.UserInfoModel>();
        }

        #region Access Requests
        /// <summary>
        /// Get the most recent access request for the current user.
        /// </summary>
        /// <returns></returns>
        [HttpGet("access/requests")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [ProducesResponseType(204)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public IActionResult GetAccessRequest()
        {
            var accessRequest = _userService.GetAccessRequest();
            if (accessRequest == null) return NoContent();
            return new JsonResult(_mapper.Map<Model.AccessRequestModel>(accessRequest));
        }

        /// <summary>
        /// Get the most recent access request for the current user.
        /// </summary>
        /// <returns></returns>
        [HttpGet("access/requests/{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public IActionResult GetAccessRequest(int id)
        {
            var accessRequest = _userService.GetAccessRequest(id);
            return new JsonResult(_mapper.Map<Model.AccessRequestModel>(accessRequest));
        }

        /// <summary>
        /// Provides a way for a user to submit an access request to the system, associating a role and agency to their user.
        /// </summary>
        /// <returns></returns>
        [HttpPost("access/requests")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 201)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public IActionResult AddAccessRequest([FromBody] Model.AccessRequestModel model)
        {
            if (model == null || model.Agencies == null || model.Roles == null)
            {
                throw new BadRequestException("Invalid access request specified");
            }
            if (model.Agencies.Count() != 1)
            {
                throw new BadRequestException("Each access request can only contain one agency.");
            }
            if (model.Roles.Count() != 1)
            {
                throw new BadRequestException("Each access request can only contain one role.");
            }
            var accessRequest = _mapper.Map<Entity.AccessRequest>(model);
            _userService.AddAccessRequest(accessRequest);
            return CreatedAtAction(nameof(GetAccessRequest), new { id = accessRequest.Id }, _mapper.Map<Model.AccessRequestModel>(accessRequest));
        }

        /// <summary>
        /// Provides a way for a user to update their access request.
        /// </summary>
        /// <returns></returns>
        [HttpPut("access/requests/{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "user" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Parameter 'id' is used for consistent routing.")]
        public IActionResult UpdateAccessRequest(int id, [FromBody] Model.AccessRequestModel model)
        {
            if (model == null || model.Agencies == null || model.Roles == null)
            {
                throw new BadRequestException("Invalid access request specified");
            }
            if (model.Agencies.Count() != 1)
            {
                throw new BadRequestException("Each access request can only contain one agency.");
            }
            if (model.Roles.Count() != 1)
            {
                throw new BadRequestException("Each access request can only contain one role.");
            }
            var accessRequest = _mapper.Map<Entity.AccessRequest>(model);
            _userService.UpdateAccessRequest(accessRequest);
            return new JsonResult(_mapper.Map<Model.AccessRequestModel>(accessRequest));
        }
        #endregion
        #endregion
    }
}
