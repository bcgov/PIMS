using System.Collections.Generic;
using System.Linq;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Pims.Api.Areas.Project.Models.Report;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Controllers
{
    /// <summary>
    /// ReportController class, provides endpoints for managing project reports.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("projects")]
    [Route("v{version:apiVersion}/[area]/reports")]
    [Route("[area]/reports")]
    public class ReportController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ReportController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public ReportController(IOptionsMonitor<PimsOptions> options, IPimsService pimsService, IMapper mapper)
        {
            _options = options.CurrentValue;
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get the project report for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectReportModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetProjectReport(int id)
        {
            var report = _pimsService.ProjectReport.Get(id);
            return new JsonResult(_mapper.Map<ProjectReportModel>(report));
        }

        /// <summary>
        /// Get all of the project reports.
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectReportModel[]), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetProjectReports()
        {
            var report = _pimsService.ProjectReport.GetAll();
            return new JsonResult(_mapper.Map<ProjectReportModel[]>(report));
        }

        /// <summary>
        /// Get all of the project snapshots for the specified report id.
        /// If snapshots to not exist for the for the 'To' date in the passed report they will be generated.
        /// By passing a 'From' date different than the report saved in the DB, the variances will be calculated against the passed 'From' date.
        /// </summary>
        /// <returns></returns>
        [HttpPost("snapshots/{reportId:int}")]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectSnapshotModel[]), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Parameter to satisfy URL pattern.")]
        public IActionResult GetProjectReportSnapshots(int reportId, ProjectReportModel model)
        {
            var snapshots = _pimsService.ProjectReport.GetSnapshots(_mapper.Map<Entity.ProjectReport>(model));
            return new JsonResult(_mapper.Map<ProjectSnapshotModel[]>(snapshots));
        }

        /// <summary>
        /// Get all of the project snapshots for the specified report id.
        /// </summary>
        /// <returns></returns>
        [HttpGet("snapshots/{reportId:int}")]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectSnapshotModel[]), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GetProjectReportSnapshots(int reportId)
        {
            var snapshots = _pimsService.ProjectReport.GetSnapshots(reportId);
            return new JsonResult(_mapper.Map<ProjectSnapshotModel[]>(snapshots));
        }

        /// <summary>
        /// Add the project report to the datasource.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectReportModel), 201)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult AddProjectReport(ProjectReportModel model)
        {
            Entity.ProjectReport report;

            if (model.Snapshots?.Any() == true)
            {
                report = _pimsService.ProjectReport.Add(_mapper.Map<Entity.ProjectReport>(model), _mapper.Map<IEnumerable<Entity.ProjectSnapshot>>(model.Snapshots));
            }
            else
            {
                report = _pimsService.ProjectReport.Add(_mapper.Map<Entity.ProjectReport>(model));
            }
            return CreatedAtAction(nameof(GetProjectReport), new { id = report.Id }, _mapper.Map<ProjectReportModel>(report));
        }

        /// <summary>
        /// Update the project report metadata in the datasource.
        /// </summary>
        /// <param name="model"></param>
        /// /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectReportModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Parameter to satisfy URL pattern.")]
        public IActionResult UpdateProjectReport(int id, ProjectReportModel model)
        {
            var report = _pimsService.ProjectReport.Update(_mapper.Map<Entity.ProjectReport>(model));
            return new JsonResult(_mapper.Map<ProjectReportModel>(report));
        }

        /// <summary>
        /// Get a refreshed list of project snapshots based on the current data in the database.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("refresh/{id}")]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectSnapshotModel[]), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        public IActionResult GenerateProjectSnapshots(int id)
        {
            var snapshots = _pimsService.ProjectReport.Refresh(id);
            return new JsonResult(_mapper.Map<ProjectSnapshotModel[]>(snapshots));
        }

        /// <summary>
        /// Delete the project report for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProjectReportModel), 200)]
        [ProducesResponseType(typeof(ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "project" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/{id})")]
        public IActionResult DeleteProjectReport(int id, ProjectReportModel model)
        {
            _pimsService.ProjectReport.Remove(_mapper.Map<Entity.ProjectReport>(model));
            return new JsonResult(model);
        }

        #endregion
    }
}
