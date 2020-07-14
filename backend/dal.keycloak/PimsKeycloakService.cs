using MapsterMapper;
using Pims.Dal.Services.Admin;
using Pims.Keycloak;
using System.Security.Claims;

namespace Pims.Dal.Keycloak
{
    /// <summary>
    /// PimsKeycloakService class, provides a way to integrate both PIMS and Keycloak datasources.
    /// </summary>
    public partial class PimsKeycloakService : IPimsKeycloakService
    {
        #region Variable
        private readonly IKeycloakService _keycloakService;
        private readonly IPimsService _pimsService;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        private readonly ClaimsPrincipal _user;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PimsKeycloakService object, initializes with the specified arguments.
        /// </summary>
        /// <param name="keycloakService"></param>
        /// <param name="pimsService"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public PimsKeycloakService(IKeycloakService keycloakService, IPimsService pimsService, IPimsAdminService pimsAdminService, IMapper mapper, ClaimsPrincipal user)
        {
            _keycloakService = keycloakService;
            _pimsService = pimsService;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
            _user = user;
        }
        #endregion
    }
}
