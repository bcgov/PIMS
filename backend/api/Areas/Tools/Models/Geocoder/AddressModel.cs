namespace Pims.Api.Areas.Tools.Models.Geocoder
{
    public class AddressModel
    {
        #region Properties
        public string SiteId { get; set; }
        public string FullAddress { get; set; }
        public string Address1 { get; set; }
        public string AdministrativeArea { get; set; }
        public string ProvinceCode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int Score { get; set; }
        #endregion
    }
}
