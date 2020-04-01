namespace Pims.Api.Models.Parcel
{
    public class PartialParcelModel : BaseModel
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
        #endregion
    }
}
