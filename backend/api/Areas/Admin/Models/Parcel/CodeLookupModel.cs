using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models.Parcel
{
    /// <summary>
    /// LookupCodeModel class, provides a model that represents look up objects.
    /// </summary>
    public class LookupCodeModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique name of the lookup item.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The unique code to identify the item.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The description of the item.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }
        #endregion
    }
}
