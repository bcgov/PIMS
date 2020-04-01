namespace Pims.Api.Models.Parts
{
    public class PartialBuildingModel : BaseModel
    {
        #region Properties
        public int Id { get; set; }

        public string LocalId { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
        #endregion
    }
}
