using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Pims.Api.Areas.Project.Models.Dispose;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Core.Extensions;
using Pims.Dal;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Pims.Notifications;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entity = Pims.Dal.Entities;
using NModel = Pims.Api.Areas.Notification.Models.Queue;

namespace Pims.Api.Areas.Project.Controllers
{
    /// <summary>
    /// DisposeController class, provides endpoints for managing disposal projects.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("projects")]
    [Route("v{version:apiVersion}/[area]/disposal")]
    [Route("[area]/disposal")]
    public class DisposeController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly INotificationService _notifyService;
        private readonly IMapper _mapper;
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a DisposeController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="pimsService"></param>
        /// <param name="notifyService"></param>
        /// <param name="mapper"></param>
        public DisposeController(IOptionsMonitor<PimsOptions> options, IPimsService pimsService, INotificationService notifyService, IMapper mapper)
        {
            _options = options.CurrentValue;
            _pimsService = pimsService;
            _notifyService = notifyService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get the project for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetProject(int id)
        {
            var project = _mapper.Map<ProjectModel>(_pimsService.Project.Get(id));
            return new JsonResult(project);
        }

        /// <summary>
        /// Get the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        [HttpGet("{projectNumber}")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetProject(string projectNumber)
        {
            var project = _mapper.Map<ProjectModel>(_pimsService.Project.Get(projectNumber));
            return new JsonResult(project);
        }

        /// <summary>
        /// Add the project to the datasource.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [HasPermission(Permissions.ProjectAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 201)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public async Task<IActionResult> AddProjectAsync(ProjectModel model)
        {
            var project = await _pimsService.Project.AddAsync(_mapper.Map<Entity.Project>(model));
            return CreatedAtAction(nameof(GetProject), new { projectNumber = project.ProjectNumber }, _mapper.Map<ProjectModel>(project)); // TODO: If notifications have failures a different response should be returned.
        }

        /// <summary>
        /// Update the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{projectNumber}")]
        [HasPermission(Permissions.ProjectEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/{projectNumber})")]
        public async Task<IActionResult> UpdateProjectAsync(string projectNumber, ProjectModel model)
        {
            var project = await _pimsService.Project.UpdateAsync(_mapper.Map<Entity.Project>(model));
            return new JsonResult(_mapper.Map<ProjectModel>(project)); // TODO: If notifications have failures a different response should be returned.
        }

        /// <summary>
        /// Delete the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{projectNumber}")]
        [HasPermission(Permissions.ProjectDelete)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/{projectNumber})")]
        public async Task<IActionResult> DeleteProjectAsync(string projectNumber, ProjectModel model)
        {
            var project = await _pimsService.Project.RemoveAsync(_mapper.Map<Entity.Project>(model));
            return new JsonResult(_mapper.Map<ProjectModel>(project));
        }

        #region SetStatus
        /// <summary>
        /// Update the specified 'project' by submitting it to the specified 'workflowCode' and request to change the status to the specified 'statusCode'
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("workflows")]
        [HasPermission(Permissions.ProjectEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public async Task<IActionResult> SetStatusAsync(ProjectModel model)
        {
            if (String.IsNullOrWhiteSpace(model.WorkflowCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(model.WorkflowCode));
            if (String.IsNullOrWhiteSpace(model.StatusCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(model.StatusCode));

            var project = _mapper.Map<Entity.Project>(model);
            var workflow = _pimsService.Workflow.Get(model.WorkflowCode);
            var status = workflow.Status.FirstOrDefault(s => s.Status.Code == model.StatusCode) ?? throw new KeyNotFoundException();
            project.WorkflowId = workflow.Id;
            project.StatusId = status.StatusId;
            project = await _pimsService.Project.SetStatusAsync(project, workflow);

            return new JsonResult(_mapper.Map<ProjectModel>(project));
        }

        /// <summary>
        /// Update the specified 'project' by submitting it to the specified 'workflowCode' and request to change the status to the specified 'statusCode'
        /// </summary>
        /// <param name="workflowCode"></param>
        /// <param name="statusCode"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("workflows/{workflowCode}/{statusCode}")]
        [HasPermission(Permissions.ProjectEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public async Task<IActionResult> SetStatusAsync(string workflowCode, string statusCode, ProjectModel model)
        {
            if (String.IsNullOrWhiteSpace(workflowCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(workflowCode));
            if (String.IsNullOrWhiteSpace(statusCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(statusCode));

            model.WorkflowCode = workflowCode;
            model.StatusCode = statusCode;
            return await SetStatusAsync(model);
        }

        /// <summary>
        /// Update the specified 'project' by submitting it to the specified 'workflowCode' and request to change the status to the specified 'statusId'
        /// </summary>
        /// <param name="workflowCode"></param>
        /// <param name="statusId"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("workflows/{workflowCode}/{statusId:int}")]
        [HasPermission(Permissions.ProjectEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public async Task<IActionResult> SetStatusAsync(string workflowCode, int statusId, ProjectModel model)
        {
            if (String.IsNullOrWhiteSpace(workflowCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(workflowCode));

            var status = _pimsService.ProjectStatus.Get(statusId);
            model.WorkflowCode = workflowCode;
            model.StatusCode = status.Code;
            return await SetStatusAsync(model);
        }
        #endregion

        #region Notifications
        /// <summary>
        /// Get the notifications for the specified project filter based on query parameters.
        /// This will also update the status of all notifications that have not failed or been completed.
        /// </summary>
        /// <returns></returns>
        [HttpGet("{id}/notifications")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PageModel<NModel.NotificationQueueModel>), 200)]
        [SwaggerOperation(Tags = new[] { "project", "notification" })]
        public async Task<IActionResult> GetProjectNotificationsAsync(int id)
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return await GetProjectNotificationsAsync(new ProjectNotificationFilter(query) { ProjectId = id });
        }

        /// <summary>
        /// Get the notifications for the specified project based on the specified 'filter'.
        /// This will also update the status of all notifications that have not failed or been completed.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("notifications")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PageModel<NModel.NotificationQueueModel>), 200)]
        [SwaggerOperation(Tags = new[] { "project", "notification" })]
        public async Task<IActionResult> GetProjectNotificationsAsync(ProjectNotificationFilter filter)
        {
            var page = _pimsService.Project.GetNotificationsInQueue(filter);
            foreach (var notification in page.Items.Where(n => n.ChesMessageId.HasValue && n.Status.In(NotificationStatus.Accepted, NotificationStatus.Pending)))
            {
                var response = await _notifyService.GetStatusAsync(notification.ChesMessageId.Value);
                notification.Status = (Entity.NotificationStatus)Enum.Parse(typeof(Entity.NotificationStatus), response.Status, true);
            }
            _pimsService.NotificationQueue.Update(page);

            return new JsonResult(_mapper.Map<PageModel<NModel.NotificationQueueModel>>(page));
        }

        /// <summary>
        /// Make a request to cancel any notifications in the queue that haven't been sent yet.
        /// Note - The queue may not immediately cancel the notification, and the response may indicate it is still Pending.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("{id}/notifications/cancel")]
        [HasPermission(Permissions.ProjectEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<NModel.NotificationQueueModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project", "notification" })]
        public async Task<IActionResult> CancelProjectNotificationsAsync(int id)
        {
            var notifications = await _pimsService.Project.CancelNotificationsAsync(id);
            _pimsService.NotificationQueue.Update(notifications);
            return new JsonResult(_mapper.Map<IEnumerable<NModel.NotificationQueueModel>>(notifications));
        }
        #endregion
        #endregion
    }
}
