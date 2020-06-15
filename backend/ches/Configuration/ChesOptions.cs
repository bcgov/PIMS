namespace Pims.Ches.Configuration
{
    /// <summary>
    /// ChesOptions class, provides a way to configure the Ches.
    /// </summary>
    public class ChesOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The authentication URL.
        /// </summary>
        public string AuthUrl { get; set; }

        /// <summary>
        /// get/set - The URI to the Ches API service.
        /// </summary>
        public string HostUri { get; set; }

        /// <summary>
        /// get/set - The email address that all emails will be 'from'.
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// get/set - The API username.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The API user password.
        /// </summary>
        public string Password { get; set; }
        #endregion
    }
}
