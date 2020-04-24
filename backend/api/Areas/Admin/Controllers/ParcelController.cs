using MapsterMapper;
using BModel = Pims.Api.Models;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Areas.Admin.Models.Parcel;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Policies;
using Pims.Core.Helpers;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http.Extensions;
using Pims.Dal.Entities.Models;
using Pims.Api.Helpers.Extensions;

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
        /// Get all the parcels that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.ParcelModel>), 200)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
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
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.ParcelModel>), 200)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult GetParcels([FromBody]ParcelFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");

            var page = _pimsAdminService.Parcel.Get(filter);
            var result = _mapper.Map<Api.Models.PageModel<Model.ParcelModel>>(page);
            return new JsonResult(result);
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
        [ProducesResponseType(typeof(BModel.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult GetParcel(int id)
        {
            var entity = _pimsAdminService.Parcel.Get(id);

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
            var entity = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Parcel.GetByPid(id));
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
        [ProducesResponseType(typeof(BModel.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult GetParcelByPid(string pid)
        {
            if (!int.TryParse(pid.Replace("-", ""), out int id)) throw new BadRequestException("PID is invalid");

            var entity = ExceptionHelper.HandleKeyNotFound(() => _pimsAdminService.Parcel.GetByPid(id));
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
        [ProducesResponseType(typeof(BModel.ErrorResponseModel), 400)]
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
        [ProducesResponseType(typeof(BModel.ErrorResponseModel), 400)]
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
        [ProducesResponseType(typeof(BModel.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        public IActionResult UpdateParcel(int id, [FromBody] Model.ParcelModel model)
        {
            var entity = _pimsAdminService.Parcel.Get(id);
            var userId = this.User.GetUserId();
            _mapper.Map(model, entity);

            foreach (var evaluation in model.Evaluations)
            {
                var key = (Entity.EvaluationKeys)Enum.Parse(typeof(Entity.EvaluationKeys), evaluation.Key);
                // Update evaluation.
                var p_eval = entity.Evaluations.FirstOrDefault(e => e.Key == key && e.Date == evaluation.Date);
                if (p_eval == null)
                {
                    entity.Evaluations.Add(new Entity.ParcelEvaluation(entity, evaluation.Date, key, evaluation.Value));
                }
                else
                {
                    _mapper.Map(evaluation, p_eval);
                }
            }

            foreach (var fiscal in model.Fiscals)
            {
                var key = (Entity.FiscalKeys)Enum.Parse(typeof(Entity.FiscalKeys), fiscal.Key);
                // Update fiscal.
                var p_fiscal = entity.Fiscals.FirstOrDefault(e => e.Key == key && e.FiscalYear == fiscal.FiscalYear);
                if (p_fiscal == null)
                {
                    entity.Fiscals.Add(new Entity.ParcelFiscal(entity, fiscal.FiscalYear, key, fiscal.Value));
                }
                else
                {
                    _mapper.Map(fiscal, p_fiscal);
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
                        var key = (Entity.EvaluationKeys)Enum.Parse(typeof(Entity.EvaluationKeys), evaluation.Key);
                        b_entity.Evaluations.Add(new Entity.BuildingEvaluation(b_entity, evaluation.Date, key, evaluation.Value));
                    }
                    foreach (var fiscal in building.Fiscals)
                    {
                        var key = (Entity.FiscalKeys)Enum.Parse(typeof(Entity.FiscalKeys), fiscal.Key);
                        b_entity.Fiscals.Add(new Entity.BuildingFiscal(b_entity, fiscal.FiscalYear, key, fiscal.Value));
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
                        var key = (Entity.EvaluationKeys)Enum.Parse(typeof(Entity.EvaluationKeys), evaluation.Key);
                        var b_eval = b_entity.Evaluations.FirstOrDefault(e => e.Key == key && e.Date == evaluation.Date);
                        if (b_eval == null)
                        {
                            b_entity.Evaluations.Add(new Entity.BuildingEvaluation(b_entity, evaluation.Date, key, evaluation.Value));
                        }
                        else
                        {
                            _mapper.Map(evaluation, b_eval);
                        }
                    }

                    foreach (var fiscal in building.Fiscals)
                    {
                        // Update fiscal.
                        var key = (Entity.FiscalKeys)Enum.Parse(typeof(Entity.FiscalKeys), fiscal.Key);
                        var b_fiscal = b_entity.Fiscals.FirstOrDefault(e => e.Key == key && e.FiscalYear == fiscal.FiscalYear);
                        if (b_fiscal == null)
                        {
                            b_entity.Fiscals.Add(new Entity.BuildingFiscal(b_entity, fiscal.FiscalYear, key, fiscal.Value));
                        }
                        else
                        {
                            _mapper.Map(fiscal, b_fiscal);
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
        [ProducesResponseType(typeof(BModel.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-parcel" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/delete/{id})")]
        public IActionResult DeleteParcel(int id, [FromBody] Model.ParcelModel model)
        {
            var parcel = _mapper.Map<Entity.Parcel>(model);
            _pimsAdminService.Parcel.Remove(parcel);

            return new JsonResult(model);
        }
        #endregion
    }
}
