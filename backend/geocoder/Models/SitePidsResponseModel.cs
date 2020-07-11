using System;
using System.Collections.Generic;

namespace Pims.Geocoder.Models
{
    public class SitePidsResponseModel
    {
        #region Properties
        public Guid SiteID { get; set; }
        public IEnumerable<string> Pids { get; set; }
        #endregion
    }
}
