using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Pims.Dal.Configuration;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Helpers.Migrations;

namespace Pims.Dal
{
    /// <summary>
    /// PimsContext class, provides a data context to manage the datasource for the Geo-spatial application.
    /// </summary>
    public class PimsContext : DbContext
    {
        #region Properties
        public DbSet<AccessRequest> AccessRequests { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Agency> Agencies { get; set; }
        public DbSet<Building> Buildings { get; set; }
        public DbSet<BuildingEvaluation> BuildingEvaluations { get; set; }
        public DbSet<BuildingConstructionType> BuildingConstructionTypes { get; set; }
        public DbSet<BuildingPredominateUse> BuildingPredominateUses { get; set; }
        public DbSet<BuildingOccupantType> BuildingOccupantTypes { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Parcel> Parcels { get; set; }
        public DbSet<ParcelEvaluation> ParcelEvaluations { get; set; }
        public DbSet<PropertyClassification> PropertyClassifications { get; set; }
        public DbSet<PropertyStatus> PropertyStatus { get; set; }
        public DbSet<PropertyType> PropertyTypes { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Pims.Dal.Entities.Claim> Claims { get; set; }

        private readonly IHttpContextAccessor _httpContextAccessor;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PimsContext class.
        /// </summary>
        /// <returns></returns>
        public PimsContext()
        {

        }

        /// <summary>
        /// Creates a new instance of a PimsContext class.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public PimsContext(DbContextOptions<PimsContext> options, IHttpContextAccessor httpContextAccessor = null) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Configures the DbContext with the specified options.
        /// </summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.EnableSensitiveDataLogging();
                //optionsBuilder.UseInMemoryDatabase("Schedule", options => { });
            }

            base.OnConfiguring(optionsBuilder);
        }

        /// <summary>
        /// Creates the datasource.
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyAllConfigurations(typeof(AddressConfiguration));

            // modelBuilder.Properties<DateTime> ()
            //     .Configure (m =>
            //     {
            //         m.HasColumnType ("DATETIME2");
            //         if (m.Name == nameof (BaseEntity.CreatedOn))
            //         {
            //             m.DefaultValueSql = "GETUTCDATE()";
            //         }
            //     });

            // foreach (var property in modelBuilder.Model.GetEntityTypes ()
            //         .SelectMany (m => m.GetProperties ())
            //         .Where (p => p.ClrType == typeof (DateTime)))
            // {
            //     if (property.ClrType == typeof (DateTime))
            //     {
            //         property.Relational ().ColumnType = "DATETIME2";

            //         if (property.Name == nameof (BaseEntity.CreatedOn))
            //         {
            //             property.Relational ().DefaultValueSql = "GETUTCDATE()";
            //         }
            //     }
            // }

            base.OnModelCreating(modelBuilder);
        }

        /// <summary>
        /// Save the entities with who created them or updated them.
        /// </summary>
        /// <returns></returns>
        public override int SaveChanges()
        {
            // get entries that are being Added or Updated
            var modifiedEntries = ChangeTracker.Entries()
                    .Where(x => (x.State == EntityState.Added || x.State == EntityState.Modified));
            var userId = _httpContextAccessor.HttpContext.User.GetUserId();
            if (userId != null)
            {
                foreach (var entry in modifiedEntries)
                {
                    var entity = entry.Entity as BaseEntity;

                    if (entry.State == EntityState.Added)
                    {
                        entity.CreatedById = userId;
                        entity.CreatedOn = DateTime.UtcNow;
                    }
                    else if (entry.State != EntityState.Deleted)
                    {
                        entity.UpdatedById = userId;
                        entity.UpdatedOn = DateTime.UtcNow;
                    }
                }
            }

            return base.SaveChanges();
        }

        /// <summary>
        /// Wrap the save changes in a transaction for rollback.
        /// </summary>
        /// <returns></returns>
        public int CommitTransaction()
        {
            var result = 0;
            using (var transaction = this.Database.BeginTransaction())
            {
                try
                {
                    result = this.SaveChanges();
                    transaction.Commit();
                }
                catch (DbUpdateException)
                {
                    transaction.Rollback();
                    throw;
                }
            }
            return result;
        }
        #endregion
    }
}
