namespace Pims.Geocoder.Models
{
    public class GeometeryModel
    {
        #region Properties
        public string Type { get; set; }
        public CrsModel Crs { get; set; }
        public double[] Coordinates { get; set; }
        #endregion
    }
}
