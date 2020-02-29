using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Entity = Pims.Dal.Entities;
using System.Collections.Generic;
using Pims.Api.Areas.Tools.Models;
using Pims.Api.Models;
using Pims.Dal.Services.Admin;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// ImportController class, provides endpoints for managing parcels.
    /// </summary>
    // [Authorize (Roles = "administrator")]
    [ApiController]
    [Area("admin")]
    [Route("/api/[area]/[controller]")]
    public class ImportController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ImportController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public ImportController(ILogger<ImportController> logger, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// POST - Add an array of new properties to the datasource.
        /// </summary>
        /// <param name="models">An array of property models.</param>
        /// <returns>The properties added.</returns>
        [HttpPost("/api/[area]/properties")]
        public IActionResult ImportProperties([FromBody] PropertyModel[] models)
        {
            // TODO: Finish endpoint.
            // Preload lookup lists.
            // var property_status = _pimsAdminService.PropertyStatus.Get();
            // var cities = _pimsAdminService.City.Get();
            // var provinces = _pimsAdminService.Province.Get();
            // var property_classification = _pimsAdminService.City.Get();

            var entities = new List<Entity.Parcel>();
            foreach (var property in models)
            {
                var valid_pid = int.TryParse(property.ParcelId?.Replace("-", ""), out int pid);
                if (!valid_pid) continue;

                if (String.Compare(property.PropertyType, "Land") == 0)
                {
                    var p_e = _pimsAdminService.Parcel.GetByPid(pid) ?? new Entity.Parcel();
                    entities.Add(p_e);

                    // Copy properties over to entity.
                    p_e.ParcelId = pid;
                    p_e.Description = property.Description;
                    p_e.Latitude = property.Latitude;
                    p_e.Longitude = property.Longitude;
                    p_e.LandArea = property.LandArea;
                    p_e.LandLegalDescription = property.LandLegalDescription;

                    // A new parcel.
                    if (p_e.Id == 0)
                    {
                        _pimsAdminService.Parcel.Add(p_e);
                    }
                    else
                    {
                        _pimsAdminService.Parcel.Update(p_e);
                    }
                }
                else if (String.Compare(property.PropertyType, "Building") == 0)
                {
                    var lid = property.LocalId;
                    var b_e = _pimsAdminService.Building.GetByLocalId(lid) ?? new Entity.Building();

                    // Copy properties over to entity.
                    b_e.ParcelId = pid;
                    b_e.LocalId = property.LocalId;
                    b_e.Description = property.Description;
                    b_e.Latitude = property.Latitude;
                    b_e.Longitude = property.Longitude;
                    b_e.BuildingFloorCount = property.BuildingFloorCount;

                    // A new building.
                    if (b_e.Id == 0)
                    {
                        _pimsAdminService.Building.Add(b_e);
                    }
                    else
                    {
                        _pimsAdminService.Building.Update(b_e);
                    }
                }
            }

            var parcels = _mapper.Map<ParcelModel[]>(entities);

            return new JsonResult(parcels);
        }
        #endregion
    }
}
