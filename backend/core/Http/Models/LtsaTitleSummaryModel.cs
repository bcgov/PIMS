using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Core.Http.Models
{
    /// <summary>
    /// Represents the response structure for LTSA Title summaries.
    /// </summary>
    public class LtsaTitleSummaryResponse
    {
        /// <summary>
        /// Gets or sets the list of title summaries.
        /// </summary>
        [JsonPropertyName("titleSummaries")]
        public List<LtsaTitleSummaryModel> TitleSummaries { get; set; }
    }

    /// <summary>
    /// Represents a single LTSA Title summary.
    /// </summary>
    public class LtsaTitleSummaryModel
    {
        /// <summary>
        /// Gets or sets the title number.
        /// </summary>
        [JsonPropertyName("titleNumber")]
        public string TitleNumber { get; set; }

        /// <summary>
        /// Gets or sets the land title district code.
        /// </summary>
        [JsonPropertyName("landTitleDistrictCode")]
        public string LandTitleDistrictCode { get; set; }

        /// <summary>
        /// Gets or sets the parcel identifier.
        /// </summary>
        [JsonPropertyName("parcelIdentifier")]
        public string ParcelIdentifier { get; set; }

        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        [JsonPropertyName("status")]
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets the first owner.
        /// </summary>
        [JsonPropertyName("firstOwner")]
        public string FirstOwner { get; set; }
    }
}
