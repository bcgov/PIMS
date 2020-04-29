using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models
{
    public class PageModel<T>
        where T: class
    {
        #region Properties
        public int Page { get; set; }
        public int Quantity { get; set; }
        public int Total { get; set;  }
        public IEnumerable<T> Items { get; set; }
        #endregion
    }
}
