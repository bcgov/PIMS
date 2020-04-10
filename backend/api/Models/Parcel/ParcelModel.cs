using System.Collections.Generic;

namespace Pims.Api.Models.Parcel
{
    public class ParcelModel : BaseModel
    {
        #region Properties
        public int Id { get; set; }

        public string PID { get; set; }

        public int? PIN { get; set; }

        public int StatusId { get; set; }

        public string Status { get; set; }

        public string Description { get; set; }

        public int ClassificationId { get; set; }

        public string Classification { get; set; }

        public int AgencyId { get; set; }

        public string SubAgency { get; set; }

        public string Agency { get; set; }

        public AddressModel Address { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public float LandArea { get; set; }

        public string LandLegalDescription { get; set; }

        public string Municipality { get; set; }

        public string Zoning { get; set; }

        public string ZoningPotential { get; set; }
        
        public bool IsSensitive { get; set; }

        public IEnumerable<ParcelEvaluationModel> Evaluations { get; set; } = new List<ParcelEvaluationModel>();

        public IEnumerable<ParcelBuildingModel> Buildings { get; set; } = new List<ParcelBuildingModel>();
        #endregion
    }
}
