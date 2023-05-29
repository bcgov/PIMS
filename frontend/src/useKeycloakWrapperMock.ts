import { IProperty } from 'actions/parcelsActions';
import { Claims } from 'constants/claims';
import { PropertyTypes } from 'constants/propertyTypes';
import { Roles } from 'constants/roles';

interface IKeycloakMock {
  roles: string[] | Claims[];
  agencyIds: number[];
  agencyId?: number;
  authenticated?: boolean;
  hasClaim: (claim?: Claims | Array<Claims>) => boolean;
  hasRole: (role?: Roles | Array<Roles>) => boolean;
  hasAgency: (agency?: number) => boolean;
  getSystemRoles: () => Array<string>;
  displayName?: string;
  username: string;
  name?: string;
  preferred_username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin: boolean;
  userId: string;
  idir_user_guid: string;
  canUserEditProperty: (property: IProperty | null) => boolean;
  canUserDeleteProperty: (property: IProperty | null) => boolean;
  canUserViewProperty: (property: IProperty | null) => boolean;
  obj: any;
}

/**
 * Used in Jest tests to mock the return values of useKeycloakWrapper.
 * @author Zach Bourque & Brady Mitchell <zachary.bourque@gov.bc.ca | braden.mitchell@gov.bc.ca>
 * @param {string[] | Claims[]} roles - Permissions that the user has.
 * @param {number[]} agencies - Agencies the user belongs to (child agencies).
 * @param {number} agency - Agency the user belongs to.
 * @returns An object that mimiks the return value of useKeycloakWrapper.
 * @example
 * import { Claims } from 'constants/claims';
 * import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
 * import useKeycloakMock from 'useKeycloakWrapperMock';
 *
 * const userRoles: string[] | Claims[] = [];
 * const userAgencies: number[] = [1];
 * const userAgency: number = 1;
 *
 * jest.mock('hooks/useKeycloakWrapper');
 *  (useKeycloakWrapper as jest.Mock).mockReturnValue(
 *    new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
 * );
 */
function useKeycloakMock(
  this: IKeycloakMock,
  roles?: string[] | Claims[],
  agencies?: number[],
  agency?: number,
  authenticated?: boolean,
) {
  this.roles = roles ?? [];
  this.agencyIds = agencies ?? [];
  this.agencyId = agency;
  this.authenticated = authenticated ?? false;

  // hasClaim
  this.hasClaim = (claim?: Claims | Array<Claims>): boolean => {
    if (!claim) {
      return false;
    }
    return typeof claim === 'string'
      ? this.roles?.includes(claim)
      : claim.some((c) => this.roles?.includes(c));
  };

  // hasRole
  this.hasRole = (role?: Roles | Array<Roles>): boolean => {
    if (!role) {
      return false;
    }
    return typeof role === 'string'
      ? this.roles.includes(role as unknown as Claims)
      : role.some((r) => this.roles.includes(r as unknown as Claims));
  };

  // hasAgency
  this.hasAgency = (agency?: number): boolean => {
    return agency !== undefined && agency !== null && this.agencyIds?.includes?.(agency);
  };

  // getSystemRoles
  this.getSystemRoles = (): Array<string> => {
    let systemRoles: string[] = this.roles ?? [];
    systemRoles = systemRoles.filter((s) => s.charAt(0) === s.charAt(0).toUpperCase());
    return systemRoles ?? [];
  };

  // User attributes
  this.displayName = 'displayName';
  this.username = 'tester';
  this.name = 'name';
  this.preferred_username = 'tester';
  this.firstName = 'firstName';
  this.lastName = 'lastName';
  this.email = 'test@test.com';
  this.idir_user_guid = 'test';
  this.userId = 'test';

  // Is Admin
  this.isAdmin =
    this.roles.includes(Roles.SYSTEM_ADMINISTRATOR) ||
    this.roles.includes(Roles.AGENCY_ADMINISTRATOR);

  // canUserEditProperty
  this.canUserEditProperty = (property: IProperty | null): boolean => {
    const ownsProperty = !!property?.agencyId && this.hasAgency(property.agencyId);
    const notInProject = !(
      property &&
      property.projectNumbers &&
      property.projectNumbers.includes('SPP')
    );
    return (
      !!property &&
      (this.roles.includes(Claims.ADMIN_PROPERTIES) ||
        (this.roles.includes(Claims.PROPERTY_EDIT) && ownsProperty && notInProject))
    );
  };

  // canUserDeleteProperty
  this.canUserDeleteProperty = (property: IProperty | null): boolean => {
    const ownsProperty = !!property?.agencyId && this.hasAgency(property.agencyId);
    const notInProject = !(
      property &&
      property.projectNumbers &&
      property.projectNumbers.includes('SPP')
    );
    const isSubdivision = property?.propertyTypeId === PropertyTypes.SUBDIVISION;
    return (
      !!property &&
      (this.roles.includes(Claims.ADMIN_PROPERTIES) ||
        (this.roles.includes(Claims.PROPERTY_DELETE) && ownsProperty && notInProject) ||
        (isSubdivision &&
          this.roles.includes(Claims.PROPERTY_EDIT) &&
          ownsProperty &&
          notInProject))
    );
  };

  // canUserViewProperty
  this.canUserViewProperty = (property: IProperty | null): boolean => {
    return (
      !!property &&
      (this.roles.includes(Claims.ADMIN_PROPERTIES) ||
        (this.roles.includes(Claims.PROPERTY_VIEW) &&
          !!property?.agencyId &&
          this.hasAgency(property.agencyId)))
    );
  };

  // Keycloak obj
  this.obj = { authenticated: this.authenticated };

  return this;
}

export default useKeycloakMock;
