using System.Linq;
using Pims.Api.Data;
using Model = Pims.Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// LookupController class, provides endpoints for managing my parcels.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route ("/api/[controller]")]
    public class LookupController : ControllerBase
    {
        #region Variables
        private readonly ILogger<LookupController> _logger;
        private readonly IConfiguration _configuration;
        private readonly PIMSContext _dbContext;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a LookupController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="dbContext"></param>
        public LookupController (ILogger<LookupController> logger, IConfiguration configuration, PIMSContext dbContext, IMapper mapper)
        {
            _logger = logger;
            _configuration = configuration;
            _dbContext = dbContext;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get all of the agency code values
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("/api/[controller]/agencies")]
        public IActionResult GetAgencies ()
        {
            var agencyCodes = _mapper.Map<Model.CodeModel[]>(_dbContext.Agencies);
            return new JsonResult(agencyCodes);
        }

        /// <summary>
        /// Get all of the property classification code values
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("/api/[controller]/propertyClassifications")]
        public IActionResult GetPropertyClassifications ()
        {
            var propertyClassificationCodes = _mapper.Map<Model.CodeModel[]>(_dbContext.PropertyClassifications);
            return new JsonResult(propertyClassificationCodes);
        }

        /// <summary>
        /// Get all of the code values
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("/api/[controller]/all")]
        public IActionResult GetAll()
        {
            var agencyCodes = _mapper.Map<Model.CodeModel[]>(_dbContext.Agencies);
            var propertyClassificationCodes = _mapper.Map<Model.CodeModel[]>(_dbContext.PropertyClassifications);

            return new JsonResult(agencyCodes.Concat(propertyClassificationCodes));
        }
        #endregion
    }
}
