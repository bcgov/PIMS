using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using Pims.Core.Helpers;
using Pims.Dal;
using Pims.Dal.Security;

namespace Pims.Core.Test
{
    /// <summary>
    /// DatabaseHelper static class, provides helper functions for the TestHelper when interacting with a Database.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class DatabaseHelper
    {
        #region Methods
        /// <summary>
        /// Creates an instance of a PimsContext and initializes it with the specified 'user'.
        /// Uses an InMemoryDatabase instead of relational.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="dbName"></param>
        /// <param name="permission"></param>
        /// <param name="ensureDeleted"></param>
        /// <returns></returns>
        public static PimsContext CreatePimsContext(this TestHelper helper, string dbName, Permissions permission, bool ensureDeleted = false)
        {
            var user = PrincipalHelper.CreateForPermission(permission);
            return helper.CreatePimsContext(dbName, user, ensureDeleted);
        }

        /// <summary>
        /// Creates an instance of a PimsContext and initializes it with the specified 'user'.
        /// Uses an InMemoryDatabase instead of relational.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="dbName"></param>
        /// <param name="user"></param>
        /// <param name="ensureDeleted"></param>
        /// <returns></returns>
        public static PimsContext CreatePimsContext(this TestHelper helper, string dbName, ClaimsPrincipal user, bool ensureDeleted = false)
        {
            // Generate a randome database name.
            if (String.IsNullOrWhiteSpace(dbName)) dbName = StringHelper.Generate(10);

            helper.AddSingleton(user);
            var options = new DbContextOptionsBuilder<PimsContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .ConfigureWarnings(m => m.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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
        /// <param name="dbName"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static PimsContext InitializeDatabase(this TestHelper helper, string dbName, ClaimsPrincipal user)
        {
            var context = helper.CreatePimsContext(dbName, user, true);
            context.AddData(EntityHelper.CreatePropertyClassifications());
            context.AddData(EntityHelper.CreatePropertyStatuses());
            context.AddData(EntityHelper.CreateProvinces());
            context.AddData(EntityHelper.CreateCities());
            context.AddData(EntityHelper.CreateRoles());
            context.AddData(EntityHelper.CreateBuildingPredominateUses());
            context.AddData(EntityHelper.CreateBuildingConstructionTypes());
            context.AddData(EntityHelper.CreateBuildingOccupantTypes());
            context.AddData(EntityHelper.CreateAgencies());
            return context;
        }

        /// <summary>
        /// Save the changes that are in memory context to the datasource.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static PimsContext SaveChanges(this PimsContext context)
        {
            context.SaveChanges();
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
