using System;
using Microsoft.EntityFrameworkCore;
using Pims.Dal;

namespace Pims.Api.Test.Helpers
{
    public static class DatabaseHelper
    {
        /// <summary>
        /// Provides a quick way to create a new instance of a PimsContext object.
        /// </summary>
        /// <returns></returns>
        public static PimsContext GetDatabaseContext ()
        {
            var options = new DbContextOptionsBuilder<PimsContext> ()
                .UseInMemoryDatabase (databaseName: Guid.NewGuid ().ToString ())
                .Options;
            var databaseContext = new PimsContext (options);
            databaseContext.Database.EnsureCreated ();
            return databaseContext;
        }
    }
}
