using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Dal.Helpers.Extensions;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Pims.Core.Helpers;
using System.Collections.Generic;
using Pims.Api.Helpers.Exceptions;
using Swashbuckle.AspNetCore.Annotations;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// ParcelController class, provides endpoints for managing parcels.
    /// </summary>
    [HasPermission(Permissions.SystemAdmin)]
    [ApiController]
    [Area("admin")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/parcels")]
    [Route("[area]/parcels")]
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
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Entity.Models.Paged<Model.Parts.ParcelModel>), 200)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult GetParcels(int page = 1, int quantity = 10, string sort = null) // TODO: sort and filter.
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 50) quantity = 50;

            var result = _pimsAdminService.Parcel.GetNoTracking(page, quantity, sort);
            var entities = _mapper.Map<Model.Parts.ParcelModel[]>(result.Items);
            var paged = new Entity.Models.Paged<Model.Parts.ParcelModel>(entities, page, quantity, result.Total);

            return new JsonResult(paged);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("{id:int}")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [ProducesResponseType(typeof(Model.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult GetParcel(int id)
        {
            var entity = _pimsAdminService.Parcel.GetNoTracking(id);

            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'PID' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("pid/{id:int}")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [ProducesResponseType(204)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult GetParcelByPid(int id)
        {
            var entity = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Parcel.GetByPidNoTracking(id));
            if (entity == null) return NoContent();

            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// GET - Returns a parcel for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="pid">The unique 'PID' for the parcel to return.</param>
        /// <returns>The parcel requested.</returns>
        [HttpGet("pid/{pid:pid}")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(Model.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult GetParcelByPid(string pid)
        {
            if (!int.TryParse(pid.Replace("-", ""), out int id)) throw new BadRequestException("PID is invalid");

            var entity = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Parcel.GetByPidNoTracking(id));
            if (entity == null) return NoContent();

            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// POST - Add a new parcel to the datasource.
        /// </summary>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel added.</returns>
        [HttpPost]
        [HasPermission(Permissions.PropertyAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 201)]
        [ProducesResponseType(typeof(Model.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult AddParcel([FromBody] Model.ParcelModel model)
        {
            var entity = _mapper.Map<Entity.Parcel>(model);

            _pimsAdminService.Parcel.Add(entity);
            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return CreatedAtAction(nameof(GetParcel), new { id = parcel.Id }, parcel);
        }

        /// <summary>
        /// POST - Add an array of new parcels to the datasource.
        /// </summary>
        /// <param name="models">An array of parcel models.</param>
        /// <returns>The parcels added.</returns>
        [HttpPost("many")]
        [HasPermission(Permissions.PropertyAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.ParcelModel>), 200)]
        [ProducesResponseType(typeof(Model.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult AddParcels([FromBody] Model.ParcelModel[] models)
        {
            var entities = _mapper.Map<Entity.Parcel[]>(models);
            _pimsAdminService.Parcel.Add(entities);
            var parcels = _mapper.Map<Model.ParcelModel[]>(entities);

            return new JsonResult(parcels);
        }

        /// <summary>
        /// PUT - Update the parcel in the datasource.
        /// This function will not delete evaluations, only add or update.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel updated.</returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [ProducesResponseType(typeof(Model.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult UpdateParcel(int id, [FromBody] Model.ParcelModel model)
        {
            var entity = _pimsAdminService.Parcel.Get(model.Id);
            var userId = this.User.GetUserId();
            _mapper.Map(model, entity);

            foreach (var evaluation in model.Evaluations)
            {
                // Update evaluation.
                var p_eval = entity.Evaluations.FirstOrDefault(e => e.FiscalYear == evaluation.FiscalYear);
                if (p_eval == null)
                {
                    entity.Evaluations.Add(new Entity.ParcelEvaluation(evaluation.FiscalYear, entity, evaluation.EstimatedValue, evaluation.AppraisedValue, evaluation.AssessedValue, evaluation.NetBookValue));
                }
                else
                {
                    _mapper.Map(evaluation, p_eval);
                }
            }

            foreach (var building in model.Buildings)
            {

                var b_entity = entity.Buildings.FirstOrDefault(b => b.Id == building.Id);
                if (b_entity == null)
                {
                    // Add a new building to the parcel.
                    b_entity = _mapper.Map<Entity.Building>(building);
                    foreach (var evaluation in building.Evaluations)
                    {
                        b_entity.Evaluations.Add(new Entity.BuildingEvaluation(evaluation.FiscalYear, b_entity, evaluation.EstimatedValue, evaluation.AppraisedValue, evaluation.AssessedValue, evaluation.NetBookValue));
                    }

                    entity.Buildings.Add(b_entity);
                }
                else
                {
                    // Update existing building on the parcel.
                    _mapper.Map(building, b_entity);

                    foreach (var evaluation in building.Evaluations)
                    {
                        // Update evaluation.
                        var b_eval = b_entity.Evaluations.FirstOrDefault(e => e.FiscalYear == evaluation.FiscalYear);
                        if (b_eval == null)
                        {
                            b_entity.Evaluations.Add(new Entity.BuildingEvaluation(evaluation.FiscalYear, b_entity, evaluation.EstimatedValue, evaluation.AppraisedValue, evaluation.AssessedValue, evaluation.NetBookValue));
                        }
                        else
                        {
                            _mapper.Map(evaluation, b_eval);
                        }
                    }
                }
            }

            _pimsAdminService.Parcel.Update(entity);
            var parcel = _mapper.Map<Model.ParcelModel>(entity);

            return new JsonResult(parcel);
        }

        /// <summary>
        /// DELETE - Delete the parcel from the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The parcel model.</param>
        /// <returns>The parcel who was deleted.</returns>
        [HttpDelete("{id}")]
        [HasPermission(Permissions.PropertyAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.ParcelModel), 200)]
        [ProducesResponseType(typeof(Model.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult DeleteParcel(Guid id, [FromBody] Model.ParcelModel model)
        {
            var parcel = _mapper.Map<Entity.Parcel>(model);
            _pimsAdminService.Parcel.Remove(parcel);

            return new JsonResult(model);
        }
        #endregion
    }
}
