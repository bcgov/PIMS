import { useKeycloak } from '@react-keycloak/web';
import { Roles } from 'constants/roles';

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
interface IKeycloak {
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
}

/**
 * Provides extension methods to interact with the `keycloak` object.
 */
function useKeycloakWrapper(): IKeycloak {
  const { keycloak } = useKeycloak();
  const userInfo = keycloak?.userInfo as IUserInfo;

  /**
   * Determine if the user has the specified 'claim'
   * @param claim - The name of the claim
   */
  const hasClaim = (claim?: string | Array<string>): boolean => {
    return (
      claim !== undefined &&
      claim != null &&
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
      role != null &&
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
    return agency !== undefined && agency != null && userInfo?.agencies?.includes(agency);
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
  };
}

export default useKeycloakWrapper;
