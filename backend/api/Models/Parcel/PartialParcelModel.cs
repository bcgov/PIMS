namespace Pims.Api.Models.Parcel
{
    public class PartialParcelModel : PartialPropertyModel
    {
        #region Properties
        public string PID { get; set; }

        public string PIN { get; set; }

        public string Zoning { get; set; }

        public string ZoningPotential { get; set; }
        #endregion
    }
}
