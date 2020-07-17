using Pims.Core.Converters;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Geocoder.Models
{
    public class PropertyModel
    {
        #region Properties
        public string FullAddress { get; set; }
        public int Score { get; set; }
        public string MatchPrecision { get; set; }
        public int PrecisionPoints { get; set; }
        public IEnumerable<FaultModel> Faults { get; set; }
        public string SiteName { get; set; }
        public string UnitDesignator { get; set; }
        [JsonConverter(typeof(Int32ToStringJsonConverter))]
        public string UnitNumber { get; set; }
        public string UnitNumberSuffix { get; set; }
        [JsonConverter(typeof(Int32ToStringJsonConverter))]
        public string CivicNumber { get; set; }
        public string CivicNumberSuffix { get; set; }
        [JsonConverter(typeof(Int32ToStringJsonConverter))]
        public string StreetName { get; set; }
        public string StreetType { get; set; }
        [JsonConverter(typeof(BooleanJsonConverter))]
        public bool IsStreetTypePrefix { get; set; }
        public string StreetDirection { get; set; }
        [JsonConverter(typeof(BooleanJsonConverter))]
        public bool IsStreetDirectionPrefix { get; set; }
        public string StreetQualifier { get; set; }
        public string LocalityName { get; set; }
        public string LocalityType { get; set; }
        public string ElectoralArea { get; set; }
        public string ProvinceCode { get; set; }
        public string LocationPositionalAccuracy { get; set; }
        public string LocationDescriptor { get; set; }
        public string SiteID { get; set; }
        [JsonConverter(typeof(Int32ToStringJsonConverter))]
        public string BlockID { get; set; }
        public string FullSiteDescriptor { get; set; }
        public string AccessNotes { get; set; }
        public string SiteStatus { get; set; }
        public string SiteRetireDate { get; set; }
        public string ChangeDate { get; set; }
        public string IsOfficial { get; set; }
        #endregion
    }
}
