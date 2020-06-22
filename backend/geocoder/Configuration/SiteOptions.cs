namespace Pims.Geocoder.Configuration
{
    public class SiteOptions
    {
        #region Properties

        /// <summary>
        /// get/set - The URL to the site addresses endpoint.
        /// </summary>
        public string AddressesUrl { get; set; } = "/addresses.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the site nearest endpoint.
        /// </summary>
        public string NearestUrl { get; set; } = "/sites/nearest.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the site near endpoint.
        /// </summary>
        public string NearUrl { get; set; } = "/sites/near.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the site within endpoint.
        /// </summary>
        public string WithinUrl { get; set; } = "/sites/within.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the site subsites endpoint.
        /// </summary>
        public string SubsitesUrl { get; set; } = "/sites/{siteId}/subsites.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the site endpoint.
        /// </summary>
        public string SiteUrl { get; set; } = "/sites/{siteId}.{outputFormat}";
        #endregion
    }
}
