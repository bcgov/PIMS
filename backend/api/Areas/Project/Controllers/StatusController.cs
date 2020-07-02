using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Models;
using Pims.Api.Areas.Project.Models.Status;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Areas.Project.Controllers
{
    /// <summary>
    /// StatusController class, provides endpoints for searching projects.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("projects")]
    [Route("v{version:apiVersion}/[area]/status")]
    [Route("[area]/status")]
    public class StatusController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a StatusController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public StatusController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        #region Status
        /// <summary>
        /// Get an array of all project status, group by workflow and sort by sortorder.
        /// This will result in status shared by workflows being duplicated, but referencing different workflows.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<ProjectStatusModel>), 200)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetStatus()
        {
            var workflows = _pimsService.ProjectStatus.Get().SelectMany(s => s.Workflows);
            var status = (from w in workflows
                          group w by new
                          {
                              w.WorkflowId,
                              WorkflowName = w.Workflow.Name,
                              WorkflowCode = w.Workflow.Code,
                              WorkflowSortOrder = w.Workflow.SortOrder,
                              w.IsOptional,
                              w.StatusId,
                              w.Status.Name,
                              w.Status.Code,
                              w.Status.SortOrder,
                              w.Status.Description,
                              w.Status.IsDisabled,
                              w.Status.IsMilestone
                          } into ws
                          select ws);

            // Flatten the results so that status are duplicated for each relevant workflow.
            var result = status
                .OrderBy(s => s.Key.WorkflowSortOrder)
                .ThenBy(s => s.Key.SortOrder)
                .Select(s =>
            {
                var model = _mapper.Map<ProjectStatusModel>(s.Key);
                model.Workflow = new WorkflowModel()
                {
                    Id = s.Key.WorkflowId,
                    Name = s.Key.WorkflowName,
                    Code = s.Key.WorkflowCode,
                    SortOrder = s.Key.WorkflowSortOrder,
                };
                return model;
            }).ToArray();
            return new JsonResult(result);
        }
        #endregion

        #region Tasks
        /// <summary>
        /// Get an array of tasks for the current disposal project status.
        /// </summary>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        [HttpGet("{statusCode}/tasks")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<TaskModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetTasksForStatus(string statusCode)
        {
            var tasks = _pimsService.Task.GetForStatus(statusCode).Select(s => _mapper.Map<TaskModel>(s)).ToArray();
            return new JsonResult(tasks);
        }

        /// <summary>
        /// Get an array of tasks for the current disposal project status.
        /// </summary>
        /// <param name="statusId"></param>
        /// <returns></returns>
        [HttpGet("{statusId:int}/tasks")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<TaskModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetTasksForStatus(int statusId)
        {
            var tasks = _pimsService.Task.GetForStatus(statusId).Select(s => _mapper.Map<TaskModel>(s)).ToArray();
            return new JsonResult(tasks);
        }
        #endregion
        #endregion
    }
}
