using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Api.Areas.Tools.Helpers;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;

namespace Pims.Api.Areas.Admin.Controllers
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
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public ImportController(ILogger<ImportController> logger, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
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
        public IActionResult ImportProperties([FromBody] Model.PropertyModel[] models)
        {
            if (models.Count() > 100) return BadRequest("Must not submit more than 100 properties in a single request.");

            var helper = new ImportPropertiesHelper(_pimsAdminService, _logger);
            var entities = helper.AddUpdateProperties(models);
            var parcels = _mapper.Map<Model.ParcelModel[]>(entities);

            return new JsonResult(parcels);
        }
        #endregion
    }
}
