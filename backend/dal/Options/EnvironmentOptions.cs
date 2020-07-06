using System;

namespace Pims.Dal
{
    /// <summary>
    /// EnvironmentOptions class, provides a way to configure PIMS environments.
    /// </summary>
    public class EnvironmentOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The application URI.
        /// </summary>
        public Uri Uri { get; set; }

        /// <summary>
        /// get/set - The environment name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The application title.
        /// </summary>
        public string Title { get; set; }
        #endregion
    }
}
