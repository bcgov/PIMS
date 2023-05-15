using Pims.Api.Helpers.Extensions;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.AdministrativeArea;
using EModel = Pims.Dal.Entities.Models;
using Pims.Dal.Keycloak;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// AdministrativeArea class, provides endpoints for managing administrative areas.
    /// </summary>
    [HasPermission(Permissions.SystemAdmin)]
    [ApiController]
    [Area("admin")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/administrative/areas")]
    [Route("[area]/administrative/areas")]
    public class AdministrativeAreaController : ControllerBase
    {
        #region Variables

        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;

        #endregion

        #region Constructors

        /// <summary>
        /// Creates a new instance of a AdministrativeAreaController class.
        /// </summary>
        /// <param name="pimsAdminService"></param>
        /// <param name="keycloakService"></param>
        /// <param name="mapper"></param>
        public AdministrativeAreaController(IPimsAdminService pimsAdminService, IPimsKeycloakService keycloakService,
            IMapper mapper)
        {
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }

        #endregion

        #region Endpoints

        /// <summary>
        /// GET - Returns a paged list of administrative areas from the datasource.
        /// </summary>
        /// <returns>Array of administrative areas.</returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AdministrativeAreaModel[]), 200)]
        [SwaggerOperation(Tags = new[] { "admin-administrative-area" })]
        public IActionResult GetAdministrativeAreas()
        {
            var adminAreas = _pimsAdminService.AdministrativeArea.GetAll();
            return new JsonResult(_mapper.Map<Model.AdministrativeAreaModel[]>(adminAreas));
        }

        /// <summary>
        /// GET - Returns a paged array of administrative areas from the datasource.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns>Paged object with an array of administrative areas.</returns>
        [HttpPost("filter")]
        [ValidateAntiForgeryToken]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Api.Models.PageModel<Model.AdministrativeAreaModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-administrative-area" })]
        public IActionResult GetAdministrativeAreas(EModel.AdministrativeAreaFilter filter)
        {
            var page = _pimsAdminService.AdministrativeArea.Get(filter);
            var result = _mapper.Map<Api.Models.PageModel<Model.AdministrativeAreaModel>>(page);
            return new JsonResult(result);
        }

        /// <summary>
        /// GET - Returns a administrative area for the specified 'id' from the datasource.
        /// </summary>
        /// <param name="id">The unique 'id' for the admin area to return.</param>
        /// <returns>The administrative area requested.</returns>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AdministrativeAreaModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-administrative-area" })]
        public IActionResult GetAdministrativeArea(int id)
        {
            var adminArea = _pimsAdminService.AdministrativeArea.Get(id);
            return new JsonResult(_mapper.Map<Model.AdministrativeAreaModel>(adminArea));
        }

        /// <summary>
        /// PUT - Update an administrative area in the datasource.
        /// </summary>
        /// <param name="model">The administrative area model.</param>
        /// <returns>The administrative area updated.</returns>
        [HttpPut("{id}")]
        [ValidateAntiForgeryToken]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AdministrativeAreaModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-administrative-area" })]
        public IActionResult UpdateAdministrativeAreaAsync([FromBody] Model.AdministrativeAreaModel model)
        {
            var entity = _mapper.Map<Entity.AdministrativeArea>(model);
            try
            {
                _pimsAdminService.AdministrativeArea.Update(entity);

                var adminArea = _mapper.Map<Model.AdministrativeAreaModel>(entity);
                return new JsonResult(adminArea);
            }
            catch (DbUpdateException ex)
            {
                var duplicateError = ex.CheckErrorMessageForDuplicate("Error while updating Administrative Area.");
                if (duplicateError != null)
                {
                    return BadRequest(duplicateError);
                }
                throw;
            }
        }

        /// <summary>
        /// POST - Add a new administrative area to the datasource.
        /// </summary>
        /// <param name="model">The administrative area model.</param>
        /// <returns>The administrative area added.</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AdministrativeAreaModel), 201)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-administrative-area" })]
        public IActionResult AddAdministrativeArea([FromBody] Model.AdministrativeAreaModel model)
        {
            var entity = _mapper.Map<Entity.AdministrativeArea>(model);
            try
            {
                _pimsAdminService.AdministrativeArea.Add(entity);

                var administrativeArea = _mapper.Map<Model.AdministrativeAreaModel>(entity);

                return CreatedAtAction(nameof(GetAdministrativeArea), new { id = administrativeArea.Id },
                    administrativeArea);
            }
            catch (DbUpdateException ex)
            {
                var duplicateError = ex.CheckErrorMessageForDuplicate("Error while adding Administrative Area.");
                if (duplicateError != null)
                {
                    return BadRequest(duplicateError);
                }
                throw;
            }
        }

        /// <summary>
        /// DELETE - Delete the administrative area from the datasource.
        /// </summary>
        /// <param name="model">The administrative area model.</param>
        /// <returns>The administrative area that was deleted.</returns>
        [HttpDelete("{id}")]
        [ValidateAntiForgeryToken]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AdministrativeAreaModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-administrative-area" })]
        public IActionResult DeleteAdministrativeAreaAsync([FromBody] Model.AdministrativeAreaModel model)
        {
            var entity = _mapper.Map<Entity.AdministrativeArea>(model);
            _pimsAdminService.AdministrativeArea.Remove(entity);

            return new JsonResult(model);
        }
        #endregion
    }
}
