namespace Pims.Dal.Entities
{
    /// <summary>
    /// LeasedLandTypes enum, provides the valid building leased land types that can be used.
    /// </summary>
    public enum LeasedLandTypes
    {
        /// <summary>
        /// The ministry owns the land the building is on.
        /// </summary>
        Owned = 0,
        /// <summary>
        /// The ministry leases the land the building is on.
        /// </summary>
        Leased = 1,
        /// <summary>
        /// The relationship with the land is complex.
        /// </summary>
        Other = 2,
    }
}
