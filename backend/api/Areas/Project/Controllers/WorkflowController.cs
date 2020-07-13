using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Areas.Project.Models.Workflow;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Areas.Project.Controllers
{
    /// <summary>
    /// WorkflowController class, provides endpoints for managing disposal projects.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("projects")]
    [Route("v{version:apiVersion}/[area]/workflows")]
    [Route("[area]/workflows")]
    public class WorkflowController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a WorkflowController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public WorkflowController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get an array of project status steps for the submit disposal project workflow.
        /// </summary>
        /// <param name="workflowCode"></param>
        /// <returns></returns>
        [HttpGet("{workflowCode}/status")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<ProjectStatusModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetWorkflowStatus(string workflowCode)
        {
            if (String.IsNullOrWhiteSpace(workflowCode)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(workflowCode));

            var status = _pimsService.Workflow.Get(workflowCode).Status.Select(s => _mapper.Map<ProjectStatusModel>(s)).ToArray();
            return new JsonResult(status);
        }

        /// <summary>
        /// Get an array of tasks for the current disposal project status.
        /// </summary>
        /// <param name="workflowCode"></param>
        /// <returns></returns>
        [HttpGet("{workflowCode}/tasks")]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<TaskModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetWorkflowTasks(string workflowCode)
        {
            var tasks = _pimsService.Task.GetForWorkflow(workflowCode).Select(s => _mapper.Map<TaskModel>(s)).ToArray();
            return new JsonResult(tasks);
        }
        #endregion
    }
}
