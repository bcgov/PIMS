using System;
using System.Collections.Generic;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Parcel;
using Microsoft.AspNetCore.Http.Extensions;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Helpers.Exceptions;
using EModel = Pims.Dal.Entities.Models;
using System.Linq;

namespace Pims.Api.Areas.Property.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing my parcels.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("properties")]
    [Route("v{version:apiVersion}/[area]/parcels")]
    [Route("[area]/parcels")]
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
        /// Get the parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult GetParcel(int id)
        {
            var entity = _pimsService.Parcel.Get(id);
            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.ParcelModel>), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult GetParcels()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetParcels(new EModel.ParcelFilter(query));
        }

        /// <summary>
        /// Get all the properties that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.PropertyModel>), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult GetParcels([FromBody] EModel.ParcelFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Parcel filter must contain valid values.");

            var parcels = _pimsService.Parcel.Get((EModel.ParcelFilter)filter).ToArray();
            return new JsonResult(_mapper.Map<Model.ParcelModel[]>(parcels).ToArray());
        }

        /// <summary>
        /// Check if PID is available
        /// </summary>
        /// <returns></returns>
        [HttpGet("check/pid-available")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.CheckPidAvailabilityResponseModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult IsPidAvailable(int parcelId, int pid)
        {
            var result = new Model.CheckPidAvailabilityResponseModel
            { Available = _pimsService.Parcel.IsPidAvailable(parcelId, pid) };
            return new JsonResult(result);
        }

        /// <summary>
        /// Check if PIN is available
        /// </summary>
        /// <returns></returns>
        [HttpGet("check/pin-available")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.CheckPidAvailabilityResponseModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult IsPinAvailable(int parcelId, int pin)
        {
            var result = new Model.CheckPidAvailabilityResponseModel
            { Available = _pimsService.Parcel.IsPinAvailable(parcelId, pin) };
            return new JsonResult(result);
        }

        /// <summary>
        /// Add a new parcel to the datasource for the current user.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [HasPermission(Permissions.PropertyAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult AddParcel([FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            _pimsService.Parcel.Add(entity);
            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return CreatedAtAction(nameof(GetParcel), new { id = parcel.Id }, parcel);
        }

        /// <summary>
        /// Update the specified parcel in the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/update/{id})")]
        public IActionResult UpdateParcel(int id, [FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            var parcel = _pimsService.Parcel.Update(entity);
            return new JsonResult(_mapper.Map<Model.ParcelModel>(parcel));
        }

        /// <summary>
        /// Update the specified parcel financials values in the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id}/financials")]
        [HasPermission(Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/update/{id})")]
        public IActionResult UpdateParcelFinancials(int id, [FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            var parcel = _pimsService.Parcel.UpdateFinancials(entity);
            return new JsonResult(_mapper.Map<Model.ParcelModel>(parcel));
        }

        /// <summary>
        /// Delete the specified parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [HasPermission(Permissions.PropertyDelete, Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/delete/{id})")]
        public IActionResult DeleteParcel(int id, [FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            _pimsService.Parcel.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
