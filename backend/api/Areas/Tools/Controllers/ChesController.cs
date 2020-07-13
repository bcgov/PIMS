using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Ches;
using Pims.Dal.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Model = Pims.Ches.Models;

namespace Pims.Api.Areas.Tools.Controllers
{
    /// <summary>
    /// ChesController class, provides endpoints to integrate with Common Services CHES.
    /// - https://bcgov.github.io/common-service-showcase/
    /// - https://ches-master-9f0fbe-prod.pathfinder.gov.bc.ca/api/v1/docs#operation/postPreview
    /// - https://github.com/bcgov/common-hosted-email-service
    /// </summary>
    [Authorize]
    [ApiController]
    [Area("tools")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/ches")]
    [Route("[area]/ches")]
    public class ChesController : ControllerBase
    {
        #region Variables
        private readonly IChesService _chesService;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ChesController class.
        /// </summary>
        /// <param name="chesService"></param>
        public ChesController(IChesService chesService)
        {
            _chesService = chesService;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Make a request to CHES to get the status of the specified 'messageId'.
        /// </summary>
        /// <param name="messageId">The unique message ID to identify the message you want the status for.</param>
        /// <returns>A response containing the message status.</returns>
        [HttpGet("status/{messageId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.StatusResponseModel), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ches" })]
        [HasPermission(Permissions.AdminProjects)]
        public async Task<IActionResult> GetStatusAsync(Guid messageId)
        {
            var result = await _chesService.GetStatusAsync(messageId);
            return new JsonResult(result);
        }

        /// <summary>
        /// Make a request to CHES to get the status of the specified 'filter'.
        /// </summary>
        /// <param name="filter">An object to filter the results.</param>
        /// <returns>A response containing the message status.</returns>
        [HttpPost("status")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.StatusResponseModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ches" })]
        [HasPermission(Permissions.AdminProjects)]
        public async Task<IActionResult> GetStatusAsync([FromQuery] Model.StatusModel filter)
        {
            var result = await _chesService.GetStatusAsync(filter);
            return new JsonResult(result);
        }

        /// <summary>
        /// Make a request to CHES to cancel the specified 'messageId'.
        /// </summary>
        /// <param name="messageId">The unique message ID to identify the message you want to cancel.</param>
        /// <returns>A response containing the message status.</returns>
        [HttpDelete("cancel/{messageId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.StatusResponseModel), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ches" })]
        [HasPermission(Permissions.AdminProjects)]
        public async Task<IActionResult> CancelEmailAsync(Guid messageId)
        {
            var result = await _chesService.CancelEmailAsync(messageId);
            return new JsonResult(result);
        }

        /// <summary>
        /// Make a request to CHES to cancel emails that match the specified 'filter'.
        /// </summary>
        /// <param name="filter">An object to filter the messages that are cancelled.</param>
        /// <returns>A response containing the message status.</returns>
        [HttpDelete("cancel")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.StatusResponseModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-ches" })]
        [HasPermission(Permissions.AdminProjects)]
        public async Task<IActionResult> CancelEmailAsync([FromQuery] Model.StatusModel filter)
        {
            var result = await _chesService.CancelEmailAsync(filter);
            return new JsonResult(result);
        }
        #endregion
    }
}
