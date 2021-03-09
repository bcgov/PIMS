using Microsoft.Extensions.Options;
using Pims.Ches.Configuration;
using Pims.Ches.Models;
using Pims.Core.Exceptions;
using Pims.Core.Extensions;
using Pims.Core.Http;
using Pims.Core.Http.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Pims.Ches
{
    /// <summary>
    /// ChesService class, provides a service for integration with Ches API services.
    /// </summary>
    public class ChesService : IChesService
    {
        #region Variables
        private readonly ClaimsPrincipal _user;
        private TokenModel _token = null;
        private readonly JwtSecurityTokenHandler _tokenHandler;
        #endregion

        #region Properties
        protected IHttpRequestClient Client { get; }
        public ChesOptions Options { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ChesService, initializes with specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="user"></param>
        /// <param name="client"></param>
        /// <param name="tokenHandler"></param>
        public ChesService(IOptions<ChesOptions> options, ClaimsPrincipal user, IHttpRequestClient client, JwtSecurityTokenHandler tokenHandler)
        {
            this.Options = options.Value;
            _user = user;
            this.Client = client;
            _tokenHandler = tokenHandler;
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
        /// Ensure we have an active access token.
        /// Make an HTTP request if one is needed.
        /// </summary>
        /// <returns></returns>
        private async Task RefreshAccessTokenAsync()
        {
            // Check if token has expired.  If it has refresh it.
            if (_token == null || String.IsNullOrWhiteSpace(_token.AccessToken) || _tokenHandler.ReadJwtToken(_token.AccessToken).ValidTo <= DateTime.UtcNow)
            {
                _token = await GetTokenAsync();
            }
        }

        /// <summary>
        /// Send a request to the specified endpoint.
        /// </summary>
        /// <typeparam name="TR"></typeparam>
        /// <param name="endpoint"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        private async Task<string> SendAsync(string endpoint, HttpMethod method)
        {
            await RefreshAccessTokenAsync();

            var url = GenerateUrl(endpoint);

            var headers = new HttpRequestMessage().Headers;
            headers.Add("Authorization", $"Bearer {_token.AccessToken}");

            try
            {
                var response = await this.Client.SendAsync(url, method, headers);
                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpClientRequestException ex)
            {
                var response = await this.Client?.DeserializeAsync<Ches.Models.ErrorResponseModel>(ex.Response);
                throw new ChesException(ex, this.Client, response);
            }
        }

        /// <summary>
        /// Send a request to the specified endpoint.
        /// </summary>
        /// <typeparam name="TR"></typeparam>
        /// <param name="endpoint"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        private async Task<TR> SendAsync<TR>(string endpoint, HttpMethod method)
        {
            await RefreshAccessTokenAsync();

            var url = GenerateUrl(endpoint);

            var headers = new HttpRequestMessage().Headers;
            headers.Add("Authorization", $"Bearer {_token.AccessToken}");

            try
            {
                return await this.Client.SendAsync<TR>(url, method, headers);
            }
            catch (HttpClientRequestException ex)
            {
                var response = await this.Client?.DeserializeAsync<Ches.Models.ErrorResponseModel>(ex.Response);
                throw new ChesException(ex, this.Client, response);
            }
        }

        /// <summary>
        /// Send a request to the specified endpoint.
        /// Make a request to get an access token if required.
        /// </summary>
        /// <typeparam name="TR"></typeparam>
        /// <typeparam name="TD"></typeparam>
        /// <param name="endpoint"></param>
        /// <param name="method"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        private async Task<TR> SendAsync<TR, TD>(string endpoint, HttpMethod method, TD data)
            where TD : class
        {
            await RefreshAccessTokenAsync();

            var url = GenerateUrl(endpoint);

            var headers = new HttpRequestMessage().Headers;
            headers.Add("Authorization", $"Bearer {_token.AccessToken}");

            try
            {
                return await this.Client.SendJsonAsync<TR, TD>(url, method, headers, data);
            }
            catch (HttpClientRequestException ex)
            {
                var response = await this.Client?.DeserializeAsync<Ches.Models.ErrorResponseModel>(ex.Response);
                throw new ChesException(ex, this.Client, response);
            }
        }

        /// <summary>
        /// Make an HTTP request to CHES to get an access token for the specified 'username' and 'password'.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<TokenModel> GetTokenAsync(string username = null, string password = null)
        {
            var headers = new HttpRequestMessage().Headers;
            var creds = Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes($"{username ?? this.Options.Username}:{password ?? this.Options.Password}"));
            headers.Add("Authorization", $"Basic {creds}");
            headers.Add("ContentType", "application/x-www-form-urlencoded");

            var form = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials")
            };
            var content = new FormUrlEncodedContent(form);

            try
            {
                return await this.Client.SendAsync<TokenModel>(this.Options.AuthUrl, HttpMethod.Post, headers, content);
            }
            catch (HttpClientRequestException ex)
            {
                var response = await this.Client?.DeserializeAsync<Ches.Models.ErrorResponseModel>(ex.Response);
                throw new ChesException(ex, this.Client, response);
            }
        }

        /// <summary>
        /// Send an HTTP request to CHES to send the specified 'email'.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<EmailResponseModel> SendEmailAsync(IEmail email)
        {
            if (email == null) throw new ArgumentNullException(nameof(email));

            email.From = this.Options.From ?? email.From;

            if (this.Options.BccUser)
            {
                email.Bcc = new[] { _user.GetEmail() }.Concat(email.Bcc?.Any() ?? false ? email.Bcc : new string[0]);
            }
            if (!String.IsNullOrWhiteSpace(this.Options.AlwaysBcc))
            {
                email.Bcc = this.Options.AlwaysBcc.Split(";").Select(e => e?.Trim()).Concat(email.Bcc?.Any() ?? false ? email.Bcc : new string[0]);
            }
            if (!String.IsNullOrWhiteSpace(this.Options.OverrideTo) || !this.Options.EmailAuthorized)
            {
                email.To = !String.IsNullOrWhiteSpace(this.Options.OverrideTo) ? this.Options.OverrideTo?.Split(";").Select(e => e?.Trim()) : new[] { _user.GetEmail() };
                email.Cc = new string[0];
                email.Bcc = new string[0];
            }
            if (this.Options.AlwaysDelay.HasValue)
            {
                email.SendOn = email.SendOn.AddSeconds(this.Options.AlwaysDelay.Value);
            }

            // Make sure there are no blank CC or BCC;
            email.To = email.To.NotNullOrWhiteSpace();
            email.Cc = email.Cc.NotNullOrWhiteSpace();
            email.Bcc = email.Bcc.NotNullOrWhiteSpace();

            if (this.Options.EmailEnabled)
                return await SendAsync<EmailResponseModel, IEmail>("/email", HttpMethod.Post, email);

            return new EmailResponseModel();
        }

        /// <summary>
        /// Send an HTTP request to CHES to send the specified 'email'.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<EmailResponseModel> SendEmailAsync(IEmailMerge email)
        {
            if (email == null) throw new ArgumentNullException(nameof(email));

            email.From = this.Options.From ?? email.From;

            if (this.Options.BccUser)
            {
                var address = new[] { _user.GetEmail() };
                email.Contexts.ForEach(c =>
                {
                    c.Bcc = address.Concat(c.Bcc?.Any() ?? false ? c.Bcc : new string[0]);
                });
            }
            if (!String.IsNullOrWhiteSpace(this.Options.AlwaysBcc))
            {
                email.Contexts.ForEach(c =>
                {
                    c.Bcc = this.Options.AlwaysBcc.Split(";").Select(e => e?.Trim()).Concat(c.Bcc?.Any() ?? false ? c.Bcc : new string[0]);
                });
            }
            if (!String.IsNullOrWhiteSpace(this.Options.OverrideTo) || !this.Options.EmailAuthorized)
            {
                var address = !String.IsNullOrWhiteSpace(this.Options.OverrideTo) ? this.Options.OverrideTo?.Split(";").Select(e => e?.Trim()) : new[] { _user.GetEmail() };
                email.Contexts.ForEach(c =>
                {
                    c.To = address;
                    c.Cc = new string[0];
                    c.Bcc = new string[0];
                });
            }
            if (this.Options.AlwaysDelay.HasValue)
            {
                email.Contexts.ForEach(c =>
                    c.SendOn = c.SendOn.AddSeconds(this.Options.AlwaysDelay.Value));
            }

            // Make sure there are no blank CC or BCC;
            email.Contexts.ForEach(c =>
            {
                c.To = c.To.NotNullOrWhiteSpace();
                c.Cc = c.Cc.NotNullOrWhiteSpace();
                c.Bcc = c.Bcc.NotNullOrWhiteSpace();
            });

            if (this.Options.EmailEnabled)
                return await SendAsync<EmailResponseModel, IEmailMerge>("/emailMerge", HttpMethod.Post, email);

            return new EmailResponseModel();
        }

        /// <summary>
        /// Send an HTTP request to get the current status of the message for the specified 'messageId'.
        /// </summary>
        /// <param name="messageId"></param>
        /// <returns></returns>
        public async Task<StatusResponseModel> GetStatusAsync(Guid messageId)
        {
            return await SendAsync<StatusResponseModel>($"/status/{messageId}", HttpMethod.Get);
        }

        /// <summary>
        /// Send an HTTP request to get the current status of the message(s) for the specified 'filter'.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public async Task<IEnumerable<StatusResponseModel>> GetStatusAsync(StatusModel filter)
        {
            if (filter == null) throw new ArgumentNullException(nameof(filter));
            if (!filter.MessageId.HasValue && !filter.TransactionId.HasValue && String.IsNullOrWhiteSpace(filter.Status) && String.IsNullOrWhiteSpace(filter.Tag)) throw new ArgumentException("At least one parameter must be specified.");

            var query = HttpUtility.ParseQueryString(String.Empty);
            if (filter.MessageId.HasValue) query.Add("msgId", $"{ filter.MessageId }");
            if (!String.IsNullOrEmpty(filter.Status)) query.Add("status", $"{ filter.Status }");
            if (!String.IsNullOrEmpty(filter.Tag)) query.Add("tag", $"{ filter.Tag }");
            if (filter.TransactionId.HasValue) query.Add("txId", $"{ filter.TransactionId }");

            return await SendAsync<IEnumerable<StatusResponseModel>>($"/status?{query}", HttpMethod.Get);
        }

        /// <summary>
        /// Send a cancel HTTP request to CHES for the specified 'messageId'.
        /// </summary>
        /// <param name="messageId"></param>
        /// <returns></returns>
        public async Task<StatusResponseModel> CancelEmailAsync(Guid messageId)
        {
            await SendAsync($"/cancel/{messageId}", HttpMethod.Delete);
            return await GetStatusAsync(messageId);
        }

        /// <summary>
        /// Send a cancel HTTP request to CHES for the specified 'filter'.
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<IEnumerable<StatusResponseModel>> CancelEmailAsync(StatusModel filter)
        {
            if (filter == null) throw new ArgumentNullException(nameof(filter));
            if (!filter.MessageId.HasValue && !filter.TransactionId.HasValue && String.IsNullOrWhiteSpace(filter.Status) && String.IsNullOrWhiteSpace(filter.Tag)) throw new ArgumentException("At least one parameter must be specified.");

            var query = HttpUtility.ParseQueryString(String.Empty);
            if (filter.MessageId.HasValue) query.Add("msgId", $"{ filter.MessageId }");
            if (!String.IsNullOrEmpty(filter.Status)) query.Add("status", $"{ filter.Status }");
            if (!String.IsNullOrEmpty(filter.Tag)) query.Add("tag", $"{ filter.Tag }");
            if (filter.TransactionId.HasValue) query.Add("txId", $"{ filter.TransactionId }");

            await SendAsync($"/cancel?{query}", HttpMethod.Delete);
            return await GetStatusAsync(filter);
        }
        #endregion
    }
}
