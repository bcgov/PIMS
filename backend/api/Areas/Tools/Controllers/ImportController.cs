using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Api.Areas.Tools.Helpers;
using Pims.Api.Policies;
using Pims.Dal;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
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
        private readonly IOptions<JsonSerializerOptions> _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsService"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        /// <param name="serializerOptions"></param>
        public ImportController(ILogger<ImportController> logger, IPimsService pimsService, IPimsAdminService pimsAdminService, IMapper mapper, IOptions<JsonSerializerOptions> serializerOptions)
        {
            _logger = logger;
            _pimsService = pimsService;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
            _serializerOptions = serializerOptions;
        }
        #endregion

        #region Endpoints
        #region Properties
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
        /// DELETE - An array of properties to delete from the datasource.
        /// </summary>
        /// <param name="models">An array of property models.</param>
        /// <param name="updatedBefore">Only allow deletes to properties updated before this date.</param>
        /// <returns>The properties added.</returns>
        [HttpDelete("properties")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.ParcelModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-import" })]
        [HasPermission(Permissions.SystemAdmin)]
        public IActionResult DeleteProperties([FromBody] Model.ImportPropertyModel[] models, DateTime? updatedBefore = null)
        {
            if (models.Count() > 100) return BadRequest("Must not submit more than 100 properties in a single request.");

            var helper = new ImportPropertiesHelper(_pimsAdminService, _logger);
            var entities = helper.DeleteProperties(models, updatedBefore);
            var parcels = _mapper.Map<Model.PropertyModel[]>(entities);

            return new JsonResult(parcels);
        }
        #endregion

        #region Projects
        /// <summary>
        /// POST - Add an array of new properties to the datasource.
        /// Determines if the property is a parcel or a building and then adds or updates appropriately.
        /// This will also add new lookup items to the following; cities, agencies, building construction types, building predominate uses.
        /// </summary>
        /// <param name="models">An array of property models.</param>
        /// <param name="stopOnError">Whether to throw an error if a failture occurs.</param>
        /// <param name="fromSnapshot">The date and time an SPL report should be generated from.</param>
        /// <param name="defaults">A semi-colon separated list of key=value pairs of default values for properties if they are null or not provided.</param>
        /// <returns>The properties added.</returns>
        [HttpPost("projects")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.ProjectModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-import" })]
        [HasPermission(Permissions.SystemAdmin)]
        public IActionResult ImportProjects([FromBody] Model.ImportProjectModel[] models, bool stopOnError = true, DateTime? fromSnapshot = null, string defaults = null)
        {
            if (models.Count() > 100) return BadRequest("Must not submit more than 100 projects in a single request.");

            var helper = new ImportProjectsHelper(_pimsService, _pimsAdminService, _serializerOptions, _logger);
            var entities = helper.AddUpdateProjects(models, stopOnError, fromSnapshot, defaults?.Split(";"));
            var projects = _mapper.Map<Model.ProjectModel[]>(entities);

            return new JsonResult(projects);
        }
        #endregion
        #endregion
    }
}
