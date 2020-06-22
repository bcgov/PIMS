using System.Collections.Generic;

namespace Pims.Geocoder.Models
{
    public class FeatureCollectionModel
    {
        #region Properties
        public string Type { get; set; }
        public string QueryAddress { get; set; }
        public string SearchTimestamp { get; set; }
        public double ExecutionTime { get; set; }
        public string Version { get; set; }
        public string BaseDataDate { get; set; }
        public CrsModel Crs { get; set; }
        public string Interpolation { get; set; }
        public string Echo { get; set; }
        public string LocationDescripture { get; set; }
        public int SetBack { get; set; }
        public int MinScore { get; set; }
        public int MaxResults { get; set; }
        public string Disclaimer { get; set; }
        public string PrivacyStatement { get; set; }
        public string CopyrightNotice { get; set; }
        public string CopyrightLicense { get; set; }
        public IEnumerable<FeatureModel> Features { get; set; }
        #endregion
    }
}
