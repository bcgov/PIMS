using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Dal;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Services;
using Microsoft.EntityFrameworkCore;
using Entity = Pims.Dal.Entities;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing parcels.
    /// </summary>
    // [Authorize (Roles = "administrator")]
    [ApiController]
    [Area("admin")]
    [Route("/api/[area]/[controller]")]
    public class ParcelController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ParcelController> _logger;
        private readonly IAdminParcelService _adminParcelService;
        private readonly IMapper _mapper;
        private readonly PIMSContext _dbContext;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="adminParcelService"></param>
        /// <param name="dbContext"></param>
        /// <param name="mapper"></param>
        public ParcelController(ILogger<ParcelController> logger, IAdminParcelService adminParcelService, PIMSContext dbContext, IMapper mapper)
        {
            _logger = logger;
            _adminParcelService = adminParcelService;
            _mapper = mapper;
            _dbContext = dbContext;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// GET - Returns a paged array of parcels from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns>Paged object with an array of parcels.</returns>
        [HttpGet("/api/[area]/parcels")]
        public IActionResult GetParcels(int page = 1, int quantity = 10, string sort = null) // TODO: sort and filter.
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 50) quantity = 50;

            var entities = _adminParcelService.GetParcels(page, quantity, sort);
            var total = entities.Count();
            var parcels = _mapper.Map<Api.Models.Parts.ParcelModel[]>(entities);
            var paged = new Pims.Api.Models.Paged<Api.Models.Parts.ParcelModel>(parcels, page, quantity, total);

            return new JsonResult(paged);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("{id:int}")]
        public IActionResult GetParcel(int id)
        {
            var entity = _adminParcelService.GetParcel(id);

            if (entity == null) return NoContent();

            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="pid">The unique 'PID' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("pid/{pid:int}")]
        public IActionResult GetParcelByPID(int pid)
        {
            var entity = GetParcelByPID(pid);

            if (entity == null) return NoContent();

            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="pid">The unique 'PID' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("pid/{pid}")]
        public IActionResult GetParcelByPID(string pid)
        {
            if (!int.TryParse(pid.Replace("-", ""), out int id))
                return BadRequest("PID is invalid");

            var entity = _adminParcelService.GetParcelByPid(id);

            if (entity == null) return NoContent();

            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// POST - Add a new parcel to the datasource.
        /// </summary>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel added.</returns>
        [HttpPost]
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

            _adminParcelService.AddParcel(entity);
            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// POST - Add an array of new parcels to the datasource.
        /// </summary>
        /// <param name="models">An array of parcel models.</param>
        /// <returns>The parcels added.</returns>
        [HttpPost("/api/[area]/parcels")]
        public IActionResult AddParcels([FromBody] ParcelModel[] models)
        {
            var entities = _mapper.Map<Entity.Parcel[]>(models);
            var userId = this.User.GetUserId();

            for (var i = 0; i < models.Count(); i++)
            {
                var entity = entities[i];
                entity.CreatedById = userId;

                foreach (var building in models[i].Buildings)
                {
                    // We only allow adding buildings at this point.  Can't include an existing one.
                    var b_entity = _mapper.Map<Entity.Building>(building);
                    b_entity.CreatedById = userId;
                    entity.Buildings.Add(b_entity);
                }
            }
            _adminParcelService.AddParcels(entities);
            var parcels = _mapper.Map<ParcelModel[]>(entities);

            return new JsonResult(parcels);
        }

        /// <summary>
        /// PUT - Update the parcel in the datasource.
        /// </summary>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel updated.</returns>
        [HttpPut]
        public IActionResult UpdateParcel([FromBody] ParcelModel model)
        {
            var entity = _dbContext.Parcels
                .Include(p => p.Address)
                .Include(p => p.Buildings)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.City)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingPredominateUse)
                .SingleOrDefault(p => p.Id == model.Id);

            if (entity == null) return BadRequest("Item does not exist");
            var userId = this.User.GetUserId();
            var address = entity.Address?.ToString();

            _mapper.Map(model, entity);

            foreach (var building in model.Buildings)
            {
                if (building.Id == 0)
                {
                    // Add a new building to the parcel.
                    var b_entity = _mapper.Map<Entity.Building>(building);
                    b_entity.CreatedById = userId;
                    entity.Buildings.Add(b_entity);
                }
                else
                {
                    // Update existing building on the parcel.
                    var b_entity = entity.Buildings.FirstOrDefault(b => b.Id == building.Id);

                    // We will ignore building Ids that don't match.
                    if (b_entity != null)
                    {
                        var b_address = b_entity.Address?.ToString();
                        _mapper.Map(building, b_entity);
                        b_entity.UpdatedById = userId;
                        b_entity.UpdatedOn = DateTime.UtcNow;
                        _dbContext.Buildings.Update(b_entity);

                        // Check if the address was updated.
                        if (b_address != b_entity.Address.ToString())
                        {
                            b_entity.Address.UpdatedById = userId;
                            b_entity.Address.UpdatedOn = DateTime.UtcNow;
                            _dbContext.Addresses.Update(b_entity.Address);
                        }
                    }
                    else
                    {
                        _logger.LogDebug($"Invalid - Attempting to update parcel with invalid building - PID:{entity.PID}, BuildingId:{building.Id}");
                    }
                }
            }

            // Check if the address was updated.
            if (address != entity.Address.ToString())
            {
                entity.Address.UpdatedById = userId;
                entity.Address.UpdatedOn = DateTime.UtcNow;
                _dbContext.Addresses.Update(entity.Address);
            }
            _adminParcelService.UpdateParcel(entity);
            var parcel = _mapper.Map<ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// DELETE - Delete the parcel from the datasource.
        /// </summary>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel who was deleted.</returns>
        [HttpDelete]
        public IActionResult DeleteParcel([FromBody] ParcelModel model)
        {
            var entityToDelete = _mapper.Map<Entity.Parcel>(model);

            if (model.RowVersion == null) return BadRequest("Item does not exist");
            var entity = _adminParcelService.DeleteParcel(entityToDelete);

            if (entity == null) return BadRequest("Item does not exist");

            return new JsonResult(model);
        }
        #endregion
    }
}
