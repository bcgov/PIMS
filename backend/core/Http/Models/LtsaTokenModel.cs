using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Http.Models
{
    /// <summary>
    /// LtsaTokenModel class, provides a model that represents a response for requesting an LTSA access token.
    /// </summary>
    public class LtsaTokenModel
    {
        #region Properties
        /// <summary>
        /// get/set - The access token.
        /// </summary>
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        /// <summary>
        /// get/set - The refresh token.
        /// </summary>
        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; }
        #endregion
    }
}
