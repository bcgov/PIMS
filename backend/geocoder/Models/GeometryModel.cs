namespace Pims.Geocoder.Models
{
    public class GeometryModel
    {
        #region Properties
        public string Type { get; set; }
        public CrsModel Crs { get; set; }
        public double[] Coordinates { get; set; }
        #endregion
    }
}
