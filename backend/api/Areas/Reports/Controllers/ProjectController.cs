using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Areas.Reports.Models.Project;
using Pims.Api.Helpers.Constants;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Helpers.Reporting;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;

namespace Pims.Api.Areas.Reports.Controllers
{
    /// <summary>
    /// ProjectController class, provides endpoints for generating reports.
    /// </summary>
    [Authorize]
    [ApiController]
    [Area("reports")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/projects")]
    [Route("[area]/projects")]
    public class ProjectController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ReportController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public ProjectController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        #region Export Properties
        /// <summary>
        /// Exports projects as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate expor -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.ReportsView)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "project", "report" })]
        public IActionResult ExportProjects(bool all = false)
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return ExportProjects(new ProjectFilter(query), all);
        }

        /// <summary>
        /// Exports projects as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate expor -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.ReportsView)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "project", "report" })]
        public IActionResult ExportProjects([FromBody] ProjectFilter filter, bool all = false)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Project filter must contain valid values.");
            var accept = (string)this.Request.Headers["Accept"] ?? throw new BadRequestException($"HTTP request header 'Accept' is required.");

            if (accept != ContentTypes.CONTENT_TYPE_CSV && accept != ContentTypes.CONTENT_TYPE_EXCEL && accept != ContentTypes.CONTENT_TYPE_EXCELX)
                throw new BadRequestException($"Invalid HTTP request header 'Accept:{accept}'.");

            filter.Quantity = all ? _pimsService.Project.Count() : filter.Quantity;
            var page = _pimsService.Project.GetPage(filter);
            var report = _mapper.Map<Api.Models.PageModel<ProjectModel>>(page);

            return accept.ToString() switch
            {
                ContentTypes.CONTENT_TYPE_CSV => ReportHelper.GenerateCsv(report.Items),
                _ => ReportHelper.GenerateExcel(report.Items, "PIMS")
            };
        }
        #endregion

        #region Surplus Property List
        /// <summary>
        /// Exports projects as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate expor -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <returns></returns>
        [HttpGet("surplus/properties/list")]
        [HasPermission(Permissions.ReportsView)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "project", "report" })]
        public IActionResult SurplusPropertyList()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return SurplusPropertyList(new ProjectFilter(query));
        }

        /// <summary>
        /// Exports projects as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate expor -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("surplus/properties/list/filter")]
        [HasPermission(Permissions.ReportsSpl)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "project", "report" })]
        public IActionResult SurplusPropertyList([FromBody] ProjectFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Project filter must contain valid values.");
            var accept = (string)this.Request.Headers["Accept"] ?? throw new BadRequestException($"HTTP request header 'Accept' is required.");

            if (accept != ContentTypes.CONTENT_TYPE_CSV && accept != ContentTypes.CONTENT_TYPE_EXCEL && accept != ContentTypes.CONTENT_TYPE_EXCELX)
                throw new BadRequestException($"Invalid HTTP request header 'Accept:{accept}'.");

            filter.SPLWorkflow = true;
            filter.Quantity = _pimsService.Project.Count();
            var page = _pimsService.Project.GetPage(filter);
            var report = _mapper.Map<Api.Models.PageModel<SurplusPropertyListModel>>(page);

            return accept.ToString() switch
            {
                ContentTypes.CONTENT_TYPE_CSV => ReportHelper.GenerateCsv(report.Items),
                _ => ReportHelper.GenerateExcel(report.Items, "PIMS")
            };
        }
        #endregion
        #endregion
    }
}
