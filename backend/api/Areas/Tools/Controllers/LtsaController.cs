using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Ltsa;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading.Tasks;
using LtsaModel = Pims.Core.Http.Models;

namespace Pims.Api.Areas.Tools.Controllers
{
    /// <summary>
    /// LtsaController class, provides an endpoint to make a request with the LTSA api.
    /// - https://help.ltsa.ca/myltsa-enterprise/title-and-other-searches
    /// </summary>
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Area("ltsa")]
    [Route("v{version:apiVersion}/[area]/land")]
    [Route("[area]/land")]
    public class LtsaController : ControllerBase
    {
        private readonly ILtsaService _ltsaService;

        public LtsaController(ILtsaService ltsaService)
        {
            _ltsaService = ltsaService;
        }

        [HttpGet("title")]
        [HasPermission(Permissions.PropertyView)]
        [Produces("application/json")]
        [ProducesResponseType(typeof(LtsaModel.LtsaOrderModel), 200)]
        [SwaggerOperation(Tags = new[] { "ltsa" })]
        public async Task<IActionResult> GetLandTitleInfo(string pid)
        {
            try
            {
                var landTitle = await _ltsaService.ProcessLTSARequest(pid);
                return new JsonResult(landTitle);
            }
            catch (Exception ex)
            {
                return StatusCode(404, new { Message = $"Unable to find title summary for parcel id: {pid}", Exception = ex.Message });
            }
        }
    }
}
