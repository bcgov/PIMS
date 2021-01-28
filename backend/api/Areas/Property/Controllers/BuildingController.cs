using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using Model = Pims.Api.Areas.Property.Models.Building;
using ApiModels = Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Property.Controllers
{
    /// <summary>
    /// BuildingController class, provides endpoints for managing my buildings.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("properties")]
    [Route("v{version:apiVersion}/[area]/buildings")]
    [Route("[area]/buildings")]
    public class BuildingController : ControllerBase
    {
        #region Variables
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingController class.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public BuildingController(IPimsService pimsService, IMapper mapper)
        {
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get the building from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.BuildingModel), 200)]
        [SwaggerOperation(Tags = new[] { "building" })]
        public IActionResult GetBuilding(int id)
        {
            var entity = _pimsService.Building.Get(id);
            var building = _mapper.Map<Model.BuildingModel>(entity);

            return new JsonResult(building);
        }

        /// <summary>
        /// Add a new building to the datasource for the current user.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [HasPermission(Permissions.PropertyAdd)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.BuildingModel), 201)]
        [ProducesResponseType(typeof(ApiModels.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(ApiModels.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "building" })]
        public IActionResult AddBuilding([FromBody] Model.BuildingModel model)
        {
            var entity = _mapper.Map<Entity.Building>(model);

            var addedEntity = _pimsService.Building.Add(entity);
            var building = _mapper.Map<Model.BuildingModel>(addedEntity);

            return CreatedAtAction(nameof(GetBuilding), new { id = building.Id }, building);
        }

        /// <summary>
        /// Update the specified building in the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [HasPermission(Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.BuildingModel), 200)]
        [ProducesResponseType(typeof(ApiModels.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(ApiModels.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "building" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/update/{id})")]
        public IActionResult UpdateBuilding(int id, [FromBody] Model.BuildingModel model)
        {
            var entity = _mapper.Map<Entity.Building>(model);

            var updatedEntity = _pimsService.Building.Update(entity);
            var building = _mapper.Map<Model.BuildingModel>(updatedEntity);

            return new JsonResult(building);
        }

        /// <summary>
        /// Update the specified building financial values in the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id}/financials")]
        [HasPermission(Permissions.PropertyEdit)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.BuildingModel), 200)]
        [ProducesResponseType(typeof(ApiModels.ErrorResponseModel), 400)]
        [ProducesResponseType(typeof(ApiModels.ErrorResponseModel), 403)]
        [SwaggerOperation(Tags = new[] { "building" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/update/{id})")]
        public IActionResult UpdateBuildingFinancials(int id, [FromBody] Model.BuildingModel model)
        {
            var entity = _mapper.Map<Entity.Building>(model);

            var updatedEntity = _pimsService.Building.UpdateFinancials(entity);
            var building = _mapper.Map<Model.BuildingModel>(updatedEntity);

            return new JsonResult(building);
        }

        /// <summary>
        /// Delete the specified building from the datasource if the user is allowed.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [HasPermission(Permissions.PropertyDelete)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.BuildingModel), 200)]
        [SwaggerOperation(Tags = new[] { "building" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes (/delete/{id})")]
        public IActionResult DeleteBuilding(int id, [FromBody] Model.BuildingModel model)
        {
            var entity = _mapper.Map<Entity.Building>(model);

            _pimsService.Building.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
