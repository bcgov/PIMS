using Model = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models.Parcel
{
    public class ParcelEvaluationModel : Model.BaseModel
    {
        #region Properties
        public int ParcelId { get; set; }

        public int FiscalYear { get; set; }

        public float EstimatedValue { get; set; }

        public float AppraisedValue { get; set; }

        public float AssessedValue { get; set; }

        public float NetBookValue { get; set; }
        #endregion
    }
}
