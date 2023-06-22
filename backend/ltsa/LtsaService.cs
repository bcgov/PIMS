using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Ltsa.Configuration;
using Pims.Core.Exceptions;
using Pims.Core.Extensions;
using Pims.Core.Http;
using Pims.Core.Http.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;

namespace Pims.Ltsa
{
    public class LtsaService : ILtsaService
    {
        #region Variables
        private LtsaTokenModel _token = null;
        private readonly JwtSecurityTokenHandler _tokenHandler;
        private readonly ILogger<ILtsaService> _logger;
        private readonly IConfiguration _configuration;
        #endregion

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
        /// <param name="logger"></param>
        public LtsaService(IOptions<LtsaOptions> options, IHttpRequestClient client, JwtSecurityTokenHandler tokenHandler, ILogger<ILtsaService> logger, IConfiguration configuration)
        {
            this.Options = options.Value;
            this.Client = client;
            _tokenHandler = tokenHandler;
            _logger = logger;
            _configuration = configuration;
        }
        #endregion



        #region Methods
        /// <summary>
        /// Generates the full URL including the host.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="outputFormat"></param>
        /// <returns></returns>
        private string GenerateUrl(string endpoint)
        {
            return $"{this.Options.HostUri}{endpoint}";
        }

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

        /// <summary>
        /// Ensure we have an active access token.
        /// Make an HTTP request if one is needed.
        /// </summary>
        /// <returns></returns>
        // private async Task RefreshAccessTokenAsync()
        // {
        //     // Check if token has expired.  If it has refresh it.
        //     if (_token == null || String.IsNullOrWhiteSpace(_token.AccessToken) || _tokenHandler.ReadJwtToken(_token.AccessToken).ValidTo <= DateTime.UtcNow)
        //     {
        //         _token = await GetTokenAsync();
        //     }
        // }

        /// <summary>
        /// Make an HTTP request to LTSA to get an access token for the specified 'username' and 'password'.
        /// </summary>
        /// <returns></returns>
        public async Task<LtsaTokenModel> GetTokenAsync(string pid)
        {
            var url = AuthenticateUrl();
            var headers = new HttpRequestMessage().Headers;
            string integratorUsername = _configuration.GetValue<string>("Ltsa_Integrator_Username");
            string integratorPassword = _configuration.GetValue<string>("Ltsa_Integrator_Password");
            string ltsaUserName = _configuration.GetValue<string>("Ltsa_UserName");
            string ltsaUserPassword = _configuration.GetValue<string>("Ltsa_UserPassword");

            using (HttpClient client = new HttpClient())
            {
                var jsonObject = new
                {
                    integratorUsername = integratorUsername,
                    integratorPassword = integratorPassword,
                    myLtsaUserName = ltsaUserName,
                    myLtsaUserPassword = ltsaUserPassword
                };

                // Convert the request body to JSON
                string json = JsonSerializer.Serialize(jsonObject);

                // Create the HttpContent with JSON
                HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");

                // Send the POST request
                HttpResponseMessage response = await client.PostAsync(url, content);
                // Read the response content as string
                string responseContent = await response.Content.ReadAsStringAsync();
                LtsaTokenModel token = JsonSerializer.Deserialize<LtsaTokenModel>(responseContent);

                string accessToken = token.AccessToken;
                string refreshToken = token.RefreshToken;

                // Create a new instance of LtsaTokenModel
                var ltsaToken = new LtsaTokenModel
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };

                Task<string> titleSummaryResponse = GetTitleSummary(accessToken, pid);

                return ltsaToken;
            }
        }

        /// <summary>
        /// Retrieves title summaries from the API using the provided access token and parcel identifier.
        /// </summary>
        /// <param name="accessToken">The access token for authentication.</param>
        /// <param name="parcelIdentifier">The parcel identifier for filtering the results.</param>
        /// <returns>The response content as a string.</returns>
        private async Task<string> GetTitleSummary(string accessToken, string parcelIdentifier)
        {
            // Set the API endpoint URL
            var apiUrl = HostUri() + "titleSummaries";
            // Create the request message
            var queryParams = $"filter=parcelIdentifier:{parcelIdentifier}";
            var requestUrl = $"{apiUrl}?{queryParams}";

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/vnd.ltsa.astra.titleSummaries+json");
                client.DefaultRequestHeaders.Add("X-Authorization", $"Bearer {accessToken}");

                try
                {
                    HttpResponseMessage response = await client.GetAsync(requestUrl);
                    response.EnsureSuccessStatusCode();

                    string responseContent = await response.Content.ReadAsStringAsync();
                    return responseContent;
                }
                catch (Exception ex)
                {
                    // Handle the exception here
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    throw; // Optionally rethrow the exception
                }
            }
        }

        /// <summary>
        /// Makes a POST request to the API to create an order.
        /// </summary>
        /// <param name="accessToken">The access token for authentication.</param>
        /// <returns>The response content as a string.</returns>
        public async Task<string> CreateOrderAsync(string accessToken)
        {
            var apiUrl = HostUri() + "orders";
            var requestUrl = apiUrl;

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/vnd.ltsa.astra.orders+json");
                client.DefaultRequestHeaders.Add("X-Authorization", $"Bearer {accessToken}");

                var order = new
                {
                    productType = "title",
                    fileReference = "Test",
                    productOrderParameters = new
                    {
                        titleNumber = " ",
                        landTitleDistrictCode = " ",
                        includeCancelledInfo = false
                    }
                };

                var requestBody = new
                {
                    order = order
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                try
                {
                    HttpResponseMessage response = await client.PostAsync(requestUrl, content);
                    response.EnsureSuccessStatusCode();

                    string responseContent = await response.Content.ReadAsStringAsync();
                    return responseContent;
                }
                catch (Exception ex)
                {
                    // Handle the exception here
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    throw; // Optionally rethrow the exception
                }
            }
        }
        #endregion
    }
}
