using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// AddressService class, provides a service layer to administrate addresss within the datasource.
    /// </summary>
    public class AddressService : BaseService<Address>, IAddressService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AddressService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public AddressService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<AddressService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Updates the specified address in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Update(Address entity)
        {
            // TODO: Check for system-administrator role.
            entity.ThrowIfNull(nameof(entity));

            var address = this.Context.Addresses.Find(entity.Id);
            if (address == null) throw new KeyNotFoundException();

            this.Context.Entry(address).CurrentValues.SetValues(entity);
            base.Update(address);
        }

        /// <summary>
        /// Remove the specified address from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(Address entity)
        {
            // TODO: Check for system-administrator role.
            entity.ThrowIfNull(nameof(entity));

            var address = this.Context.Addresses.Find(entity.Id);
            if (address == null) throw new KeyNotFoundException();

            this.Context.Entry(address).CurrentValues.SetValues(entity);
            base.Remove(address);
        }
        #endregion
    }
}
