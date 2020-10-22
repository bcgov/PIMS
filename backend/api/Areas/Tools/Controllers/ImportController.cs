using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Api.Areas.Tools.Helpers;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Linq;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Controllers
{
    /// <summary>
    /// ImportController class, provides endpoints for managing parcels.
    /// </summary>
    [HasPermission(Permissions.SystemAdmin)]
    [ApiController]
    [Area("tools")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/import")]
    [Route("[area]/import")]
    public class ImportController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ImportController> _logger;
        private readonly IPimsService _pimsService;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsService"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public ImportController(ILogger<ImportController> logger, IPimsService pimsService, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _pimsService = pimsService;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// POST - Add an array of new properties to the datasource.
        /// Determines if the property is a parcel or a building and then adds or updates appropriately.
        /// This will also add new lookup items to the following; cities, agencies, building construction types, building predominate uses.
        /// </summary>
        /// <param name="models">An array of property models.</param>
        /// <returns>The properties added.</returns>
        [HttpPost("properties")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.ParcelModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-import" })]
        [HasPermission(Permissions.SystemAdmin)]
        public IActionResult ImportProperties([FromBody] Model.ImportPropertyModel[] models)
        {
            if (models.Count() > 100) return BadRequest("Must not submit more than 100 properties in a single request.");

            var helper = new ImportPropertiesHelper(_pimsAdminService, _logger);
            var entities = helper.AddUpdateProperties(models);
            var parcels = _mapper.Map<Model.ParcelModel[]>(entities);

            return new JsonResult(parcels);
        }

        /// <summary>
        /// POST - Update property financial values in the datasource.
        /// If the property does not exist it will not be imported.
        /// The financial values provided will overwrite existing data in the datasource.
        /// </summary>
        /// <param name="models">An array of property models.</param>
        /// <returns>The properties added.</returns>
        [HttpPost("properties/financials")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.ParcelModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-import" })]
        [HasPermission(Permissions.SystemAdmin)]
        public IActionResult ImportPropertyFinancials([FromBody] Model.ImportPropertyModel[] models)
        {
            if (models.Count() > 100) return BadRequest("Must not submit more than 100 properties in a single request.");

            var helper = new ImportPropertiesHelper(_pimsAdminService, _logger);
            var entities = helper.UpdatePropertyFinancials(models);
            var parcels = _mapper.Map<Model.ParcelModel[]>(entities);

            return new JsonResult(parcels);
        }

        /// <summary>
        /// POST - Add an array of new properties to the datasource.
        /// Determines if the property is a parcel or a building and then adds or updates appropriately.
        /// This will also add new lookup items to the following; cities, agencies, building construction types, building predominate uses.
        /// </summary>
        /// <param name="models">An array of property models.</param>
        /// <param name="stopOnError">Whether to throw an error if a failture occurs.</param>
        /// <param name="defaults">A semi-colon separated list of key=value pairs of default values for properties if they are null or not provided.</param>
        /// <returns>The properties added.</returns>
        [HttpPost("projects")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.ProjectModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-import" })]
        [HasPermission(Permissions.SystemAdmin)]
        public IActionResult ImportProjects([FromBody] Model.ImportProjectModel[] models, bool stopOnError = true, string defaults = null)
        {
            if (models.Count() > 100) return BadRequest("Must not submit more than 100 projects in a single request.");

            var helper = new ImportProjectsHelper(_pimsService, _pimsAdminService, _logger);
            var entities = helper.AddUpdateProjects(models, stopOnError, defaults?.Split(";"));
            var parcels = _mapper.Map<Model.ProjectModel[]>(entities);

            return new JsonResult(parcels);
        }
        #endregion
    }
}
