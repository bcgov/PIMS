namespace Pims.Dal.Entities.Models
{
    public class AccessRequestFilter : PageFilter
    {
        /// <summary>
        /// Get/Set - searchText
        /// </summary>
        public string SearchText { get; set; }

        /// <summary>
        /// Get/Set - role
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Get/Set - agency
        /// </summary>
        public string Agency { get; set; }

        /// <summary>
        /// Get/Set - Status
        /// </summary>
        public AccessRequestStatus Status { get; set; }

        public AccessRequestFilter(int page, int quantity, string[] sort, string searchText, string role, string agency,
            AccessRequestStatus status)
        {
            Page = page;
            Quantity = quantity;
            Sort = sort;
            SearchText = searchText;
            Role = role;
            Agency = agency;
            Status = status;
        }
    }
}
