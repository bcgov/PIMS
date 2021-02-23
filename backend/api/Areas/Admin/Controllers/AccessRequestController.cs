using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using EModel = Pims.Dal.Entities.Models;
using Entity = Pims.Dal.Entities;
using IUserService = Pims.Dal.Services.IUserService;
using Model = Pims.Api.Areas.Admin.Models.User;
using PModel = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// AccessRequestController class, provides endpoints for managing access requests.
    /// </summary>
    [HasPermission(Permissions.AdminUsers)]
    [ApiController]
    [Area("admin")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/access/requests")]
    [Route("[area]/access/requests")]
    public class AccessRequestController : Controller
    {
        #region Properties
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        #endregion

        #region Construstor
        /// <summary>
        /// Creates a new instance of an AccessRequestController object, initializes with specified parameters.
        /// </summary>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        /// <param name="userService"></param>
        public AccessRequestController(IPimsAdminService pimsAdminService,
            IMapper mapper, IUserService userService)
        {
            _pimsAdminService = pimsAdminService;
            _userService = userService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints

        /// <summary>
        /// Get a list of access requests
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <param name="searchText"></param>
        /// <param name="role"></param>
        /// <param name="agency"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PModel.PageModel<Model.AccessRequestModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-access-requests" })]
        public IActionResult GetPage(int page = 1, int quantity = 10, string sort = null,
            string searchText = null, string role = null, string agency = null,
            Entity.AccessRequestStatus status = Entity.AccessRequestStatus.OnHold)
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 20) quantity = 20;

            var filter = new EModel.AccessRequestFilter(page, quantity, new[] { sort }, searchText, role, agency, status);

            var result = _pimsAdminService.User.GetAccessRequests(filter);
            var models = _mapper.Map<Model.AccessRequestModel[]>(result.Items);
            var paged = new PModel.PageModel<Model.AccessRequestModel>(models, page, quantity, result.Total);
            return new JsonResult(paged);
        }

        /// <summary>
        /// Delete an access requests
        /// </summary>
        /// <param name="id"></param>
        /// <param name="accessRequestModel"></param>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-access-requests" })]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "To support standardized routes ({id})")]
        public IActionResult Delete(int id, [FromBody] Model.AccessRequestModel accessRequestModel)
        {
            var entity = _mapper.Map<Entity.AccessRequest>(accessRequestModel);
            _userService.DeleteAccessRequest(entity);
            return new JsonResult(accessRequestModel);
        }
        #endregion

    }
}

