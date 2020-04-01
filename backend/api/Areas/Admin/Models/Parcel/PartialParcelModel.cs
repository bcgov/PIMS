using Model = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models.Parcel
{
    public class PartialParcelModel : Model.BaseModel
    {
        #region Properties
        public int Id { get; set; }

        public string PID { get; set; }

        public string PIN { get; set; }

        public int StatusId { get; set; }

        public int ClassificationId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Description { get; set; }

        public string Zoning { get; set; }

        public string ZoningPotential { get; set; }
        #endregion
    }
}
