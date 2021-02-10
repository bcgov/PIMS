using System.Collections.Generic;

namespace Pims.Api.Areas.Property.Models.Parcel
{
    public class ParcelModel : PropertyModel
    {
        #region Properties
        public string PID { get; set; }

        public int? PIN { get; set; }

        public float LandArea { get; set; }

        public string LandLegalDescription { get; set; }

        public string Zoning { get; set; }

        public string ZoningPotential { get; set; }

        public IEnumerable<ParcelEvaluationModel> Evaluations { get; set; } = new List<ParcelEvaluationModel>();

        public IEnumerable<ParcelFiscalModel> Fiscals { get; set; } = new List<ParcelFiscalModel>();

        public IEnumerable<ParcelBuildingModel> Buildings { get; set; } = new List<ParcelBuildingModel>();

        /**
         * All of the parcels related to this subdivision
         */
        public IEnumerable<SubdivisionParcelModel> Parcels { get; set; } = new List<SubdivisionParcelModel>();

        /**
         * All of the subdivisions related to this parcel
         */
        public IEnumerable<ParcelSubdivisionModel> Subdivisions { get; set; } = new List<ParcelSubdivisionModel>();
        #endregion
    }
}
