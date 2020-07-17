namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// GeocoderOptions class, provides a way to configure using geocoder.
    /// </summary>
    public class GeocoderOptions
    {
        #region Properties
        /// <summary>
        /// get/set - Number of milliseconds to wait between requests.
        /// </summary>
        public int RequestDelay { get; set; } = 100;

        /// <summary>
        /// get/set - A path to save a cache of address locations.
        /// </summary>
        public string CacheFile { get; set; } = "./Data/geocoder.csv";
        #endregion
    }
}
