using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal.Configuration;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Migrations;
using System;
using System.Linq;
using System.Text.Json;

namespace Pims.Dal
{
    /// <summary>
    /// PimsContext class, provides a data context to manage the datasource for the PIMS application.
    /// </summary>
    public class PimsContext : DbContext
    {
        #region Variables
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Properties
        #region Tables
        public DbSet<AccessRequest> AccessRequests { get; set; }
        public DbSet<Agency> Agencies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Pims.Dal.Entities.Claim> Claims { get; set; }

        #region Properties
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Building> Buildings { get; set; }
        public DbSet<BuildingEvaluation> BuildingEvaluations { get; set; }
        public DbSet<BuildingFiscal> BuildingFiscals { get; set; }
        public DbSet<BuildingConstructionType> BuildingConstructionTypes { get; set; }
        public DbSet<BuildingPredominateUse> BuildingPredominateUses { get; set; }
        public DbSet<BuildingOccupantType> BuildingOccupantTypes { get; set; }
        public DbSet<Parcel> Parcels { get; set; }
        public DbSet<ParcelParcel> ParcelParcels { get; set; }
        public DbSet<ParcelEvaluation> ParcelEvaluations { get; set; }
        public DbSet<ParcelFiscal> ParcelFiscals { get; set; }
        public DbSet<PropertyClassification> PropertyClassifications { get; set; }
        public DbSet<PropertyType> PropertyTypes { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<AdministrativeArea> AdministrativeAreas { get; set; }
        public DbSet<ParcelBuilding> ParcelBuildings { get; set; }
        #endregion

        #region Projects
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectNumber> ProjectNumbers { get; set; }
        public DbSet<ProjectSnapshot> ProjectSnapshots { get; set; }

        public DbSet<ProjectReport> ProjectReports { get; set; }
        public DbSet<ProjectStatus> ProjectStatus { get; set; }
        public DbSet<ProjectRisk> ProjectRisks { get; set; }
        public DbSet<ProjectProperty> ProjectProperties { get; set; }
        public DbSet<ProjectNote> ProjectNotes { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<TierLevel> TierLevels { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Workflow> Workflows { get; set; }
        public DbSet<WorkflowProjectStatus> WorkflowProjectStatus { get; set; }
        public DbSet<NotificationTemplate> NotificationTemplates { get; set; }
        public DbSet<ProjectStatusNotification> ProjectStatusNotifications { get; set; }
        public DbSet<ProjectStatusTransition> ProjectStatusTransitions { get; set; }
        public DbSet<ProjectAgencyResponse> ProjectAgencyResponses { get; set; }
        public DbSet<NotificationQueue> NotificationQueue { get; set; }
        #endregion
        #endregion

        #region Views
        public DbSet<Entities.Views.Property> Properties { get; set; }
        #endregion
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
        /// <param name="httpContextAccessor"></param>
        /// <param name="serializerOptions"></param>
        /// <returns></returns>
        public PimsContext(DbContextOptions<PimsContext> options, IHttpContextAccessor httpContextAccessor = null, IOptions<JsonSerializerOptions> serializerOptions = null) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
            _serializerOptions = serializerOptions.Value;
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
            }

            base.OnConfiguring(optionsBuilder);
        }

        /// <summary>
        /// Creates the datasource.
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyAllConfigurations(typeof(AddressConfiguration), this);

            // TODO: Find a way to move this somewhere else.
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
            foreach (var entry in modifiedEntries)
            {
                if (entry.Entity is BaseEntity entity)
                {
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

        /// <summary>
        /// Deserialize the specified 'json' to the specified type of 'T'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public T Deserialize<T>(string json)
        {
            return JsonSerializer.Deserialize<T>(json, _serializerOptions);
        }

        /// <summary>
        /// Serialize the specified 'item'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="item"></param>
        /// <returns></returns>
        public string Serialize<T>(T item)
        {
            return JsonSerializer.Serialize(item, _serializerOptions);
        }
        #endregion
    }
}
