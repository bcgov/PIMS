using System.Collections.Generic;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Models.User;
using Pims.Core.Http;
using Pims.Dal;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Linq;
using System.Threading.Tasks;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using Model = Pims.Api.Models.User;

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
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="optionsKeycloak"></param>
        /// <param name="options"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        /// <param name="requestClient"></param>
        public UserController(ILogger<UserController> logger, IOptionsMonitor<Keycloak.Configuration.KeycloakOptions> optionsKeycloak, IOptions<PimsOptions> options, IPimsService pimsService, IMapper mapper, IProxyRequestClient requestClient)
        {
            _logger = logger;
            _optionsKeycloak = optionsKeycloak.CurrentValue;
            _requestClient = requestClient;
            _pimsService = pimsService;
            _mapper = mapper;
            _options = options.Value;
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
            var accessRequest = _pimsService.User.GetAccessRequest();
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
            var accessRequest = _pimsService.User.GetAccessRequest(id);
            return new JsonResult(_mapper.Map<Model.AccessRequestModel>(accessRequest));
        }

        /// <summary>
        /// POST /api/users/access/requests/${id} - Provides a way for a user to submit
        /// an access request to the system, associating a role and agency to their user.
        /// </summary>
        /// <returns></returns>
        [HttpPost("access/requests")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 201)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public async Task<IActionResult> AddAccessRequestAsync([FromBody] Model.AccessRequestModel model)
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
            _pimsService.User.AddAccessRequest(accessRequest);

            // Send notification to administrators and RPD mailbox
            try
            {
                var template = _pimsService.NotificationTemplate.Get(_options.AccessRequest.NotificationTemplate);
                var templateForRPD = _pimsService.NotificationTemplate.Get(_options.AccessRequest.RPDNotificationTemplate);
                var administrators = _pimsService.User.GetAdmininstrators(accessRequest.Agencies.Select(a => a.AgencyId).ToArray());
                var notification = _pimsService.NotificationQueue.GenerateNotification(
                    String.Join(";", administrators.Select(a => a.Email).Concat(new[] { _options.AccessRequest.SendTo }).Where(e => !String.IsNullOrWhiteSpace(e))),
                    "",
                    template,
                    new AccessRequestNotificationModel(accessRequest, _options));
                await _pimsService.NotificationQueue.SendNotificationsAsync(new[] { notification });

                var notificationForRPD = _pimsService.NotificationQueue.GenerateNotification(templateForRPD, new AccessRequestNotificationModel(accessRequest, _options));
                await _pimsService.NotificationQueue.SendNotificationsAsync(new[] { notificationForRPD });

            }
            catch (Exception ex)
            {
                // Ignore email errors.
                _logger.LogError(ex, "Error occurred while attempting to send an access request notification to administrators.");
            }

            return CreatedAtAction(nameof(GetAccessRequest), new { id = accessRequest.Id }, _mapper.Map<Model.AccessRequestModel>(accessRequest));
        }

        /// <summary>
        /// PUT /api/users/access/requests/${id}
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
            _pimsService.User.UpdateAccessRequest(accessRequest);
            return new JsonResult(_mapper.Map<Model.AccessRequestModel>(accessRequest));
        }

        //TODO: "Modify the /activate endpoint to also return the users agencies, removing the need for this endpoint."
        [HttpGet("agencies/{username}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(Models.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "user" })]
        public IActionResult GetUserAgencies(string username)
        {
            IEnumerable<int> userAgencies = _pimsService.User.GetAgencies(username);
            return new JsonResult(userAgencies);
        }

        #endregion
        #endregion
    }
}
