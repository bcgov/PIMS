namespace Pims.Geocoder.Configuration
{
    public class IntersectionOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The URL to the intersection addresses endpoint.
        /// </summary>
        public string AddressesUrl { get; set; } = "/addresses.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the intersection nearest endpoint.
        /// </summary>
        public string NearestUrl { get; set; } = "/intersections/nearest.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the intersection near endpoint.
        /// </summary>
        public string NearUrl { get; set; } = "/intersections/near.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the intersection within endpoint.
        /// </summary>
        public string WithinUrl { get; set; } = "/intersections/within.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the intersection site endpoint.
        /// </summary>
        public string SiteUrl { get; set; } = "/intersections/{intersectionId}.{outputFormat}";
        #endregion
    }
}
