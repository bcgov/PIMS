using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Address class, provides an entity for the datamodel to manage property addresses.
    /// </summary>
    public class Address : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The first address line.
        /// </summary>
        /// <value></value>
        public string Address1 { get; set; }

        /// <summary>
        /// get/set - The second address line.
        /// </summary>
        /// <value></value>
        public string Address2 { get; set; }

        /// <summary>
        /// get/set - The foreign key to the city.
        /// </summary>
        /// <value></value>
        public int CityId { get; set; }

        /// <summary>
        /// get/set - The city of the address.
        /// </summary>
        /// <value></value>
        public City City { get; set; }

        /// <summary>
        /// get/set - The foreign key to the province.
        /// </summary>
        /// <value></value>
        public string ProvinceId { get; set; }

        /// <summary>
        /// get/set - The province of the address.
        /// </summary>
        /// <value></value>
        public Province Province { get; set; }

        /// <summary>
        /// get/set - The postal code.
        /// </summary>
        /// <value></value>
        public string Postal { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Address class.
        /// </summary>
        public Address() { }

        /// <summary>
        /// Create a new instance of a Address class.
        /// </summary>
        /// <param name="address1"></param>
        /// <param name="address2"></param>
        /// <param name="cityId"></param>
        /// <param name="provinceId"></param>
        /// <param name="postal"></param>
        public Address(string address1, string address2, int cityId, string provinceId, string postal)
        {
            this.Address1 = address1;
            this.Address2 = address2;
            this.CityId = cityId;
            this.ProvinceId = provinceId;
            this.Postal = postal;
            this.CreatedOn = DateTime.UtcNow;
        }

        /// <summary>
        /// Create a new instance of a Address class.
        /// </summary>
        /// <param name="address1"></param>
        /// <param name="address2"></param>
        /// <param name="city"></param>
        /// <param name="province"></param>
        /// <param name="postal"></param>
        public Address(string address1, string address2, City city, Province province, string postal)
        {
            this.Address1 = address1;
            this.Address2 = address2;
            this.City = city;
            this.CityId = city?.Id ??
                throw new ArgumentNullException(nameof(city));
            this.Province = province;
            this.ProvinceId = province?.Id ??
                throw new ArgumentNullException(nameof(province));
            this.Postal = postal;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Return the address as a string.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return $"{this.Address1}{(String.IsNullOrWhiteSpace(this.Address2) ? null : $" {this.Address2}")}, {this.City?.Name} {this.ProvinceId}, {this.Postal}";
        }
        #endregion
    }
}
