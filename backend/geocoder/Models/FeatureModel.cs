namespace Pims.Geocoder.Models
{
    public class FeatureModel
    {
        #region Properties
        public string Type { get; set; }
        public GeometryModel Geometry { get; set; }
        public PropertyModel Properties { get; set; }
        #endregion
    }
}
