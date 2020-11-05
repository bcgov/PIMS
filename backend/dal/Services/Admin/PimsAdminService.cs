using Microsoft.Extensions.DependencyInjection;
using System;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// PimsAdminService class, provides a encapsulated way to references all the independent services.
    /// </summary>
    public class PimsAdminService : IPimsAdminService
    {
        #region Variables
        private readonly IServiceProvider _serviceProvider;
        private readonly PimsContext _dbContext;
        #endregion

        #region Properties
        public ClaimsPrincipal Principal { get; }
        /// <summary>
        /// get - The user service.
        /// </summary>
        public IUserService User { get { return _serviceProvider.GetService<IUserService>(); } }

        /// <summary>
        /// get - The role service.
        /// </summary>
        public IRoleService Role { get { return _serviceProvider.GetService<IRoleService>(); } }

        /// <summary>
        /// get - The claim service.
        /// </summary>
        public IClaimService Claim { get { return _serviceProvider.GetService<IClaimService>(); } }

        /// <summary>
        /// get - The agency service.
        /// </summary>
        public IAgencyService Agency { get { return _serviceProvider.GetService<IAgencyService>(); } }

        /// <summary>
        /// get - The parcel service.
        /// </summary>
        public IParcelService Parcel { get { return _serviceProvider.GetService<IParcelService>(); } }

        /// <summary>
        /// get - The building service.
        /// </summary>
        public IBuildingService Building { get { return _serviceProvider.GetService<IBuildingService>(); } }

        /// <summary>
        /// get - The address service.
        /// </summary>
        public IAddressService Address { get { return _serviceProvider.GetService<IAddressService>(); } }

        /// <summary>
        /// get - The province service.
        /// </summary>
        public IProvinceService Province { get { return _serviceProvider.GetService<IProvinceService>(); } }

        /// <summary>
        /// get - The administrative area (city, municipality, district, etc.) service.
        /// </summary>
        public IAdministrativeAreaService AdministrativeArea { get { return _serviceProvider.GetService<IAdministrativeAreaService>(); } }

        /// <summary>
        /// get - The building construction type service.
        /// </summary>
        public IBuildingConstructionTypeService BuildingConstructionType { get { return _serviceProvider.GetService<IBuildingConstructionTypeService>(); } }

        /// <summary>
        /// get - The building predominate use service.
        /// </summary>
        public IBuildingPredominateUseService BuildingPredominateUse { get { return _serviceProvider.GetService<IBuildingPredominateUseService>(); } }

        /// <summary>
        /// get - The property classification service.
        /// </summary>
        public IPropertyClassificationService PropertyClassification { get { return _serviceProvider.GetService<IPropertyClassificationService>(); } }

        /// <summary>
        /// get - The property type service.
        /// </summary>
        public IPropertyTypeService PropertyType { get { return _serviceProvider.GetService<IPropertyTypeService>(); } }

        /// <summary>
        /// get - The project service.
        /// </summary>
        public IProjectService Project { get { return _serviceProvider.GetService<IProjectService>(); } }

        /// <summary>
        /// get - The project status service.
        /// </summary>
        public IProjectStatusService ProjectStatus { get { return _serviceProvider.GetService<IProjectStatusService>(); } }

        /// <summary>
        /// get - The project risk service.
        /// </summary>
        public IProjectRiskService ProjectRisk { get { return _serviceProvider.GetService<IProjectRiskService>(); } }

        /// <summary>
        /// get - The project tier level service.
        /// </summary>
        public ITierLevelService TierLevel { get { return _serviceProvider.GetService<ITierLevelService>(); } }

        /// <summary>
        /// get - The project workflow service.
        /// </summary>
        public IWorkflowService Workflow { get { return _serviceProvider.GetService<IWorkflowService>(); } }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PimsAdminService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="serviceProvider"></param>
        public PimsAdminService(ClaimsPrincipal user, IServiceProvider serviceProvider)
        {
            this.Principal = user;
            _serviceProvider = serviceProvider;
            _dbContext = serviceProvider.GetService<PimsContext>();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Wrap the SaveChanges in a transaction for rollback.
        /// </summary>
        /// <returns></returns>
        public int CommitTransaction()
        {
            return _dbContext.CommitTransaction();
        }

        /// <summary>
        /// Get the original value of the specified 'entity'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public T OriginalValue<T>(object entity, string propertyName)
        {
            return this.Address.OriginalValue<T>(entity, propertyName);
        }
        #endregion
    }
}
