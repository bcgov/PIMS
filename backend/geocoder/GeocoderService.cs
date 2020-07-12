using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Pims.Core.Http;
using Pims.Geocoder.Configuration;
using Pims.Geocoder.Extensions;
using Pims.Geocoder.Models;
using Pims.Geocoder.Parameters;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Pims.Geocoder
{
    /// <summary>
    /// GeocoderService class, provides a service for integration with Geocoder API services.
    /// </summary>
    public class GeocoderService : IGeocoderService
    {
        #region Properties
        protected IHttpRequestClient Client { get; }
        public GeocoderOptions Options { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a GeocoderService, initializes with specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="client"></param>
        public GeocoderService(IOptions<GeocoderOptions> options, IHttpRequestClient client)
        {
            this.Options = options.Value;
            this.Client = client;
            if (!String.IsNullOrWhiteSpace(this.Options.Key))
            {
                client.Client.DefaultRequestHeaders.Add("apikey", this.Options.Key);
            }
        }
        #endregion

        #region Methods
        /// <summary>
        /// Generates the full URL including the host.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="outputFormat"></param>
        /// <returns></returns>
        private string GenerateUrl(string endpoint, string outputFormat = "json")
        {
            var host = this.Options.HostUri;
            return $"{host}{endpoint.Replace("{outputFormat}", outputFormat)}";
        }

        /// <summary>
        /// Sends an HTTP request to Geocoder for addresses that match the specified 'address'.
        /// </summary>
        /// <param name="address">The address to geocode</param>
        /// <param name="outputFormat">The output format. Defaults to "json"</param>
        /// <returns></returns>
        public async Task<FeatureCollectionModel> GetSiteAddressesAsync(string address, string outputFormat = "json")
        {
            var parameters = new AddressesParameters()
            {
                AddressString = WebUtility.UrlEncode(address)
            };
            return await GetSiteAddressesAsync(parameters, outputFormat);
        }

        /// <summary>
        /// Sends an HTTP request to Geocoder for addresses that match the specified 'parameters'.
        /// </summary>
        /// <param name="parameters">The address search paramenters</param>
        /// <param name="outputFormat">The output format. Defaults to "json"</param>
        /// <returns></returns>
        public async Task<FeatureCollectionModel> GetSiteAddressesAsync(AddressesParameters parameters, string outputFormat = "json")
        {
            var uri = new Uri(GenerateUrl(this.Options.Sites.AddressesUrl, outputFormat));
            var url = QueryHelpers.AddQueryString(uri.AbsoluteUri, parameters.ToQueryStringDictionary());
            return await this.Client.GetAsync<FeatureCollectionModel>(url);
        }

        /// <summary>
        /// Sends an HTTP request to Geocoder for all parcel identifiers (PIDs) associated with an individual site.
        /// A 'siteId' is a unique identifier assigned to every site in B.C.
        /// Valid 'siteId' values for an address are returned by GetSiteAddressesAsync.
        /// </summary>
        /// <param name="siteId">The site identifier</param>
        /// <param name="outputFormat">The output format. Defaults to "json"</param>
        /// <returns></returns>
        public async Task<SitePidsResponseModel> GetPids(Guid siteId, string outputFormat = "json")
        {
            var endpoint = this.Options.Parcels.PidsUrl.Replace("{siteId}", siteId.ToString());
            var uri = new Uri(GenerateUrl(endpoint, outputFormat));
            return await this.Client.GetAsync<SitePidsResponseModel>(uri);
        }
        #endregion
    }
}
