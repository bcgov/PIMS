using System;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models
{
    public class ParcelModel : BaseModel
    {
        #region Properties
        public int Id { get; set; }

        public string PID { get; set; }

        public int StatusId { get; set; }

        public string Status { get; set; }

        public int ClassificationId { get; set; }

        public string Classification { get; set; }

        public int AgencyId { get; set; }

        public string SubAgency { get; set; }

        public string Agency { get; set; }

        public AddressModel Address { get; set; }

        public float AssessedValue { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public float LandArea { get; set; }

        public string Description { get; set; }

        public string LandLegalDescription { get; set; }
        #endregion
    }
}
