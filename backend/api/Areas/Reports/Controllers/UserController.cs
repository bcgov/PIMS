using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Helpers.Constants;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Helpers.Reporting;
using Pims.Api.Policies;
using EModel = Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using System;

namespace Pims.Api.Areas.Reports.Controllers
{
    /// <summary>
    /// UserController class, provides endpoints for generating reports.
    /// </summary>
    [Authorize]
    [ApiController]
    [Area("reports")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/users")]
    [Route("[area]/users")]
    public class UserController : ControllerBase
    {
        #region Variables
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public UserController(IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        #region Export Users
        /// <summary>
        /// Exports users as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate expor -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.AdminUsers)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(typeof(Api.Models.PageModel<Models.User.UserModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "user", "report" })]
        public IActionResult ExportUsers(bool all = false)
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return ExportUsers(new EModel.UserFilter(query), all);
        }

        /// <summary>
        /// Exports users as CSV or Excel file.
        /// Include 'Accept' header to request the appropriate export -
        ///     ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="all"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.AdminUsers)]
        [Produces(ContentTypes.CONTENT_TYPE_CSV, ContentTypes.CONTENT_TYPE_EXCELX)]
        [ProducesResponseType(typeof(Api.Models.PageModel<Models.User.UserModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "user", "report" })]
        public IActionResult ExportUsers([FromBody] EModel.UserFilter filter, bool all = false)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            var accept = (string)this.Request.Headers["Accept"] ?? throw new BadRequestException($"HTTP request header 'Accept' is required.");

            if (accept != ContentTypes.CONTENT_TYPE_CSV && accept != ContentTypes.CONTENT_TYPE_EXCEL && accept != ContentTypes.CONTENT_TYPE_EXCELX)
                throw new BadRequestException($"Invalid HTTP request header 'Accept:{accept}'.");

            filter.Quantity = all ? _pimsAdminService.User.Count() : filter.Quantity;
            var page = _pimsAdminService.User.Get(filter);
            var report = _mapper.Map<Api.Models.PageModel<Models.User.UserModel>>(page);

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
