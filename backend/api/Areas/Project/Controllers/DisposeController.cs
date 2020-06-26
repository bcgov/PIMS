using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Models;
using Pims.Api.Areas.Project.Models.Dispose;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using Entity = Pims.Dal.Entities;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        private readonly IMapper _mapper;
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a DisposeController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public DisposeController(IOptionsMonitor<PimsOptions> options, IPimsService pimsService, IMapper mapper)
        {
            _options = options.CurrentValue;
            _pimsService = pimsService;
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
            var project = _pimsService.Project.Add(_mapper.Map<Entity.Project>(model));
            var notifications = _pimsService.NotificationQueue.GenerateNotifications(project, null, project.StatusId);
            await _pimsService.NotificationQueue.SendNotificationsAsync(notifications);

            return CreatedAtAction(nameof(GetProject), new { projectNumber = project.ProjectNumber }, _mapper.Map<ProjectModel>(project)); // TODO: If notifications have failures an different response should be returned.
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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/update/{id})")]
        public async Task<IActionResult> UpdateProjectAsync(string projectNumber, ProjectModel model)
        {
            var project = _pimsService.Project.Get(model.Id);
            var fromStatusId = project.StatusId;
            project = _pimsService.Project.Update(_mapper.Map<Entity.Project>(model));
            var notifications = _pimsService.NotificationQueue.GenerateNotifications(project, fromStatusId, project.StatusId);
            await _pimsService.NotificationQueue.SendNotificationsAsync(notifications);

            return new JsonResult(_mapper.Map<ProjectModel>(project)); // TODO: If notifications have failures an different response should be returned.
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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/delete/{id})")]
        public IActionResult DeleteProject(string projectNumber, ProjectModel model)
        {
            _pimsService.Project.Remove(_mapper.Map<Entity.Project>(model));
            return new JsonResult(model);
        }

        /// <summary>
        /// Update the specified 'project' by submitting it to the specified 'workflowCode' and request to change the status to the specified 'statusCode'
        /// </summary>
        /// <param name="workflowCode"></param>
        /// <param name="statusCode"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("workflow/{workflowCode}/{statusCode}")]
        [HasPermission(Permissions.ProjectEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public async Task<IActionResult> SetStatusAsync(string workflowCode, string statusCode, ProjectModel model)
        {
            if (String.IsNullOrWhiteSpace(workflowCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(workflowCode));
            if (String.IsNullOrWhiteSpace(statusCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(statusCode));

            var project = _pimsService.Project.Get(model.Id);
            var fromStatusId = project.StatusId;

            var workflow = _pimsService.Workflow.Get(workflowCode);
            var status = workflow.Status.FirstOrDefault(s => s.Status.Code == statusCode) ?? throw new KeyNotFoundException();
            model.StatusId = status.StatusId;
            project = _pimsService.Project.SetStatus(_mapper.Map<Entity.Project>(model), workflowCode);

            var notifications = _pimsService.NotificationQueue.GenerateNotifications(project, fromStatusId, project.StatusId);
            await _pimsService.NotificationQueue.SendNotificationsAsync(notifications);

            return new JsonResult(_mapper.Map<ProjectModel>(project));
        }

        /// <summary>
        /// Update the specified 'project' by submitting it to the specified 'workflowCode' and request to change the status to the specified 'statusId'
        /// </summary>
        /// <param name="workflowCode"></param>
        /// <param name="statusId"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("workflow/{workflowCode}/{statusId:int}")]
        [HasPermission(Permissions.ProjectEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public async Task<IActionResult> SetStatusAsync(string workflowCode, int statusId, ProjectModel model)
        {
            if (String.IsNullOrWhiteSpace(workflowCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(workflowCode));

            var project = _pimsService.Project.Get(model.Id);
            var fromStatusId = project.StatusId;

            model.StatusId = statusId;
            project = _pimsService.Project.SetStatus(_mapper.Map<Entity.Project>(model), workflowCode);

            var notifications = _pimsService.NotificationQueue.GenerateNotifications(project, fromStatusId, project.StatusId);
            await _pimsService.NotificationQueue.SendNotificationsAsync(notifications);

            return new JsonResult(_mapper.Map<ProjectModel>(project));
        }
        #endregion
    }
}
