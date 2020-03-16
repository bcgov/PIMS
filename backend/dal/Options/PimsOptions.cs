using Microsoft.EntityFrameworkCore;

namespace Pims.Dal
{
    public class PimsOptions : DbContextOptions<PimsContext>
    {
        #region Properties
        public ServiceAccountOptions ServiceAccount { get; set; }
        #endregion
    }
}
