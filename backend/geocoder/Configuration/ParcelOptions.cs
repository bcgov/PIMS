namespace Pims.Geocoder.Configuration
{
    public class ParcelOptions
    {
        #region Properties

        /// <summary>
        /// get/set - The URL to the parcel pids endpoint.
        /// </summary>
        public string PidsUrl { get; set; } = "/parcels/pids/{siteId}.{outputFormat}";
        #endregion
    }
}
