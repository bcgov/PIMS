namespace Pims.Geocoder.Configuration
{
    /// <summary>
    /// GeocoderOptions class, provides a way to configure the Geocoder.
    /// </summary>
    public class GeocoderOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The URI to the Geocoder API service.
        /// </summary>
        public string HostUri { get; set; } = "https://geocoder.api.gov.bc.ca";

        /// <summary>
        /// get/set - The API Key to include when making requests to the Geocoder API.
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// get/set - Site endpoint URLs.
        /// </summary>
        public SiteOptions Sites { get; set; } = new SiteOptions();

        /// <summary>
        /// get/set - Intersection endpoint URLs.
        /// </summary>
        public IntersectionOptions Intersections { get; set; } = new IntersectionOptions();

        /// <summary>
        /// get/set - Occupant endpoint URLs.
        /// </summary>
        public OccupantOptions Occupants { get; set; } = new OccupantOptions();

        /// <summary>
        /// get/set - Parcel endpiont URLs.
        /// </summary>
        public ParcelOptions Parcels { get; set; } = new ParcelOptions();
        #endregion
    }
}
