using System.Security.Claims;
using MapsterMapper;
using Microsoft.Extensions.Logging;
using Pims.Dal.Services.Admin;
using Pims.Keycloak;

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
        private readonly ILogger _logger;
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
        /// <param name="logger"></param>
        public PimsKeycloakService(IKeycloakService keycloakService, IPimsService pimsService, IPimsAdminService pimsAdminService, IMapper mapper, ILogger<PimsKeycloakService> logger, ClaimsPrincipal user)
        {
            _keycloakService = keycloakService;
            _pimsService = pimsService;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
            _logger = logger;
            _user = user;
        }
        #endregion
    }
}
