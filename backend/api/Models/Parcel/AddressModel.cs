using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models.Parcel
{
    public class AddressModel : BaseModel, IEquatable<AddressModel>
    {
        #region Properties
        public int Id { get; set; }

        public string Line1 { get; set; }

        public string Line2 { get; set; }

        public int CityId { get; set; }

        public string City { get; set; }

        public string ProvinceId { get; set; }

        public string Province { get; set; }

        public string Postal { get; set; }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as AddressModel);
        }

        public bool Equals([AllowNull] AddressModel other)
        {
            return other != null &&
                   Id == other.Id &&
                   Line1 == other.Line1 &&
                   Line2 == other.Line2 &&
                   CityId == other.CityId &&
                   City == other.City &&
                   ProvinceId == other.ProvinceId &&
                   Province == other.Province &&
                   Postal == other.Postal;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Line1, Line2, CityId, City, ProvinceId, Province, Postal);
        }
        #endregion
    }
}
