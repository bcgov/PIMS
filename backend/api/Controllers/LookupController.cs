using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Models;
using Pims.Dal;
using System.Linq;
using System.Collections.Generic;
using Swashbuckle.AspNetCore.Annotations;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// LookupController class, provides endpoints for code lookups.
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/lookup")]
    [Route("lookup")]
    public class LookupController : ControllerBase
    {
        #region Variables
        private readonly ILogger<LookupController> _logger;
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a LookupController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public LookupController(ILogger<LookupController> logger, IPimsService pimsService, IMapper mapper)
        {
            _logger = logger;
            _pimsService = pimsService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get all of the agency code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("agencies")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.CodeModel>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetAgencies()
        {
            var agencyCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetAgencies());
            return new JsonResult(agencyCodes.ToArray());
        }

        /// <summary>
        /// Get all of the role code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("roles")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.CodeModel>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetRoles()
        {
            var roleCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetRoles());
            return new JsonResult(roleCodes.ToArray());
        }

        /// <summary>
        /// Get all of the property classification code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("property/classifications")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.CodeModel>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetPropertyClassifications()
        {
            var propertyClassificationCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetPropertyClassifications());
            return new JsonResult(propertyClassificationCodes.ToArray());
        }

        /// <summary>
        /// Get all of the code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.CodeModel>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetAll()
        {
            var agencyCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetAgencies());
            var propertyClassificationCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetPropertyClassifications());
            var roleCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetRoles());
            var provinceCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetProvinces());
            var cityCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetCities());
            var constructionTypeCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetBuildingConstructionTypes());
            var predominateUseCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetBuildingPredominateUses());
            var occupantTypeCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetBuildingOccupantTypes());


            return new JsonResult(agencyCodes
                .Concat(propertyClassificationCodes)
                .Concat(roleCodes)
                .Concat(provinceCodes)
                .Concat(cityCodes)
                .Concat(constructionTypeCodes)
                .Concat(predominateUseCodes)
                .Concat(occupantTypeCodes)
                .ToArray());
        }
        #endregion
    }
}
