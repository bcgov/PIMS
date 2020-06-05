using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Pims.Dal
{
    /// <summary>
    /// PimsOptions class, provides a way to configure the data access layer.
    /// </summary>
    public class PimsOptions : DbContextOptions<PimsContext>
    {
        #region Properties
        /// <summary>
        /// get/set - Service account configuration details.
        /// </summary>
        public ServiceAccountOptions ServiceAccount { get; set; }

        /// <summary>
        /// get/set - Global project configuration settings.
        /// </summary>
        public ProjectOptions Project { get; set; }
        #endregion
    }
}
