using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Geocoder;
using Pims.Geocoder.Extensions;
using Pims.Geocoder.Parameters;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Model = Pims.Api.Areas.Tools.Models.Geocoder;

namespace Pims.Api.Areas.Tools.Controllers
{
    /// <summary>
    /// GeocoderController class, provides endpoints to integrate with Data BC Geocoder.
    /// - https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/geocoder
    /// - https://catalogue.data.gov.bc.ca/dataset/bc-address-geocoder-web-service
    /// - https://catalogue.data.gov.bc.ca/dataset/bc-address-geocoder-web-service/resource/40d6411e-ab98-4df9-a24e-67f81c45f6fa/view/1d3c42fc-53dc-4aab-ae3b-f4d056cb00e0
    /// - https://bcgov.github.io/ols-devkit/widget/
    /// </summary>
    [Authorize]
    [ApiController]
    [Area("tools")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/geocoder")]
    [Route("[area]/geocoder")]
    public class GeocoderController : ControllerBase
    {
        #region Variables
        private readonly IGeocoderService _geocoderService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a GeocoderController class.
        /// </summary>
        /// <param name="geocoderService"></param>
        /// <param name="mapper"></param>
        public GeocoderController(IGeocoderService geocoderService, IMapper mapper)
        {
            _geocoderService = geocoderService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Make a request to Data BC Geocoder for addresses that match the specified `search`.
        /// </summary>
        /// <param name="address">An address or part of an address to search for.</param>
        /// <returns>An array of address matches.</returns>
        [HttpGet("addresses")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.AddressModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-geocoder" })]
        [HasPermission(Permissions.PropertyEdit)]
        public async Task<IActionResult> FindAddressesAsync(string address)
        {
            var parameters = this.Request.QueryString.ParseQueryString<AddressesParameters>();
            parameters.AddressString = address;
            var result = await _geocoderService.GetSiteAddressesAsync(parameters);
            return new JsonResult(_mapper.Map<Model.AddressModel[]>(result.Features));
        }

        /// <summary>
        /// Make a request to Data BC Geocoder for PIDs that belong to the specified 'siteId'.
        /// </summary>
        /// <param name="siteId">The site identifier for a parcel.</param>
        /// <returns>An array of PIDs for the supplied 'siteId'.</returns>
        [HttpGet("parcels/pids/{siteId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Model.AddressModel>), 200)]
        [ProducesResponseType(typeof(Pims.Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "tools-geocoder" })]
        [HasPermission(Permissions.PropertyEdit)]
        public async Task<IActionResult> FindPidsAsync(Guid siteId)
        {
            var result = await _geocoderService.GetPids(siteId);
            return new JsonResult(_mapper.Map<Model.SitePidsResponseModel>(result));
        }
        #endregion
    }
}
