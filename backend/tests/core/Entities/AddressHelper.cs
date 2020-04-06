using Pims.Dal;
using System.Collections.Generic;
using System.Linq;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of an Address.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="address1"></param>
        /// <param name="address2"></param>
        /// <param name="city"></param>
        /// <param name="province"></param>
        /// <param name="postal"></param>
        /// <returns></returns>
        public static Entity.Address CreateAddress(int id, string address1, string address2, Entity.City city, Entity.Province province, string postal)
        {
            return new Entity.Address(address1, address2, city, province, postal)
            {
                Id = id,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new instance of an Address.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="address1"></param>
        /// <param name="address2"></param>
        /// <param name="postal"></param>
        /// <returns></returns>
        public static Entity.Address CreateAddress(int id, string address1, string address2, string postal)
        {
            var city = EntityHelper.CreateCity("VIC", "Victoria");
            var province = EntityHelper.CreateProvince("BC", "British Columbia");
            return new Entity.Address(address1, address2, city, province, postal)
            {
                Id = id,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new instance of an Address.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="address1"></param>
        /// <param name="address2"></param>
        /// <param name="postal"></param>
        /// <returns></returns>
        public static Entity.Address CreateAddress(this PimsContext context, int id, string address1, string address2, string postal)
        {
            var city = context.Cities.FirstOrDefault(c => c.Code == "VIC") ?? EntityHelper.CreateCity("VIC", "Victoria");
            var province = context.Provinces.Find("BC") ?? EntityHelper.CreateProvince("BC", "British Columbia");
            return new Entity.Address(address1, address2, city, province, postal)
            {
                Id = id,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }
    }
}

