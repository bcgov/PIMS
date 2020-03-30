namespace Pims.Dal
{
    public class ServiceAccountOptions
    {
        #region Properties
        public string Username { get; set; } = "service-account";
        public string FirstName { get; set; } = "service";
        public string LastName { get; set; } = "account";
        public string Email { get; set; }
        #endregion
    }
}
