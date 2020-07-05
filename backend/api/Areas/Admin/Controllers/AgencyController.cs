using MapsterMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Model = Pims.Api.Areas.Admin.Models.Agency;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// AgencyController class, provides endpoints for managing agencys.
    /// </summary>
    [HasPermission(Permissions.AgencyAdmin)]
    [ApiController]
    [Area("admin")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/agencies")]
    [Route("[area]/agencies")]
    public class AgencyController : ControllerBase
    {
        #region Variables
        private readonly ILogger<AgencyController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AgencyController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public AgencyController(ILogger<AgencyController> logger, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// GET - Returns a paged array of agencys from the datasource.
        /// </summary>
        /// <returns>Paged object with an array of agencys.</returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.AgencyModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public IActionResult GetAgencies()
        {
            var agencies = _pimsAdminService.Agency.GetAll();
            return new JsonResult(_mapper.Map<Model.AgencyModel[]>(agencies));
        }

        /// <summary>
        /// GET - Returns a agency for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the agency to return.</param>
        /// <returns>The agency requested.</returns>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AgencyModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public IActionResult GetAgency(int id)
        {
            var agency = _pimsAdminService.Agency.Get(id);
            return new JsonResult(_mapper.Map<Model.AgencyModel>(agency));
        }

        /// <summary>
        /// POST - Add a new agency to the datasource.
        /// </summary>
        /// <param name="model">The agency model.</param>
        /// <returns>The agency added.</returns>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AgencyModel), 201)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public IActionResult AddAgency([FromBody] Model.AgencyModel model)
        {
            var entity = _mapper.Map<Entity.Agency>(model);
            var addedEntity = _pimsAdminService.Agency.Add(entity);

            var agency = _mapper.Map<Model.AgencyModel>(addedEntity);

            return CreatedAtAction(nameof(GetAgency), new { id = agency.Id }, agency);
        }

        /// <summary>
        /// PUT - Update the agency in the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The agency model.</param>
        /// <returns>The agency updated.</returns>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AgencyModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public IActionResult UpdateAgency([FromBody] Model.AgencyModel model)
        {
            var entity = _mapper.Map<Entity.Agency>(model);
            var updatedEntity = _pimsAdminService.Agency.Update(entity);

            var agency = _mapper.Map<Model.AgencyModel>(updatedEntity);
            return new JsonResult(agency);
        }

        /// <summary>
        /// DELETE - Delete the agency from the datasource.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model">The agency model.</param>
        /// <returns>The agency who was deleted.</returns>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AgencyModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public IActionResult DeleteAgency([FromBody] Model.AgencyModel model)
        {
            var entity = _mapper.Map<Entity.Agency>(model);
            _pimsAdminService.Agency.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
