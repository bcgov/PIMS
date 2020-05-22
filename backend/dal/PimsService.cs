using System;
using System.Security.Claims;
using Microsoft.Extensions.DependencyInjection;
using Pims.Dal.Services;

namespace Pims.Dal
{
    /// <summary>
    /// PimsService class, provides a encapsulated way to references all the independent services.
    /// </summary>
    public class PimsService : IPimsService
    {
        #region Variables
        private readonly IServiceProvider _serviceProvider;
        #endregion

        #region Properties
        /// <summary>
        /// get - The user calling the service.
        /// </summary>
        public ClaimsPrincipal Principal { get; }

        /// <summary>
        /// get - The property services.
        /// </summary>
        public IPropertyService Property { get { return _serviceProvider.GetService<IPropertyService>(); } }

        /// <summary>
        /// get - The building services.
        /// </summary>
        public IBuildingService Building { get { return _serviceProvider.GetService<IBuildingService>(); } }

        /// <summary>
        /// get - The project services.
        /// </summary>
        public IProjectService Project { get { return _serviceProvider.GetService<IProjectService>(); } }

        /// <summary>
        /// get - The lookup services.
        /// </summary>
        public ILookupService Lookup { get { return _serviceProvider.GetService<ILookupService>(); } }

        /// <summary>
        /// get - The parcel services.
        /// </summary>
        public IParcelService Parcel { get { return _serviceProvider.GetService<IParcelService>(); } }

        /// <summary>
        /// get - The user services.
        /// </summary>
        public IUserService User { get { return _serviceProvider.GetService<IUserService>(); } }

        /// <summary>
        /// get - The task services.
        /// </summary>
        public ITaskService Task { get { return _serviceProvider.GetService<ITaskService>(); } }

        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PimsService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="serviceProvider"></param>
        public PimsService(ClaimsPrincipal user, IServiceProvider serviceProvider)
        {
            this.Principal = user;
            _serviceProvider = serviceProvider;
        }
        #endregion

        #region Methods
        #endregion
    }
}
