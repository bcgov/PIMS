namespace Pims.Api.Models.Parcel
{
    public class ParcelFiscalModel : BaseModel
    {
        #region Properties
        public int ParcelId { get; set; }

        public int FiscalYear { get; set; }

        public string Key { get; set; }

        public decimal Value { get; set; }

        public string Note { get; set; }
        #endregion
    }
}
