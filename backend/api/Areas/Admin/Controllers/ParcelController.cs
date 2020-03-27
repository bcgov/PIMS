using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Dal.Helpers.Extensions;
using Entity = Pims.Dal.Entities;
using Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing parcels.
    /// </summary>
    [HasPermission(Permissions.SystemAdmin)]
    [ApiController]
    [Area("admin")]
    [Route("/api/[area]/[controller]")]
    public class ParcelController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ParcelController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public ParcelController(ILogger<ParcelController> logger, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
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

            var result = _pimsAdminService.Parcel.GetNoTracking(page, quantity, sort);
            var entities = _mapper.Map<Api.Models.Parts.ParcelModel[]>(result.Items);
            var paged = new Pims.Dal.Entities.Models.Paged<Api.Models.Parts.ParcelModel>(entities, page, quantity, result.Total);

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
            var entity = _pimsAdminService.Parcel.GetNoTracking(id);

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
        public IActionResult GetParcelByPid(int pid)
        {
            var entity = GetParcelByPid(pid);

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
        public IActionResult GetParcelByPid(string pid)
        {
            if (!int.TryParse(pid.Replace("-", ""), out int id))
                return BadRequest("PID is invalid");

            var entity = _pimsAdminService.Parcel.GetByPidNoTracking(id);

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

            _pimsAdminService.Parcel.Add(entity);
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
            _pimsAdminService.Parcel.Add(entities);
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
            var entity = _pimsAdminService.Parcel.Get(model.Id);

            if (entity == null) return BadRequest("Item does not exist");
            var userId = this.User.GetUserId();
            var address = entity.Address?.ToString();

            _mapper.Map(model, entity);

            foreach (var evaluation in model.Evaluations)
            {
                // Update evaluation.
                var p_eval = entity.Evaluations.FirstOrDefault(e => e.FiscalYear == evaluation.FiscalYear);
                if (p_eval == null)
                {
                    entity.Evaluations.Add(new Entity.ParcelEvaluation(evaluation.FiscalYear, entity) // TODO: Move this logic to AutoMapper.
                    {
                        EstimatedValue = evaluation.EstimatedValue,
                        AssessedValue = evaluation.AssessedValue,
                        NetBookValue = evaluation.NetBookValue,
                        CreatedById = userId
                    });
                }
                else
                {
                    p_eval.EstimatedValue = evaluation.EstimatedValue;
                    p_eval.AssessedValue = evaluation.AssessedValue;
                    p_eval.NetBookValue = evaluation.NetBookValue;
                    p_eval.UpdatedById = userId; // TODO: Move to DAL.
                    p_eval.UpdatedOn = DateTime.UtcNow;
                }
            }

            foreach (var building in model.Buildings)
            {
                if (building.Id == 0)
                {
                    // Add a new building to the parcel.
                    var b_entity = _mapper.Map<Entity.Building>(building);
                    b_entity.CreatedById = userId;
                    foreach (var evaluation in building.Evaluations)
                    {
                        b_entity.Evaluations.Add(new Entity.BuildingEvaluation(evaluation.FiscalYear, b_entity) // TODO: Move this logic to AutoMapper.
                        {
                            EstimatedValue = evaluation.EstimatedValue,
                            AssessedValue = evaluation.AssessedValue,
                            NetBookValue = evaluation.NetBookValue,
                            CreatedById = userId
                        });
                    }

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

                        foreach (var evaluation in building.Evaluations)
                        {
                            // Update evaluation.
                            var b_eval = b_entity.Evaluations.FirstOrDefault(e => e.FiscalYear == evaluation.FiscalYear);

                            if (b_eval == null)
                            {
                                b_entity.Evaluations.Add(new Entity.BuildingEvaluation(evaluation.FiscalYear, b_entity) // TODO: Move this logic to AutoMapper.
                                {
                                    EstimatedValue = evaluation.EstimatedValue,
                                    AssessedValue = evaluation.AssessedValue,
                                    NetBookValue = evaluation.NetBookValue,
                                    CreatedById = userId
                                });
                            }
                            else
                            {
                                b_eval.EstimatedValue = evaluation.EstimatedValue;
                                b_eval.AssessedValue = evaluation.AssessedValue;
                                b_eval.NetBookValue = evaluation.NetBookValue;
                                b_eval.UpdatedById = userId; // TODO: Move to DAL.
                                b_eval.UpdatedOn = DateTime.UtcNow;
                            }
                        }

                        _pimsAdminService.Building.UpdateOne(b_entity);

                        // Check if the address was updated.
                        if (b_address != b_entity.Address.ToString())
                        {
                            b_entity.Address.UpdatedById = userId;
                            b_entity.Address.UpdatedOn = DateTime.UtcNow;
                            _pimsAdminService.Address.UpdateOne(b_entity.Address);
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
                _pimsAdminService.Address.UpdateOne(entity.Address);
            }
            _pimsAdminService.Parcel.Update(entity);
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
            var parcel = _mapper.Map<Entity.Parcel>(model);

            if (model.RowVersion == null) return BadRequest("Item does not exist");
            _pimsAdminService.Parcel.Remove(parcel);

            return new JsonResult(model);
        }
        #endregion
    }
}
