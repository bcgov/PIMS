using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;

namespace Pims.Dal
{
    /// <summary>
    /// ServiceCollectionExtensions static class, provides extension methods for IServiceCollection.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add PimsService and PimsAdminService objects to dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddPimsServices(this IServiceCollection services)
        {
            return services
                .AddPimsService()
                .AddPimsAdminService();
        }

        /// <summary>
        /// Add PimsService objects to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddPimsService(this IServiceCollection services)
        {
            services.AddScoped<IPimsService, PimsService>();
            services.AddScoped<Services.IPropertyService, Services.PropertyService>();
            services.AddScoped<Services.ILookupService, Services.LookupService>();
            services.AddScoped<Services.IBuildingService, Services.BuildingService>();
            services.AddScoped<Services.IParcelService, Services.ParcelService>();
            services.AddScoped<Services.IProjectService, Services.ProjectService>();
            services.AddScoped<Services.IProjectReportService, Services.ProjectReportService>();
            services.AddScoped<Services.IUserService, Services.UserService>();
            services.AddScoped<Services.ITaskService, Services.TaskService>();
            services.AddScoped<Services.IWorkflowService, Services.WorkflowService>();
            services.AddScoped<Services.INotificationTemplateService, Services.NotificationTemplateService>();
            services.AddScoped<Services.IProjectNotificationService, Services.ProjectNotificationService>();
            services.AddScoped<Services.IProjectStatusService, Services.ProjectStatusService>();
            services.AddScoped<Services.INotificationQueueService, Services.NotificationQueueService>();
            return services; // TODO: Use reflection to find all services.
        }

        /// <summary>
        /// Add PimsAdminService objects to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddPimsAdminService(this IServiceCollection services)
        {
            services.AddScoped<Services.Admin.IPimsAdminService, Services.Admin.PimsAdminService>();
            services.AddScoped<Services.Admin.IClaimService, Services.Admin.ClaimService>();
            services.AddScoped<Services.Admin.IAgencyService, Services.Admin.AgencyService>();
            services.AddScoped<Services.Admin.IAddressService, Services.Admin.AddressService>();
            services.AddScoped<Services.Admin.IBuildingService, Services.Admin.BuildingService>();
            services.AddScoped<Services.Admin.IAdministrativeAreaService, Services.Admin.AdministrativeAreaService>();
            services.AddScoped<Services.Admin.IParcelService, Services.Admin.ParcelService>();
            services.AddScoped<Services.Admin.IProvinceService, Services.Admin.ProvinceService>();
            services.AddScoped<Services.Admin.IRoleService, Services.Admin.RoleService>();
            services.AddScoped<Services.Admin.IUserService, Services.Admin.UserService>();
            services.AddScoped<Services.Admin.IBuildingConstructionTypeService, Services.Admin.BuildingConstructionTypeService>();
            services.AddScoped<Services.Admin.IBuildingPredominateUseService, Services.Admin.BuildingPredominateUseService>();
            services.AddScoped<Services.Admin.IPropertyClassificationService, Services.Admin.PropertyClassificationService>();
            services.AddScoped<Services.Admin.IPropertyTypeService, Services.Admin.PropertyTypeService>();
            services.AddScoped<Services.Admin.IProjectService, Services.Admin.ProjectService>();
            services.AddScoped<Services.Admin.IProjectStatusService, Services.Admin.ProjectStatusService>();
            services.AddScoped<Services.Admin.IProjectRiskService, Services.Admin.ProjectRiskService>();
            services.AddScoped<Services.Admin.ITierLevelService, Services.Admin.TierLevelService>();
            services.AddScoped<Services.Admin.IWorkflowService, Services.Admin.WorkflowService>();
            return services; // TODO: Use reflection to find all services.
        }

        /// <summary>
        /// Add the PIMS DB Context to the service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="env"></param>
        /// <param name="connectionString"></param>
        /// <returns></returns>
        public static IServiceCollection AddPimsContext(this IServiceCollection services, IHostEnvironment env, string connectionString)
        {
            if (String.IsNullOrWhiteSpace(connectionString)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(connectionString));

            services.AddDbContext<PimsContext>(options =>
            {
                var sql = options.UseSqlServer(connectionString, options =>
                {
                    options.CommandTimeout((int)TimeSpan.FromMinutes(5).TotalSeconds);
                    options.UseNetTopologySuite();
                });
                if (!env.IsProduction())
                {
                    var debugLoggerFactory = LoggerFactory.Create(builder => { builder.AddDebug(); }); // NOSONAR
                    sql.UseLoggerFactory(debugLoggerFactory);
                    options.EnableSensitiveDataLogging();
                }
            });

            return services;
        }
    }
}
