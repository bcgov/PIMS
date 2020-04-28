using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models.Lookup;
using Pims.Dal;
using System.Linq;
using System.Collections.Generic;
using Swashbuckle.AspNetCore.Annotations;
using System;

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
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a LookupController class.
        /// </summary>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public LookupController(IPimsService pimsService, IMapper mapper)
        {
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
        [ProducesResponseType(typeof(IEnumerable<Models.CodeModel<int>>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetAgencies()
        {
            var agencyCodes = _mapper.Map<Models.CodeModel<int>[]>(_pimsService.Lookup.GetAgencies());
            return new JsonResult(agencyCodes.ToArray());
        }

        /// <summary>
        /// Get all of the role code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("roles")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.RoleModel>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetRoles()
        {
            var roleCodes = _mapper.Map<Model.RoleModel[]>(_pimsService.Lookup.GetRoles());
            return new JsonResult(roleCodes.ToArray());
        }

        /// <summary>
        /// Get all of the property classification code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("property/classifications")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Models.LookupModel<int>>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetPropertyClassifications()
        {
            var propertyClassificationCodes = _mapper.Map<Models.LookupModel<int>[]>(_pimsService.Lookup.GetPropertyClassifications());
            return new JsonResult(propertyClassificationCodes.ToArray());
        }

        /// <summary>
        /// Get all of the code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Models.CodeModel<object>>), 200)]
        [SwaggerOperation(Tags = new[] { "lookup" })]
        public IActionResult GetAll()
        {
            var agencyCodes = _mapper.Map<Models.CodeModel<int>[]>(_pimsService.Lookup.GetAgencies());
            var propertyStatusCodes = _mapper.Map<Models.LookupModel<int>[]>(_pimsService.Lookup.GetPropertyStatus());
            var propertyClassificationCodes = _mapper.Map<Models.LookupModel<int>[]>(_pimsService.Lookup.GetPropertyClassifications());
            var roleCodes = _mapper.Map<Model.RoleModel[]>(_pimsService.Lookup.GetRoles());
            var provinceCodes = _mapper.Map<Models.LookupModel<string>[]>(_pimsService.Lookup.GetProvinces());
            var cityCodes = _mapper.Map<Models.CodeModel<int>[]>(_pimsService.Lookup.GetCities());
            var constructionTypeCodes = _mapper.Map<Models.LookupModel<int>[]>(_pimsService.Lookup.GetBuildingConstructionTypes());
            var predominateUseCodes = _mapper.Map<Models.LookupModel<int>[]>(_pimsService.Lookup.GetBuildingPredominateUses());
            var occupantTypeCodes = _mapper.Map<Models.LookupModel<int>[]>(_pimsService.Lookup.GetBuildingOccupantTypes());

            var codes = new List<object>();
            codes.AddRange(roleCodes);
            codes.AddRange(agencyCodes);
            codes.AddRange(propertyStatusCodes);
            codes.AddRange(propertyClassificationCodes);
            codes.AddRange(provinceCodes);
            codes.AddRange(cityCodes);
            codes.AddRange(constructionTypeCodes);
            codes.AddRange(predominateUseCodes);
            codes.AddRange(occupantTypeCodes);
            return new JsonResult(codes);
        }
        #endregion
    }
}
