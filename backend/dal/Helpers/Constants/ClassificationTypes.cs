namespace Pims.Dal.Helpers.Constants
{
    /// <summary>
    /// ClassificationTypes static class, provides constant values for classifications.
    /// </summary>
    public static class ClassificationTypes
    {
        #region Classifications
        public enum Classifications {
            /** The property is currently being used. */
            CoreOperational = 0,
            /** The property is not currently being used but has a strategic purpose. */
            CoreStrategic = 1,
            /** The property is surplus. */
            SurplusActive = 2,
            /** The property is surplus with an encumberance. */
            SurplusEncumbered = 3,
            /** The property has been disposed. */
            Disposed = 4,
            /** The property has been demolished */
            Demolished = 5,
            /** The property has been subdivided */
            Subdivided = 6,
        }
        #endregion
    }
}
