using Model = Pims.Api.Models;

namespace Pims.Api.Areas.Property.Models.Parcel
{
    public class SubdivisionParcelModel : Model.BaseModel
    {
        public int Id { get; set; }

        public string PID { get; set; }

        public int? PIN { get; set; }
    }
}
