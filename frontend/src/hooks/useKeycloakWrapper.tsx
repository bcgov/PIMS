import { useKeycloak } from '@react-keycloak/web';
import { IProperty } from 'actions/parcelsActions';
import { Roles } from 'constants/roles';
import { Claims } from 'constants/claims';
import _ from 'lodash';
import { PropertyTypes } from 'constants/propertyTypes';

/**
 * IUserInfo interface, represents the userinfo provided by keycloak.
 */
export interface IUserInfo {
  displayName?: string;
  username: string;
  name?: string;
  preferred_username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  groups: string[];
  roles: string[];
  given_name?: string;
  family_name?: string;
  agencies: number[];
}

/**
 * IKeycloak interface, represents the keycloak object for the authenticated user.
 */
export interface IKeycloak {
  obj: any;
  displayName?: string;
  username: string;
  name?: string;
  preferred_username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles: string[];
  agencyId?: number;
  isAdmin: boolean;
  hasRole(role?: string | Array<string>): boolean;
  hasClaim(claim?: string | Array<string>): boolean;
  hasAgency(agency?: number): boolean;
  agencyIds: number[];
  canUserEditProperty: (property: IProperty | null) => boolean;
  canUserViewProperty: (property: IProperty | null) => boolean;
  canUserDeleteProperty: (property: IProperty | null) => boolean;
}

/**
 * Provides extension methods to interact with the `keycloak` object.
 */
export function useKeycloakWrapper(): IKeycloak {
  const { keycloak } = useKeycloak();
  const userInfo = keycloak?.userInfo as IUserInfo;

  /**
   * Determine if the user has the specified 'claim'
   * @param claim - The name of the claim
   */
  const hasClaim = (claim?: string | Array<string>): boolean => {
    return (
      claim !== undefined &&
      claim !== null &&
      (typeof claim === 'string'
        ? userInfo?.roles?.includes(claim)
        : claim.some(c => userInfo?.roles?.includes(c)))
    );
  };

  /**
   * Determine if the user belongs to the specified 'role'
   * @param role - The role name or an array of role name
   */
  const hasRole = (role?: string | Array<string>): boolean => {
    return (
      role !== undefined &&
      role !== null &&
      (typeof role === 'string'
        ? userInfo?.groups?.includes(role)
        : role.some(r => userInfo?.groups?.includes(r)))
    );
  };

  /**
   * Determine if the user belongs to the specified 'agency'
   * @param agency - The agency name
   */
  const hasAgency = (agency?: number): boolean => {
    return agency !== undefined && agency !== null && userInfo?.agencies?.includes(agency);
  };

  /**
   * Return an array of roles the user belongs to
   */
  const roles = (): Array<string> => {
    return userInfo?.groups ? [...userInfo?.groups] : [];
  };

  /**
   * Return the user's username
   */
  const username = (): string => {
    return userInfo?.username;
  };

  /**
   * Return the user's display name
   */
  const displayName = (): string | undefined => {
    return userInfo?.name ?? userInfo?.preferred_username;
  };

  /**
   * Return the user's first name
   */
  const firstName = (): string | undefined => {
    return userInfo?.firstName ?? userInfo?.given_name;
  };

  /**
   * Return the user's last name
   */
  const lastName = (): string | undefined => {
    return userInfo?.lastName ?? userInfo?.family_name;
  };

  /**
   * Return the user's email
   */
  const email = (): string | undefined => {
    return userInfo?.email;
  };

  const isAdmin = hasClaim(Claims.ADMIN_PROPERTIES);
  const canEdit = hasClaim(Claims.PROPERTY_EDIT);
  const canDelete = hasClaim(Claims.PROPERTY_DELETE);

  /**
   * Return true if the user has permissions to edit this property
   * NOTE: this function will be true for MOST of PIMS, but there may be exceptions for certain cases.
   */
  const canUserEditProperty = (property: IProperty | null): boolean => {
    const ownsProperty = !!property?.agencyId && hasAgency(property.agencyId);
    const notInProject = !_.some(property?.projectNumbers ?? '', _.method('includes', 'SPP'));
    return !!property && (isAdmin || (canEdit && ownsProperty && notInProject));
  };

  /**
   * Return true if the user has permissions to delete this property
   * NOTE: this function will be true for MOST of PIMS, but there may be exceptions for certain cases.
   */
  const canUserDeleteProperty = (property: IProperty | null): boolean => {
    const ownsProperty = !!property?.agencyId && hasAgency(property.agencyId);
    const notInProject = !_.some(property?.projectNumbers ?? '', _.method('includes', 'SPP'));
    const isSubdivision = property?.propertyTypeId === PropertyTypes.SUBDIVISION;
    return (
      !!property &&
      (isAdmin ||
        (canDelete && ownsProperty && notInProject) ||
        (isSubdivision && canEdit && ownsProperty && notInProject))
    );
  };

  /**
   * Return true if the user has permissions to edit this property
   * NOTE: this function will be true for MOST of PIMS, but there may be exceptions for certain cases.
   */
  const canUserViewProperty = (property: IProperty | null): boolean => {
    return (
      !!property &&
      (hasClaim(Claims.ADMIN_PROPERTIES) ||
        (hasClaim(Claims.PROPERTY_VIEW) && !!property?.agencyId && hasAgency(property.agencyId)))
    );
  };

  return {
    obj: keycloak,
    username: username(),
    displayName: displayName(),
    firstName: firstName(),
    lastName: lastName(),
    email: email(),
    isAdmin: hasRole(Roles.SYSTEM_ADMINISTRATOR) || hasRole(Roles.AGENCY_ADMINISTRATOR),
    roles: roles(),
    agencyId: userInfo?.agencies?.find(x => x),
    hasRole: hasRole,
    hasClaim: hasClaim,
    hasAgency: hasAgency,
    agencyIds: userInfo?.agencies,
    canUserEditProperty,
    canUserDeleteProperty,
    canUserViewProperty,
  };
}

export default useKeycloakWrapper;
