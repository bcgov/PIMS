using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Models;
using Pims.Api.Areas.Property.Models.Search;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;

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
        [ProducesResponseType(typeof(IEnumerable<PropertyModel>), 200)]
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
        [ProducesResponseType(typeof(IEnumerable<PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetProperties([FromBody]PropertyFilterModel filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var properties = new List<PropertyModel>();
            var includeBoth = !filter.IncludeParcels && !filter.IncludeBuildings; // When a base filter is provided we make a request to both parcels and buildings.
            if (includeBoth || filter.IncludeParcels)
                properties.AddRange(_mapper.Map<PropertyModel[]>(_pimsService.Parcel.Get((ParcelFilter)filter)));
            if (includeBoth || filter.IncludeBuildings)
                properties.AddRange(_mapper.Map<PropertyModel[]>(_pimsService.Building.Get((BuildingFilter)filter)));
            return new JsonResult(properties.ToArray());
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
        [ProducesResponseType(typeof(PageModel<PropertyModel>), 200)]
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
        [ProducesResponseType(typeof(PageModel<PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "property" })]
        public IActionResult GetPropertiesPage([FromBody]PropertyFilterModel filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var page = _pimsService.Property.GetPage((AllPropertyFilter)filter);
            var result = _mapper.Map<PageModel<PropertyModel>>(page);
            return new JsonResult(result);
        }
        #endregion
        #endregion
    }
}
