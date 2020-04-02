using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using Pims.Dal;
using Pims.Dal.Security;

namespace Pims.Core.Test
{
    public static class DatabaseHelper
    {
        #region Methods
        /// <summary>
        /// Creates an instance of a PimsContext and initializes it with the specified 'user'.
        /// Uses an InMemoryDatabase instead of relational.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="permission"></param>
        /// <param name="ensureDeleted"></param>
        /// <returns></returns>
        public static PimsContext CreatePimsContext(this TestHelper helper, Permissions permission, bool ensureDeleted = false)
        {
            var user = PrincipalHelper.CreateForPermission(permission);
            return helper.CreatePimsContext(user, ensureDeleted);
        }

        /// <summary>
        /// Creates an instance of a PimsContext and initializes it with the specified 'user'.
        /// Uses an InMemoryDatabase instead of relational.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="permission"></param>
        /// <param name="dbName"></param>
        /// <param name="ensureDeleted"></param>
        /// <returns></returns>
        public static PimsContext CreatePimsContext(this TestHelper helper, Permissions permission, string dbName = "pims-test", bool ensureDeleted = false)
        {
            var user = PrincipalHelper.CreateForPermission(permission);
            return helper.CreatePimsContext(user, dbName, ensureDeleted);
        }

        /// <summary>
        /// Creates an instance of a PimsContext and initializes it with the specified 'user'.
        /// Uses an InMemoryDatabase instead of relational.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <param name="ensureDeleted"></param>
        /// <returns></returns>
        public static PimsContext CreatePimsContext(this TestHelper helper, ClaimsPrincipal user, bool ensureDeleted = false)
        {
            return helper.CreatePimsContext(user, "pims-test", ensureDeleted);
        }

        /// <summary>
        /// Creates an instance of a PimsContext and initializes it with the specified 'user'.
        /// Uses an InMemoryDatabase instead of relational.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <param name="dbName"></param>
        /// <param name="ensureDeleted"></param>
        /// <returns></returns>
        public static PimsContext CreatePimsContext(this TestHelper helper, ClaimsPrincipal user, string dbName = "pims-test", bool ensureDeleted = false)
        {
            helper.AddSingleton(user);
            var options = new DbContextOptionsBuilder<PimsContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            var contextAccessor = new Mock<IHttpContextAccessor>();
            var httpContext = helper.CreateHttpContext(user);
            contextAccessor.Setup(m => m.HttpContext).Returns(httpContext);

            var context = new PimsContext(options, contextAccessor.Object);

            if (ensureDeleted) context.Database.EnsureDeleted();

            return context;
        }

        /// <summary>
        /// Initialize the PimsContext with the specified data in 'entities'.
        /// Initializes the database with default data to support other tables.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <param name="dbName"></param>
        /// <returns></returns>
        public static PimsContext InitializeDatabase(this TestHelper helper, ClaimsPrincipal user, string dbName = "pims-test")
        {
            var context = helper.CreatePimsContext(user, dbName, true);
            context.AddData(EntityHelper.CreatePropertyClassifications());
            context.AddData(EntityHelper.CreatePropertyStatuses());
            context.AddData(EntityHelper.CreateProvinces());
            context.AddData(EntityHelper.CreateCities());
            context.AddData(EntityHelper.CreateRoles());
            context.AddData(EntityHelper.CreateBuildingPredominateUses());
            context.AddData(EntityHelper.CreateBuildingConstructionTypes());
            context.AddData(EntityHelper.CreateAgencies());
            return context;
        }

        /// <summary>
        /// Add to the PimsContext 'context' with the specified data in 'entities'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="context"></param>
        /// <param name="entities"></param>
        /// <returns></returns>
        public static PimsContext AddData<T>(this PimsContext context, IEnumerable<T> entities)
            where T : class
        {
            context.Set<T>().AddRange(entities);
            context.SaveChanges();
            return context;
        }

        /// <summary>
        /// Add to the PimsContext 'context' with the specified data in 'entities'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="context"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static PimsContext AddOne<T>(this PimsContext context, params T[] entity)
            where T : class
        {
            context.Set<T>().AddRange(entity);
            context.SaveChanges();
            return context;
        }

        /// <summary>
        /// Ensure the database has been deleted.
        /// </summary>
        /// <param name="context"></param>
        public static void EnsureDeleted(this PimsContext context)
        {
            context.Database.EnsureDeleted();
        }

        /// <summary>
        /// Ensure the database has been deleted.
        /// </summary>
        /// <param name="helper"></param>
        public static void EnsureDeleted(this TestHelper helper)
        {
            var context = helper.GetService<PimsContext>();
            context.EnsureDeleted();
        }
        #endregion
    }
}
