using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models.Building;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using Swashbuckle.AspNetCore.Annotations;
using Pims.Api.Helpers.Exceptions;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// BuildingController class, provides endpoints for managing my buildings.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/buildings")]
    [Route("buildings")]
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
        /// Get all the buildings that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.PartialBuildingModel>), 200)]
        [SwaggerOperation(Tags = new[] { "building" })]
        public IActionResult GetBuildings()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetBuildings(new BuildingFilter(query));
        }

        /// <summary>
        /// Get all the buildings that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.PartialBuildingModel>), 200)]
        [SwaggerOperation(Tags = new[] { "building" })]
        public IActionResult GetBuildings([FromBody]BuildingFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var buildings = _pimsService.Building.Get(filter);
            var result = _mapper.Map<Model.PartialBuildingModel[]>(buildings);
            return new JsonResult(result);
        }

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

        #region Paged Endpoints
        /// <summary>
        /// Get a page of buildings that satisfy the filter parameters.
        /// </summary>
        /// <returns></returns>
        [HttpGet("page")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.PartialBuildingModel>), 200)]
        [SwaggerOperation(Tags = new[] { "building" })]
        public IActionResult GetBuildingsPage()
        {
            var uri = new Uri(this.Request.GetDisplayUrl());
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
            return GetBuildingsPage(new BuildingFilter(query));
        }

        /// <summary>
        /// Get a page of buildings that satisfy the filter parameters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost("page/filter")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.PartialBuildingModel>), 200)]
        [SwaggerOperation(Tags = new[] { "building" })]
        public IActionResult GetBuildingsPage([FromBody]BuildingFilter filter)
        {
            filter.ThrowBadRequestIfNull($"The request must include a filter.");
            if (!filter.IsValid()) throw new BadRequestException("Property filter must contain valid values.");

            var page = _pimsService.Building.GetPage(filter);
            var result = _mapper.Map<Models.PageModel<Model.PartialBuildingModel>>(page);
            return new JsonResult(result);
        }
        #endregion
        #endregion
    }
}
