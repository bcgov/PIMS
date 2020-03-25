using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Models;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing my parcels.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("/api/parcels")]
    public class ParcelController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ParcelController> _logger;
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public ParcelController(ILogger<ParcelController> logger, IPimsService pimsService, IMapper mapper)
        {
            _logger = logger;
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get all the parcels filtered by the lat/lon coords.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        public IActionResult GetParcels(double? neLat = null, double? neLong = null, double? swLat = null, double? swLong = null)
        {
            if (neLat == null) throw new BadRequestException($"Query parameter {nameof(neLat)} required.");
            if (neLong == null) throw new BadRequestException($"Query parameter {nameof(neLong)} required.");
            if (swLat == null) throw new BadRequestException($"Query parameter {nameof(swLat)} required.");
            if (swLong == null) throw new BadRequestException($"Query parameter {nameof(swLong)} required.");

            var parcels = _pimsService.Parcel.GetNoTracking(neLat.Value, neLong.Value, swLat.Value, swLong.Value);
            return new JsonResult(_mapper.Map<Model.Parts.ParcelModel[]>(parcels));
        }

        /// <summary>
        /// Get all the parcels that satisfy the filter parameters.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        [HttpGet("filter")]
        [HasPermission(Permissions.PropertyView)]
        public IActionResult GetParcelsWithFilter()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetParcelsWithFilter(new ParcelFilter(query));
        }

        /// <summary>
        /// Get all the parcels that satisfy the filter parameters.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.PropertyView)]
        public IActionResult GetParcelsWithFilter([FromBody]ParcelFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");

            var parcels = _pimsService.Parcel.GetNoTracking(filter);
            return new JsonResult(_mapper.Map<Model.Parts.ParcelModel[]>(parcels));
        }

        /// <summary>
        /// Get the parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [HasPermission(Permissions.PropertyView)]
        public IActionResult GetParcel(int id)
        {
            var entity = _pimsService.Parcel.GetNoTracking(id);
            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Add a new parcel to the datasource for the current user.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [HasPermission(Permissions.PropertyAdd)]
        public IActionResult AddParcel([FromBody] ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);
            var userId = this.User.GetUserId();

            foreach (var building in model.Buildings)
            {
                // We only allow adding buildings at this point.  Can't include an existing one.
                var b_entity = _mapper.Map<Entity.Building>(building);
                b_entity.CreatedById = userId;
                entity.Buildings.Add(b_entity);
            }

            _pimsService.Parcel.Add(entity);
            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Update the specified parcel in the datasource if the user is allowed.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.PropertyEdit)]
        public IActionResult UpdateParcel([FromBody] ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            _pimsService.Parcel.Update(entity); // TODO: Update related properties (i.e. Address).
            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Delete the specified parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [HasPermission(Permissions.PropertyAdd)]
        public IActionResult DeleteParcel([FromBody] ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            _pimsService.Parcel.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
