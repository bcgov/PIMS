namespace Pims.Api.Areas.Admin.Models.AdministrativeArea
{
    /// <summary>
    /// AdministrativeAreaModel, provides a model that represents administrative areas.
    /// </summary>
    public class AdministrativeAreaModel : Api.Models.LookupModel<int>
    {
        #region Properties
        /// <summary>
        /// get/set - An abbreviated name.
        /// </summary>
        public string Abbreviation { get; set; }

        /// <summary>
        /// get/set - A description of the boundary type for this area (o.e. Legal).
        /// </summary>
        public string BoundaryType { get; set; }

        /// <summary>
        /// get/set - The parent group name for this area.
        /// </summary>
        public string GroupName { get; set; }
        #endregion
    }
}
