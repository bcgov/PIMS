using System.Collections.Generic;

namespace Pims.Api.Models.Parcel
{
    public class PropertyModel : BaseModel
    {
        #region Properties
        public int Id { get; set; }

        public IEnumerable<string> ProjectNumbers { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int ClassificationId { get; set; }

        public string Classification { get; set; }

        public string EncumbranceReason { get; set; }

        public int AgencyId { get; set; }

        public virtual string SubAgency { get; set; }

        public string Agency { get; set; }

        public AddressModel Address { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public bool IsSensitive { get; set; }

        public bool IsVisibleToOtherAgencies { get; set; }
        #endregion
    }
}
