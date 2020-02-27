using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Pims.Dal.Services;
using AutoMapper;
using Pims.Dal.Helpers.Extensions;
using Model = Pims.Api.Models;
using Entities = Pims.Dal.Entities;
using Pims.Api.Models;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing my parcels.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("/api/my/[controller]")]
    public class ParcelController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ParcelController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IParcelService _parcelService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="parcelService"></param>
        /// <param name="mapper"></param>
        public ParcelController(ILogger<ParcelController> logger, IConfiguration configuration, IParcelService parcelService, IMapper mapper)
        {
            _logger = logger;
            _configuration = configuration;
            _parcelService = parcelService;
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
        public IActionResult GetMyParcels(double neLat, double neLong, double swLat, double swLong, int? agencyId = null, int? propertyClassificationId = null)
        {
            var parcels = _parcelService.GetParcels(neLat, neLong, swLat, swLong, agencyId, propertyClassificationId);
            return new JsonResult(_mapper.Map<Model.Parts.ParcelModel[]>(parcels));
        }

        /// <summary>
        /// Get the parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public IActionResult GetMyParcel(int id)
        {
            var entity = _parcelService.GetParcel(id);

            if (entity == null) return NoContent();

            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Add a new parcel to the datasource for the current user.
        /// /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "property-add")]
        public IActionResult AddMyParcel([FromBody] ParcelModel model)
        {
            var entity = _mapper.Map<Entities.Parcel>(model);
            var userId = this.User.GetUserId();

            foreach (var building in model.Buildings)
            {
                // We only allow adding buildings at this point.  Can't include an existing one.
                var b_entity = _mapper.Map<Entities.Building>(building);
                b_entity.CreatedById = userId;
                entity.Buildings.Add(b_entity);
            }

            _parcelService.AddMyParcel(entity);
            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Update the specified parcel in the datasource if the user is allowed.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "property-edit")]
        public IActionResult UpdateMyParcel([FromBody] ParcelModel model)
        {
            var entity = _parcelService.GetParcel(model.Id);

            if (entity == null) return BadRequest("Item does not exist");
            var userId = this.User.GetUserId();
            var address = entity.Address?.ToString();

            _mapper.Map(model, entity);
            entity.UpdatedById = userId;
            entity.UpdatedOn = DateTime.UtcNow;

            //TODO: rewrite the update controller to properly handle entities related to parcel.

            _parcelService.UpdateMyParcel(entity);
            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// Delete the specified parcel from the datasource if the user is allowed.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "property-add")]
        public IActionResult DeleteMyParcels(ParcelModel model)
        {
            var entityToDelete = _mapper.Map<Entities.Parcel>(model);

            var entity = _parcelService.DeleteMyParcel(entityToDelete);

            if (entity == null) return BadRequest("Item does not exist");

            return new JsonResult(model);
        }
        #endregion

        #region Methods
        #endregion
    }
}
