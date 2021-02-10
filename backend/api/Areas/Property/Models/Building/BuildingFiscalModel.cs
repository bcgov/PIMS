using System;
using Model = Pims.Api.Models;

namespace Pims.Api.Areas.Property.Models.Building
{
    public class BuildingFiscalModel : Model.BaseModel
    {
        #region Properties
        public int BuildingId { get; set; }

        public int FiscalYear { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public string Key { get; set; }

        public decimal Value { get; set; }

        public string Note { get; set; }
        #endregion
    }
}
