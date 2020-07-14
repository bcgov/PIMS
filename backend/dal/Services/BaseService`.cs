using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// BaseService abstract class, provides a generic service layer to perform CRUD operations on the datasource.
    /// </summary>
    /// <typeparam name="ET"></typeparam>
    public abstract class BaseService<ET> : BaseService
        where ET : BaseEntity
    {
        #region Variables
        #endregion

        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BaseService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public BaseService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<BaseService> logger) : base(dbContext, user, service, logger)
        { }
        #endregion

        #region Methods
        #endregion
    }
}
