using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Areas.Notification.Models.Queue;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading.Tasks;

namespace Pims.Api.Areas.Notification.Controllers
{
    /// <summary>
    /// QueueController class, provides endpoints for interacting with the notification queue.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("notifications")]
    [Route("v{version:apiVersion}/[area]/queue")]
    [Route("[area]/queue")]
    public class QueueController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a QueueController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public QueueController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get all the notifications that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        [HasPermission(Permissions.SystemAdmin)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PageModel<NotificationQueueModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "notification" })]
        public IActionResult GetNotificationsPage()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetNotificationsPage(new NotificationQueueFilter(query));
        }

        /// <summary>
        /// Get all the notifications that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.SystemAdmin)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PageModel<NotificationQueueModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "notification" })]
        public IActionResult GetNotificationsPage([FromBody]NotificationQueueFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Projects filter must contain valid values.");

            var page = _pimsService.NotificationQueue.GetPage(filter);
            return new JsonResult(_mapper.Map<PageModel<NotificationQueueModel>>(page));
        }

        /// <summary>
        /// Get the notification in the queue for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [HasPermission(Permissions.SystemAdmin)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(NotificationQueueModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "notification" })]
        public IActionResult GetNotificationQueue(int id)
        {
            var notification = _pimsService.NotificationQueue.Get(id);
            return new JsonResult(_mapper.Map<NotificationQueueModel>(notification));
        }

        /// <summary>
        /// Update the status of the notification in the queue for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.SystemAdmin)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(NotificationQueueModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "notification" })]
        public async Task<IActionResult> UpdateNotificationStatusAsync(int id)
        {
            var notification = await _pimsService.NotificationQueue.UpdateStatusAsync(id);
            return new JsonResult(_mapper.Map<NotificationQueueModel>(notification));
        }
        #endregion
    }
}
