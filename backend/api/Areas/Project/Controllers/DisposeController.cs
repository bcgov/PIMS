using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Models;
using Pims.Api.Areas.Project.Models.Dispose;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Linq;
using Entity = Pims.Dal.Entities;
using Pims.Dal.Entities;

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
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a DisposeController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public DisposeController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get an array of project status steps for the submit disposal project workflow.
        /// </summary>
        /// <returns></returns>
        [HttpGet("workflow")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<ProjectStatusModel>), 200)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetWorkflow()
        {
            var status = _pimsService.Project.GetWorkflow("SubmitDisposal").Select(s => _mapper.Map<ProjectStatusModel>(s)).ToArray();
            return new JsonResult(status);
        }

        /// <summary>
        /// Get an array of tasks for the submit disposal project workflow.
        /// </summary>
        /// <returns></returns>
        [HttpGet("tasks")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<ProjectStatusModel>), 200)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetTasks()
        {
            var tasks = _pimsService.Task.Get(TaskTypes.DisposalProjectDocuments).Select(s => _mapper.Map<TaskModel>(s)).ToArray();
            return new JsonResult(tasks);
        }

        /// <summary>
        /// Get the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        [HttpGet("{projectNumber}")]
        [HasPermission(Permissions.PropertyView)]
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
        [HasPermission(Permissions.PropertyAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 201)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult AddProject(ProjectModel model)
        {
            var project = _pimsService.Project.Add(_mapper.Map<Entity.Project>(model));
            return CreatedAtAction(nameof(GetProject), new { projectNumber = project.ProjectNumber }, _mapper.Map<ProjectModel>(project));
        }

        /// <summary>
        /// Update the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{projectNumber}")]
        [HasPermission(Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/update/{id})")]
        public IActionResult UpdateProject(string projectNumber, ProjectModel model)
        {
            var project = _pimsService.Project.Update(_mapper.Map<Entity.Project>(model));
            return new JsonResult(_mapper.Map<ProjectModel>(project));
        }

        /// <summary>
        /// Delete the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{projectNumber}")]
        [HasPermission(Permissions.PropertyDelete)]
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
        #endregion
    }
}
