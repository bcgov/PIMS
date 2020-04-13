namespace Pims.Api.Models.Parcel
{
    public class BuildingFiscalModel : BaseModel
    {
        #region Properties
        public int BuildingId { get; set; }

        public int FiscalYear { get; set; }

        public string Key { get; set; }

        public float Value { get; set; }

        public string Note { get; set; }
        #endregion
    }
}
