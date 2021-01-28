using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Agency;
using EModel = Pims.Dal.Entities.Models;
using Pims.Dal.Keycloak;
using Pims.Core.Extensions;
using System.Threading.Tasks;

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
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IPimsKeycloakService _pimsKeycloakService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AgencyController class.
        /// </summary>
        /// <param name="pimsAdminService"></param>
        /// <param name="keycloakService"></param>
        /// <param name="mapper"></param>
        public AgencyController(IPimsAdminService pimsAdminService, IPimsKeycloakService keycloakService, IMapper mapper)
        {
            _pimsAdminService = pimsAdminService;
            _pimsKeycloakService = keycloakService;
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
        /// GET - Returns a paged array of agencies from the datasource.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns>Paged object with an array of agencies.</returns>
        [HttpPost("filter")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.AgencyModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public IActionResult GetAgencies(EModel.AgencyFilter filter)
        {
            var page = _pimsAdminService.Agency.Get(filter);
            var result = _mapper.Map<Api.Models.PageModel<Model.AgencyModel>>(page);
            return new JsonResult(result);
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
        public async Task<IActionResult> AddAgencyAsync([FromBody] Model.AgencyModel model)
        {
            var entity = _mapper.Map<Entity.Agency>(model);
            _pimsAdminService.Agency.Add(entity);

            // TODO: This isn't ideal as the db update may be successful but this request may not.
            await entity.Users.ForEachAsync(async u =>
            {
                var user = _pimsAdminService.User.Get(u.UserId);
                await _pimsKeycloakService.UpdateUserAsync(user);
            });

            var agency = _mapper.Map<Model.AgencyModel>(entity);

            return CreatedAtAction(nameof(GetAgency), new { id = agency.Id }, agency);
        }

        /// <summary>
        /// PUT - Update the agency in the datasource.
        /// </summary>
        /// <param name="model">The agency model.</param>
        /// <returns>The agency updated.</returns>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AgencyModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public async Task<IActionResult> UpdateAgencyAsync([FromBody] Model.AgencyModel model)
        {
            var entity = _mapper.Map<Entity.Agency>(model);
            _pimsAdminService.Agency.Update(entity);

            // TODO: This isn't ideal as the db update may be successful but this request may not.
            await entity.Users.ForEachAsync(async u =>
            {
                var user = _pimsAdminService.User.Get(u.UserId);
                await _pimsKeycloakService.UpdateUserAsync(user);
            });

            var agency = _mapper.Map<Model.AgencyModel>(entity);
            return new JsonResult(agency);
        }

        /// <summary>
        /// DELETE - Delete the agency from the datasource.
        /// </summary>
        /// <param name="model">The agency model.</param>
        /// <returns>The agency who was deleted.</returns>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AgencyModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-agency" })]
        public async Task<IActionResult> DeleteAgencyAsync([FromBody] Model.AgencyModel model)
        {
            var entity = _mapper.Map<Entity.Agency>(model);
            _pimsAdminService.Agency.Remove(entity);

            // TODO: This isn't ideal as the db update may be successful but this request may not.
            await entity.Users.ForEachAsync(async u =>
            {
                var user = _pimsAdminService.User.Get(u.UserId);
                await _pimsKeycloakService.UpdateUserAsync(user);
            });

            return new JsonResult(model);
        }
        #endregion
    }
}
