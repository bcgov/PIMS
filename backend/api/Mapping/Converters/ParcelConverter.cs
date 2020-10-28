namespace Pims.Api.Mapping.Converters
{
    /// <summary>
    /// ParcelConverter static class, provides converters for parcels.
    /// </summary>
    public static class ParcelConverter
    {
        /// <summary>
        /// Convert the formatted PID string into a number.
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public static int ConvertPID(string pid)
        {
            int.TryParse(pid?.Replace("-", "") ?? "", out int value);
            return value;
        }
    }
}
