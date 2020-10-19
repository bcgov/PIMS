using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Pims.Api.Areas.Project.Models.Dispose;
using Pims.Api.Areas.Project.Models.Snapshot;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Core.Exceptions;
using Pims.Core.Extensions;
using Pims.Dal;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
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
    /// SnapshotController class, provides endpoints for managing project snapshots.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("projects")]
    [Route("v{version:apiVersion}/[area]/snapshots")]
    [Route("[area]/snapshots")]
    public class SnapshotController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a SnapshotController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public SnapshotController(IOptionsMonitor<PimsOptions> options, IPimsService pimsService, IMapper mapper)
        {
            _options = options.CurrentValue;
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get the project snapshot for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        [HasPermission(Permissions.AdminProjects)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectSnapshotModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetProjectSnapshot(int id)
        {
            var snapshot = _pimsService.ProjectSnapshot.Get(id);
            return new JsonResult(_mapper.Map<ProjectSnapshotModel>(snapshot));
        }

        /// <summary>
        /// Add the project snapshot to the datasource.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [HasPermission(Permissions.AdminProjects)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectSnapshotModel), 201)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult AddProjectSnapshot(ProjectSnapshotModel model)
        {
            var snapshot = _pimsService.ProjectSnapshot.Add(_mapper.Map<Entity.ProjectSnapshot>(model));
            return new JsonResult(_mapper.Map<ProjectSnapshotModel>(snapshot));
        }

        /// <summary>
        /// Update the project snapshot metadata in the datasource.
        /// </summary>
        /// <param name="model"></param>
        /// /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.AdminProjects)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectSnapshotModel), 201)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult UpdateProjectSnapshot(int id, ProjectSnapshotModel model)
        {
            var snapshot = _pimsService.ProjectSnapshot.Update(_mapper.Map<Entity.ProjectSnapshot>(model));
            return new JsonResult(_mapper.Map<ProjectSnapshotModel>(snapshot));
        }

        /// <summary>
        /// Refresh the project snapshot in the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("refresh/{id}")]
        [HasPermission(Permissions.AdminProjects)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectSnapshotModel), 201)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult RefreshProjectSnapshot(int id)
        {
            var snapshot = _pimsService.ProjectSnapshot.Refresh(id);
            return new JsonResult(_mapper.Map<ProjectSnapshotModel>(snapshot));
        }

        /// <summary>
        /// Delete the project snapshot for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [HasPermission(Permissions.AdminProjects)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/{id})")]
        public IActionResult DeleteProjectSnapshot(int id, ProjectSnapshotModel model)
        {
            _pimsService.ProjectSnapshot.Remove(_mapper.Map<Entity.ProjectSnapshot>(model));
            return new JsonResult(model);
        }

        #endregion
    }
}
