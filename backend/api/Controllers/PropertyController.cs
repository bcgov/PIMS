using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Models.Property;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// PropertyController class, provides endpoints for searching properties.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("/api/properties")]
    public class PropertyController : ControllerBase
    {
        #region Variables
        private readonly ILogger<PropertyController> _logger;
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public PropertyController(ILogger<PropertyController> logger, IPimsService pimsService, IMapper mapper)
        {
            _logger = logger;
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get all the properties that satisfy the latitude and longitude parameters.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        public IActionResult GetProperties(double? neLat = null, double? neLong = null, double? swLat = null, double? swLong = null)
        {
            if (neLat == null) throw new BadRequestException($"Query parameter {nameof(neLat)} required.");
            if (neLong == null) throw new BadRequestException($"Query parameter {nameof(neLong)} required.");
            if (swLat == null) throw new BadRequestException($"Query parameter {nameof(swLat)} required.");
            if (swLong == null) throw new BadRequestException($"Query parameter {nameof(swLong)} required.");

            var properties = new List<PropertyModel>(_mapper.Map<PropertyModel[]>(_pimsService.Parcel.GetNoTracking(neLat.Value, neLong.Value, swLat.Value, swLong.Value)));
            properties.AddRange(_mapper.Map<PropertyModel[]>(_pimsService.Building.GetNoTracking(neLat.Value, neLong.Value, swLat.Value, swLong.Value)));
            return new JsonResult(properties.ToArray());
        }

        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        [HttpGet("filter")]
        [HasPermission(Permissions.PropertyView)]
        public IActionResult GetPropertiesWithFilter()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetPropertiesWithFilter(new PropertyFilterModel(query));
        }

        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.PropertyView)]
        public IActionResult GetPropertiesWithFilter([FromBody]PropertyFilterModel filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.ValidFilter()) throw new BadRequestException("Property filter must contain valid values.");

            var properties = new List<PropertyModel>();
            if (filter.IncludeParcels)
                properties.AddRange(_mapper.Map<PropertyModel[]>(_pimsService.Parcel.GetNoTracking((ParcelFilter)filter)));
            if (filter.IncludeBuildings)
                properties.AddRange(_mapper.Map<PropertyModel[]>(_pimsService.Building.GetNoTracking((BuildingFilter)filter)));
            return new JsonResult(properties.ToArray());
        }
        #endregion
    }
}
