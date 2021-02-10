using Model = Pims.Api.Models;
using System;

namespace Pims.Api.Areas.Property.Models.Building
{
    public class BuildingEvaluationModel : Model.BaseModel
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
