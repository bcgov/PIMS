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
        #endregion
    }
}
