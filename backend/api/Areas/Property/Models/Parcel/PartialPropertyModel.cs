using Model = Pims.Api.Models;

namespace Pims.Api.Areas.Property.Models.Parcel
{
    public class PartialPropertyModel : Model.BaseModel
    {
        #region Properties
        public int Id { get; set; }

        public string Name { get; set; }

        public int StatusId { get; set; }

        public int ClassificationId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Description { get; set; }
        #endregion
    }
}
