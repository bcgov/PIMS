using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Tools.Models.Geocoder
{
    public class SitePidsResponseModel
    {
        #region Properties
        public Guid SiteId { get; set; }
        public IEnumerable<string> Pids { get; set; }
        #endregion
    }
}
