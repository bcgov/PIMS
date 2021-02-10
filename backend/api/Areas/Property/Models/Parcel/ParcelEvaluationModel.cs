using Model = Pims.Api.Models;
using System;

namespace Pims.Api.Areas.Property.Models.Parcel
{
    public class ParcelEvaluationModel : Model.BaseModel
    {
        #region Properties
        public int ParcelId { get; set; }

        public DateTime Date { get; set; }

        public string Key { get; set; }

        public decimal Value { get; set; }

        public string Note { get; set; }

        public string Firm { get; set; }
        #endregion
    }
}
