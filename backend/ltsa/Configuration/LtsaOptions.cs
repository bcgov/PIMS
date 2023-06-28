namespace Pims.Ltsa.Configuration
{
    /// <summary>
    /// LtsaOptions class, provides a way to configure Ltsa options.
    /// </summary>
    public class LtsaOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The authentication URL.
        /// </summary>
        public string AuthUrl { get; set; }

        /// <summary>
        /// get/set - The URI to the LTSA API service.
        /// </summary>
        public string HostUri { get; set; }

        /// <summary>
        /// get/set - The API username.
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// get/set - The API user password.
        /// </summary>
        public string UserPassword { get; set; }

        /// <summary>
        /// get/set - The LTSA integrator username.
        /// </summary>
        public string IntegratorUsername { get; set; }

        /// <summary>
        /// get/set - The API integrator password.
        /// </summary>
        public string IntegratorPassword { get; set; }
        #endregion
    }
}
