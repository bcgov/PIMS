using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Areas.Project.Models.Status;
using Pims.Api.Models;
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
        /// Get an array of all project status.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.ProjectView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<ProjectStatusModel>), 200)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetStatus()
        {
            var status = _pimsService.ProjectStatus.Get();
            return new JsonResult(_mapper.Map<ProjectStatusModel[]>(status));
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
