using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a Parcel.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="code"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.Agency CreateAgency(int id = 1, string code = "AG", string name = "Agency")
        {
            var agency = new Entity.Agency(code, name)
            {
                Id = id,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            return agency;
        }
    }
}
