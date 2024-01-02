import * as adminAccessRequests from './accessRequests/accessRequestsController';
import * as adminAdministrativeAreas from './administrativeAreas/administrativeAreasController';
import * as adminAgencies from './agencies/agenciesController';
import * as adminRoles from './roles/rolesController';
import * as adminClaims from './claims/claimsController';
import * as adminUsers from './users/usersController';

const admin = {
  ...adminAccessRequests,
  ...adminAdministrativeAreas,
  ...adminAgencies,
  ...adminRoles,
  ...adminClaims,
  ...adminUsers,
};

export default admin;
