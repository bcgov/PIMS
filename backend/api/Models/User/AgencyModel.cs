using System.Collections.Generic;

namespace Pims.Api.Models.User
{
    public class AgencyModel : CodeModel<int>
    {
        #region Properties
        public string Description { get; set; }
        public AgencyModel Parent { get; set; }
        public ICollection<AgencyModel> Children { get; } = new List<AgencyModel>();
        public ICollection<UserModel> Users { get; } = new List<UserModel>();
        #endregion
    }
}
