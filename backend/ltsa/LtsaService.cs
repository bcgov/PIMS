using Microsoft.Extensions.Options;
using Pims.Ltsa.Configuration;
using Pims.Core.Exceptions;
using Pims.Core.Http;
using Pims.Core.Http.Models;
using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Net.Http;

namespace Pims.Ltsa
{
    public class LtsaService : ILtsaService
    {
        #region Properties
        protected IHttpRequestClient Client { get; }
        public LtsaOptions Options { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a LtsaService, initializes with specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="client"></param>
        /// <param name="tokenHandler"></param>
        public LtsaService(IOptions<LtsaOptions> options, IHttpRequestClient client) //, IConfiguration configuration)
        {
            this.Options = options.Value;
            this.Client = client;
        }
        #endregion



        #region Methods

        /// <summary>
        /// Generates the URL for authentication.
        /// </summary>
        /// <returns></returns>
        private string AuthenticateUrl()
        {
            return $"{this.Options.AuthUrl}";
        }

        /// <summary>
        /// Generates the URL for the LTSA api.
        /// </summary>
        /// <returns></returns>
        private string HostUri()
        {
            return $"{this.Options.HostUri}";
        }

        // Custom exception class for LTSAApi errors
        public class LTSAApiException : Exception
        {
            public LTSAApiException(string message) : base(message)
            {
            }
        }

        /// <summary>
        /// Process the LTSA request by retrieving an access token, title summary information, and creating an order.
        /// </summary>
        /// <param name="pid">The parcel identifier.</param>
        /// <returns>The LTSA order model.</returns>
        public async Task<LtsaOrderModel> ProcessLTSARequest(string pid)
        {
            // make a request to get an access token from LTSA
            LtsaTokenModel ltsaToken = await GetTokenAsync(pid);

            // make a request to get title summary info from LTSA
            LtsaTitleSummaryResponse titleSummaryResponse = await GetTitleSummary(ltsaToken.AccessToken, pid);

            // Access the first title summary in the list
            LtsaTitleSummaryModel titleSummary = titleSummaryResponse.TitleSummaries[0];

            // titleNumber and district code for making order request
            string titleNumber = titleSummary.TitleNumber;
            string landTitleDistrictCode = titleSummary.LandTitleDistrictCode;

            // make a request to get the LTSA Order
            LtsaOrderModel order = await CreateOrderAsync(ltsaToken.AccessToken, titleNumber, landTitleDistrictCode);

            return order;
        }

        /// <summary>
        /// Makes an HTTP request to LTSA to get an access token for the specified parcel id.
        /// </summary>
        /// <param name="pid">The parcel id for which to retrieve the access token.</param>
        /// <returns>The access token as a LtsaTokenModel.</returns>
        public async Task<LtsaTokenModel> GetTokenAsync(string pid)
        {
            var url = AuthenticateUrl();
            string integratorUsername = this.Options.IntegratorUsername;
            string integratorPassword = this.Options.IntegratorPassword;
            string myLtsaUserName = this.Options.UserName;
            string myLtsaUserPassword = this.Options.UserPassword;

            var credentials = new
            {
                integratorUsername,
                integratorPassword,
                myLtsaUserName,
                myLtsaUserPassword
            };

            string json = JsonSerializer.Serialize(credentials);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                return await this.Client.SendAsync<LtsaTokenModel>(url, HttpMethod.Post, content);
            }
            catch (HttpClientRequestException ex)
            {
                Console.WriteLine($"Unable to get token from LTSA: {ex.Message}");
                throw new LTSAApiException(ex.Message);
            }
        }


        /// <summary>
        /// Retrieves title summaries from the API using the provided access token and parcel identifier.
        /// </summary>
        /// <param name="accessToken">The access token for authentication.</param>
        /// <param name="parcelIdentifier">The parcel identifier for filtering the results.</param>
        /// <returns>The response content as a string.</returns>
        public async Task<LtsaTitleSummaryResponse> GetTitleSummary(string accessToken, string parcelIdentifier)
        {
            // Set the API endpoint URL
            var apiUrl = HostUri() + "titleSummaries";
            // Create the request message
            var queryParams = $"filter=parcelIdentifier:{parcelIdentifier}";
            var requestUrl = $"{apiUrl}?{queryParams}";

            var headers = new HttpRequestMessage().Headers;
            headers.Add("Accept", "application/vnd.ltsa.astra.titleSummaries+json");
            headers.Add("X-Authorization", $"Bearer {accessToken}");

            try
            {
                return await this.Client.SendAsync<LtsaTitleSummaryResponse>(requestUrl, HttpMethod.Get, headers);
            }
            catch (HttpClientRequestException ex)
            {
                Console.WriteLine($"Failed to retrieve title summary for parcel id: {parcelIdentifier}. Status code: {ex.Message}");
                throw new LTSAApiException($"Failed to retrieve title summary for parcel id: {parcelIdentifier}. Status code: {ex.Message}");
            }
        }

        /// <summary>
        /// Makes a POST request to the API to create an order.
        /// </summary>
        /// <param name="accessToken">The access token for authentication.</param>
        /// <param name="titleNumber">The title number for the order.</param>
        /// <param name="landTitleDistrictCode">The land title district code for the order.</param>
        /// <returns>The response content as a string.</returns>
        public async Task<LtsaOrderModel> CreateOrderAsync(string accessToken, string titleNumber, string landTitleDistrictCode)
        {
            var apiUrl = HostUri() + "orders";

            var headers = new HttpRequestMessage().Headers;
            headers.Add("Accept", "application/vnd.ltsa.astra.orders+json");
            headers.Add("X-Authorization", $"Bearer {accessToken}");

            var order = new
            {
                productType = "title",
                fileReference = "Test",
                productOrderParameters = new
                {
                    titleNumber,
                    landTitleDistrictCode,
                    includeCancelledInfo = false
                }
            };

            var requestBody = new
            {
                order
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                return await this.Client.SendAsync<LtsaOrderModel>(apiUrl, HttpMethod.Post, headers, content);
            }
            catch (HttpClientRequestException ex)
            {
                // Handle the exception here
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw new LTSAApiException($"Failed to create an order. An error occurred during the HTTP request. {ex.Message}");
            }
        }
        #endregion
    }
}
