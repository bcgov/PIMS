using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Models;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using Swashbuckle.AspNetCore.Annotations;
using Pims.Api.Helpers.Exceptions;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing my parcels.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/parcels")]
    [Route("parcels")]
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
        /// Get all the parcels that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.Parts.ParcelModel>), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult GetParcels()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetParcels(new ParcelFilter(query));
        }

        /// <summary>
        /// Get all the parcels that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.Parts.ParcelModel>), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult GetParcels([FromBody]ParcelFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.ValidFilter()) throw new BadRequestException("Property filter must contain valid values.");

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
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult GetParcel(int id)
        {
            var entity = _pimsService.Parcel.GetNoTracking(id);
            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return new JsonResult(parcel);
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
            var userId = this.User.GetUserId();

            _pimsService.Parcel.Add(entity);
            var parcel = _mapper.Map<Model.ParcelModel>(entity);
            return new CreatedAtActionResult(nameof(GetParcel), nameof(ParcelController), new { id = parcel.Id }, parcel);
        }

        /// <summary>
        /// Update the specified parcel in the datasource if the user is allowed.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult UpdateParcel([FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            _pimsService.Parcel.Update(entity); // TODO: Update related properties (i.e. Address).
            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Delete the specified parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [HasPermission(Permissions.PropertyAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [SwaggerOperation(Tags = new[] { "parcel" })]
        public IActionResult DeleteParcel(Guid id, [FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            _pimsService.Parcel.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
