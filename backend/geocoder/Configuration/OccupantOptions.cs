namespace Pims.Geocoder.Configuration
{
    public class OccupantOptions
    {
        #region Properties

        /// <summary>
        /// get/set - The URL to the occupant addresses endpoint.
        /// </summary>
        public string AddressesUrl { get; set; } = "/occupants/addresses.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the occupant nearest endpoint.
        /// </summary>
        public string NearestUrl { get; set; } = "/occupants/nearest.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the occupant near endpoint.
        /// </summary>
        public string NearUrl { get; set; } = "/occupants/near.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the occupant within endpoint.
        /// </summary>
        public string WithinUrl { get; set; } = "/occupants/within.{outputFormat}";

        /// <summary>
        /// get/set - The URL to the occupant site endpoint.
        /// </summary>
        public string SiteUrl { get; set; } = "/occupants/{occupantId}.{outputFormat}";
        #endregion
    }
}
