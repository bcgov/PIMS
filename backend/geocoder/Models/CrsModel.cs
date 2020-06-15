using System.Collections.Generic;

namespace Pims.Geocoder.Models
{
    public class CrsModel
    {
        #region Properties
        public string Type { get; set; }
        public Dictionary<string, object> Properties { get; set; }
        #endregion
    }
}
