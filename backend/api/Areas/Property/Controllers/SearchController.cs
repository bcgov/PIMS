using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Areas.Property.Models.Search;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Policies;
using Pims.Core.Extensions;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using BModel = Pims.Api.Models;

namespace Pims.Api.Areas.Property.Controllers
{
    /// <summary>
    /// SearchController class, provides endpoints for searching properties.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("properties")]
    [Route("v{version:apiVersion}/[area]/search")]
    [Route("[area]/search")]
    public class SearchController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a SearchController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        ///
        public SearchController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        #region Landing Page Endpoints
        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Models.Search.PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetProperties()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetProperties(new PropertyFilterModel(query));
        }

        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Models.Search.PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetProperties([FromBody] PropertyFilterModel filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var properties = _pimsService.Property.Get((AllPropertyFilter)filter).ToArray();
            return new JsonResult(_mapper.Map<Models.Search.PropertyModel[]>(properties).ToArray());
        }
        #endregion

        /// <summary>
        /// Get all the property names that satisfy the filter paramaters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpGet("names")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Models.Search.PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetPropertyNames([FromQuery] PropertyFilterModel filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var propertyNames = _pimsService.Property.GetNames((AllPropertyFilter)filter);
            return new JsonResult(propertyNames);
        }

        #region GeoJSON
        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet("wfs")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<GeoJson<Models.Search.PropertyModel>>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetGeoJson()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetGeoJson(new GeoJsonFilterModel(query));
        }

        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("wfs/filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<GeoJson<Models.Search.PropertyModel>>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetGeoJson([FromBody] GeoJsonFilterModel filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var pfilter = filter.CopyValues(new AllPropertyFilter(filter.Boundary));
            pfilter.PropertyType = filter.PropertyType;

            var properties = _pimsService.Property.Search(pfilter).ToArray();
            var results = _mapper.Map<GeoJson<Models.Search.PropertyModel>[]>(properties).ToArray();
            return new JsonResult(results);
        }

        #endregion

        #region Property Paging Endpoints
        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet("page")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(BModel.PageModel<Models.Search.PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetPropertiesPage()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetPropertiesPage(new PropertyFilterModel(query));
        }

        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("page/filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(BModel.PageModel<Models.Search.PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetPropertiesPage([FromBody] PropertyFilterModel filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var page = _pimsService.Property.GetPage((AllPropertyFilter)filter);
            var result = _mapper.Map<BModel.PageModel<Models.Search.PropertyModel>>(page);
            return new JsonResult(result);
        }
        #endregion
        #endregion
    }
}
