using System;

namespace Pims.Api.Areas.Tools.Models.Import
{
    public class BuildingEvaluationModel : Api.Models.BaseModel
    {
        #region Properties
        public int BuildingId { get; set; }

        public DateTime Date { get; set; }

        public string Key { get; set; }

        public decimal Value { get; set; }

        public string Note { get; set; }
        #endregion
    }
}
