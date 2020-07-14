namespace Pims.Api.Mapping.Converters
{
    /// <summary>
    /// ParcelConverter static class, provides converters for parcels.
    /// </summary>
    public static class ParcelConverter
    {
        public static int ConvertPID(string pid)
        {
            int.TryParse(pid?.Replace("-", "") ?? "", out int value);
            return value;
        }
    }
}
