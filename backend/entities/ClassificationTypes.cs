namespace Pims.Dal.Entities
{
    /// <summary>
    /// ClassificationTypes enum, provides compile-time values for classifications.
    /// TODO: Property classifications are database driven, this enum hardcodes these values and isn't ideal.
    /// </summary>
    public enum ClassificationTypes
    {
        /// <summary>
        /// The property is currently being used.
        /// </summary>
        CoreOperational = 0,
        /// <summary>
        /// The property is not currently being used but has a strategic purpose.
        /// </summary>
        CoreStrategic = 1,
        /// <summary>
        /// The property is surplus.
        /// </summary>
        SurplusActive = 2,
        /// <summary>
        /// The property is surplus with an encumberance.
        /// </summary>
        SurplusEncumbered = 3,
        /// <summary>
        /// The property has been disposed.
        /// </summary>
        Disposed = 4,
        /// <summary>
        /// The property has been demolished
        /// </summary>
        Demolished = 5,
        /// <summary>
        /// The property has been subdivided
        /// </summary>
        Subdivided = 6,
    }
}
