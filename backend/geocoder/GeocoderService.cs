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
        /// <param name="clientFactory"></param>
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
            var host = this.Options.Host;
            return $"{host}{endpoint.Replace("{outputFormat}", outputFormat)}";
        }

        /// <summary>
        /// Sends an HTTP request to Geocoder for addresses that match the specified 'address'.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="outputFormat"></param>
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
        /// <param name="parameters"></param>
        /// <param name="outputFormat"></param>
        /// <returns></returns>
        public async Task<FeatureCollectionModel> GetSiteAddressesAsync(AddressesParameters parameters, string outputFormat = "json")
        {
            var uri = new Uri($"{GenerateUrl(this.Options.Sites.AddressesUrl, outputFormat)}");
            var url = QueryHelpers.AddQueryString(uri.AbsoluteUri, parameters.ToQueryStringDictionary());
            return await this.Client.GetAsync<FeatureCollectionModel>(url);
        }
        #endregion
    }
}
