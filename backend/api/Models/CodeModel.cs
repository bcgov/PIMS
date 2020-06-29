namespace Pims.Api.Models
{
    /// <summary>
    /// CodeModel class, provides a model that represents a code code item.
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    public class CodeModel<TKey> : LookupModel<TKey>
    {
        #region Properties
        /// <summary>
        /// get/set - The item's unique code.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The parent id of this item.
        /// </summary>
        public int? ParentId { get; set; } // TODO: this isn't ideal as it will only currently be used by agency.
        #endregion
    }
}
