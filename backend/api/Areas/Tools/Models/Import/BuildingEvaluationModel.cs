namespace Pims.Api.Areas.Tools.Models.Import
{
    public class BuildingEvaluationModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        public int PropertyId { get; set; }

        public int FiscalYear { get; set; }

        public float EstimatedValue { get; set; }

        public float AppraisedValue { get; set; }

        public float AssessedValue { get; set; }

        public float NetBookValue { get; set; }
        #endregion
    }
}
