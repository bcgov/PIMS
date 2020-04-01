namespace Pims.Api.Models.Property
{

    public class PropertyModel
    {
        #region Properties
        public int Id { get; set; }

        public int PropertyTypeId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Description { get; set; }

        #region Land Properties

        public string PID { get; set; }

        public string PIN { get; set; }

        public int StatusId { get; set; }

        public int ClassificationId { get; set; }
        #endregion

        #region Building Properties
        #endregion
        #endregion
    }
}
