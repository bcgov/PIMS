using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Http.Models
{
    /// <summary>
    /// LtsaOrderModel class, provides a model that represents a response for requesting an LTSA Title summary in order to make another request to get the order.
    /// </summary>
    public class LtsaTitleSummaryModel
    {
        #region Properties
        /// <summary>
        /// get/set - The access token.
        /// </summary>
        [JsonPropertyName("titleNumber")]
        public string TitleNumber { get; set; }

        /// <summary>
        /// get/set - The refresh token.
        /// </summary>
        [JsonPropertyName("landTitleDistrictCode")]
        public string LandTitleDistrictCode { get; set; }
        #endregion
    }
}
