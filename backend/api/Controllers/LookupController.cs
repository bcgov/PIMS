using System.Linq;
using Pims.Dal;
using Model = Pims.Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// LookupController class, provides endpoints for code lookups.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    public class LookupController : ControllerBase
    {
        #region Variables
        private readonly ILogger<LookupController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IPimsService _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a LookupController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="pimsService"></param>
        /// <param name="mapper"></param>
        public LookupController(ILogger<LookupController> logger, IConfiguration configuration, IPimsService pimsService, IMapper mapper)
        {
            _logger = logger;
            _configuration = configuration;
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
        public IActionResult GetAgencies()
        {
            var agencyCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetAgenciesNoTracking());
            return new JsonResult(agencyCodes.ToArray());
        }

        /// <summary>
        /// Get all of the property classification code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("property/classifications")]
        public IActionResult GetPropertyClassifications()
        {
            var propertyClassificationCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetPropertyClassificationsNoTracking());
            return new JsonResult(propertyClassificationCodes.ToArray());
        }

        /// <summary>
        /// Get all of the code values
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        public IActionResult GetAll()
        {
            var agencyCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetAgenciesNoTracking());
            var propertyClassificationCodes = _mapper.Map<Model.CodeModel[]>(_pimsService.Lookup.GetPropertyClassificationsNoTracking());

            return new JsonResult(agencyCodes.Concat(propertyClassificationCodes).ToArray());
        }
        #endregion
    }
}
