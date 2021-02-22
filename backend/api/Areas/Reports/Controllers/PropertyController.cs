using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
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
    /// PropertyController class, provides endpoints for generating reports.
    /// </summary>
    [Authorize]
    [ApiController]
    [Area("reports")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/properties")]
    [Route("[area]/properties")]
    public class PropertyController : ControllerBase
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
        public PropertyController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        #region Export Properties
        /// <summary>
        /// Exports properties as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate expor -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "property", "report" })]
        public IActionResult ExportProperties(bool all = false)
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return ExportProperties(new Property.Models.Search.PropertyFilterModel(query), all);
        }

        /// <summary>
        /// Exports properties as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate export -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "property", "report" })]
        public IActionResult ExportProperties([FromBody] Property.Models.Search.PropertyFilterModel filter, bool all = false)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");
            var accept = (string)this.Request.Headers["Accept"] ?? throw new BadRequestException($"HTTP request header 'Accept' is required.");

            if (accept != ContentTypes.CONTENT_TYPE_CSV && accept != ContentTypes.CONTENT_TYPE_EXCEL && accept != ContentTypes.CONTENT_TYPE_EXCELX)
                throw new BadRequestException($"Invalid HTTP request header 'Accept:{accept}'.");

            filter.Quantity = all ? _pimsService.Property.Count() : filter.Quantity;
            var page = _pimsService.Property.GetPage((AllPropertyFilter)filter);
            var report = _mapper.Map<Api.Models.PageModel<Models.Property.PropertyModel>>(page);

            return accept.ToString() switch
            {
                ContentTypes.CONTENT_TYPE_CSV => ReportHelper.GenerateCsv(report.Items),
                _ => ReportHelper.GenerateExcel(report.Items, "PIMS")
            };

        }

        #region Return All Properties
        /// <summary>
        /// Exports properties with all fields as an Excel file, only available for SRES
        /// Include 'Accept' header to request the appropriate export
        /// </summary>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpGet("all/fields")]
        [HasPermission(Permissions.AdminProperties)]
        [Produces(ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "property", "report" })]
        public IActionResult ExportPropertiesAllFields(bool all = false)
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return ExportPropertiesAllFields(new Property.Models.Search.PropertyFilterModel(query), all);
        }

        /// <summary>
        /// Exports properties as Excel file. Has more fields than default export.
        /// Only available for SRES
        /// Include 'Accept' header to request the appropriate expor
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpPost("all/fields/filter")]
        [HasPermission(Permissions.AdminProperties)]
        [Produces(ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(200)]
        [SwaggerOperation(Tags = new[] { "property", "report" })]
        public IActionResult ExportPropertiesAllFields([FromBody] Property.Models.Search.PropertyFilterModel filter, bool all = true)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");
            var accept = (string)this.Request.Headers["Accept"] ?? throw new BadRequestException($"HTTP request header 'Accept' is required.");

            if (accept != ContentTypes.CONTENT_TYPE_EXCEL && accept != ContentTypes.CONTENT_TYPE_EXCELX)
                throw new BadRequestException($"Invalid HTTP request header 'Accept:{accept}'.");

            filter.Quantity = all ? _pimsService.Property.Count() : filter.Quantity;
            var page = _pimsService.Property.GetPage((AllPropertyFilter)filter);
            var report = _mapper.Map<Api.Models.PageModel<Models.AllPropertyFields.AllFieldsPropertyModel>>(page);

            return ReportHelper.GenerateExcel(report.Items, "PIMS");
        }
        #endregion
        #endregion
        #endregion
    }
}
