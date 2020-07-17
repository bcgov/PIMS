namespace Pims.Tools.Converters.ExcelConverter.Models
{
    /// <summary>
    /// Address class, provides a model that represents an address and location.
    /// </summary>
    public class AddressModel
    {
        #region Properties
        /// <summary>
        /// get/set - The civic address.
        /// </summary>
        public string CivicAddress { get; set; }

        /// <summary>
        /// get/set - The city name.
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// get/set - The geo location latitude.
        /// </summary>
        public double Latitude { get; set; }

        /// <summary>
        /// get/set - The geo location longitude.
        /// </summary>
        public double Longitude { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an AddressModel.
        /// </summary>
        public AddressModel() { }

        /// <summary>
        /// Creates a new instance of an AddressModel, initializes with specified arguments.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="city"></param>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        public AddressModel(string address, string city, double latitude, double longitude)
        {
            this.CivicAddress = address;
            this.City = city;
            this.Latitude = latitude;
            this.Longitude = longitude;
        }
        #endregion
    }
}
