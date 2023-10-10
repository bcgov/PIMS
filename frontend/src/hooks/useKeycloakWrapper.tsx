import { useKeycloak } from '@react-keycloak/web';
import { IProperty } from 'actions/parcelsActions';
import { Claims } from 'constants/claims';
import { PropertyTypes } from 'constants/propertyTypes';
import { Roles } from 'constants/roles';
import _ from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { convertToGuidFormat } from 'utils/formatGuid';

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
  client_roles: string[];
  identity_provider: string;
  idir_username: string;
  bceid_username: string;
  idir_user_guid: string;
  bceid_user_guid: string;
}

/**
 * IKeycloak interface, represents the keycloak object for the authenticated user.
 */
export interface IKeycloak {
  obj: any;
  displayName?: string;
  username: string;
  userId: string;
  name?: string;
  preferred_username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles: string[];
  systemRoles: string[];
  agencyId?: number;
  isAdmin: boolean;
  hasRole(role?: string | Array<string>): boolean;
  hasClaim(claim?: string | Array<string>): boolean;
  hasAgency(agency?: number): boolean;
  agencyIds: number[];
  canUserEditProperty: (property: IProperty | null) => boolean;
  canUserViewProperty: (property: IProperty | null) => boolean;
  canUserDeleteProperty: (property: IProperty | null) => boolean;
  idir_user_guid: string;
}

/**
 * Provides extension methods to interact with the `keycloak` object.
 */
export function useKeycloakWrapper(): IKeycloak {
  const { keycloak: keycloakInstance } = useKeycloak();
  const userInfo = keycloakInstance.tokenParsed as IUserInfo;
  //@ts-ignore
  const usersAgencies: number[] = useSelector((state) => state.usersAgencies);
  /**
   * Determine if the user has the specified 'claim'
   * @param claim - The name of the claim
   */
  const hasClaim = (claim?: Claims | Array<Claims>): boolean => {
    if (!claim) {
      return false;
    }
    return typeof claim === 'string'
      ? userInfo?.client_roles?.some((role) => role === claim)
      : claim.some((c) => userInfo?.client_roles?.some((role) => role === c));
  };

  /**
   * Determine if the user belongs to the specified 'role'
   * @param role - The role name or an array of role name
   */
  const hasRole = (role?: Roles | Array<Roles>): boolean => {
    if (!role) {
      return false;
    }
    return typeof role === 'string'
      ? userInfo?.client_roles?.includes(role)
      : role.some((r) => userInfo?.client_roles?.includes(r));
  };

  /**
   * Determine if the user belongs to the specified 'agency'
   * @param agency - The agency name
   */
  const hasAgency = (agency?: number): boolean => {
    return agency !== undefined && agency !== null && usersAgencies?.includes?.(agency);
  };

  /**
   * Return an array of roles the user belongs to
   */
  const roles = (): Array<string> => {
    return userInfo?.client_roles ? [...userInfo?.client_roles] : [];
  };

  /**
   * Return an array of only system roles from Keycloak (where the role name begins with a captial letter)
   * that the user belongs to
   */
  const getSystemRoles = (): Array<string> => {
    let systemRoles: string[] = userInfo?.client_roles ?? [];
    systemRoles = systemRoles.filter((s) => s.charAt(0) === s.charAt(0).toUpperCase());
    return systemRoles ?? [];
  };

  /**
   * Return the user's username
   */
  const username = (): string => {
    if (userInfo?.identity_provider === 'idir') {
      return userInfo?.idir_username + '@idir';
    }
    if (userInfo?.identity_provider === 'bceidbusiness') {
      return userInfo?.bceid_username + '@bceid';
    }
    if (userInfo?.identity_provider === 'bceidboth') {
      return userInfo?.bceid_username + '@bceid';
    }
    return userInfo?.username;
  };

  const userId = (): string => {
    if (userInfo?.identity_provider === 'idir') {
      return userInfo?.idir_user_guid;
    }
    if (userInfo?.identity_provider.includes('bceid')) {
      return userInfo?.bceid_user_guid;
    }
    return '';
  };

  /**
   * Return the user's display name using the first and last name from Keycloak
   */
  const displayName = (): string | undefined => {
    return userInfo?.given_name + ' ' + userInfo?.family_name ?? userInfo?.preferred_username;
  };

  /**
   * Return the user's first name
   */
  const firstName = (): string | undefined => {
    if (userInfo?.given_name === '') return userInfo?.displayName?.slice(2).split(' ')[0];
    return userInfo?.given_name ?? userInfo?.displayName?.slice(2).split(' ')[0];
  };

  /**
   * Return the user's last name
   */
  const lastName = (): string | undefined => {
    if (userInfo?.family_name === '') return userInfo?.displayName?.slice(2).split(' ')[1];
    return userInfo?.family_name ?? userInfo?.displayName?.slice(2).split(' ')[1];
  };

  /**
   * Return the user's email
   */
  const email = (): string | undefined => {
    return userInfo?.email;
  };

  const agencies = (): number[] => {
    return usersAgencies;
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
    return (
      !!property &&
      (isAdmin || (canEdit && ownsProperty && notInProject)) &&
      !hasClaim(Claims.VIEW_ONLY_PROPERTIES)
    );
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
        (isSubdivision && canEdit && ownsProperty && notInProject)) &&
      !hasClaim(Claims.VIEW_ONLY_PROPERTIES)
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

  return useMemo(
    () => ({
      obj: { ...keycloakInstance, authenticated: !!keycloakInstance.token },
      username: username(),
      userId: userId(),
      displayName: displayName(),
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      isAdmin: hasRole(Roles.SYSTEM_ADMINISTRATOR) || hasRole(Roles.AGENCY_ADMINISTRATOR),
      roles: roles(),
      systemRoles: getSystemRoles(),
      agencyId: agencies()[0],
      hasRole,
      hasClaim,
      hasAgency,
      agencyIds: agencies(),
      canUserEditProperty,
      canUserDeleteProperty,
      canUserViewProperty,
      idir_user_guid: userInfo?.idir_user_guid && convertToGuidFormat(userInfo.idir_user_guid),
    }),
    [keycloakInstance, usersAgencies.length],
  );
}

export default useKeycloakWrapper;
