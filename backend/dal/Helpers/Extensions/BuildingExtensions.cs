using System.Linq;
using Microsoft.EntityFrameworkCore;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// BuildingExtensions static class, provides extension methods for buildings.
    /// </summary>
    public static class BuildingExtensions
    {
        /// <summary>
        /// Make a query to determine if the building PID and PIN are unique.
        /// - No two buildings should have the same PID (exception below)
        /// - No two buildings should have the same PIN
        /// - A Crown Land building without a Title will have a PID=0 and a unique PIN.
        /// </summary>
        /// <param name="buildings"></param>
        /// <param name="building"></param>
        /// <exception type="DbUpdateException">The PID and PIN must be unique.</exception>
        public static void ThrowIfNotUnique(this DbSet<Entity.Building> buildings, Entity.Building building)
        {
            var alreadyExists = buildings.Any(p => p.Id != building.Id && p.ParcelId == building.ParcelId && p.LocalId == building.LocalId);
            if (alreadyExists) throw new DbUpdateException("Local ID must be unique within a parcel.");
        }
    }
}
