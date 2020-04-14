import { useKeycloak } from '@react-keycloak/web';
import { SYSTEM_ADMINISTRATOR, AGENCY_ADMINISTRATOR } from 'constants/strings';

export interface IUserInfo {
  username: string;
  name?: string;
  preferred_username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  Groups: any[];
  given_name?: string;
  family_name?: string;
  agencies: number[];
}

function useKeycloakWrapper() {
  const { keycloak } = useKeycloak();
  const hasClaim = (claim?: string) => {
    return !claim || keycloak?.hasResourceRole(claim);
  };
  const userInfo = keycloak?.userInfo as IUserInfo;
  const hasRole = (role?: string) => {
    return !role || userInfo?.Groups?.includes(role);
  };
  const roles = () => {
    return userInfo?.Groups ? [...userInfo?.Groups] : [];
  };
  const username = () => {
    return userInfo?.username;
  };
  const displayName = () => {
    return userInfo?.name ?? userInfo?.preferred_username;
  };
  const firstName = () => {
    return userInfo?.firstName ?? userInfo?.given_name;
  };
  const lastName = () => {
    return userInfo?.lastName ?? userInfo?.family_name;
  };
  const email = () => {
    return userInfo?.email;
  };
  return {
    username: username(),
    displayName: displayName(),
    firstName: firstName(),
    lastName: lastName(),
    email: email(),
    isAdmin: hasRole(SYSTEM_ADMINISTRATOR) || hasRole(AGENCY_ADMINISTRATOR),
    hasRole: hasRole,
    hasClaim: hasClaim,
    obj: keycloak,
    roles: roles(),
    agencyId: userInfo?.agencies?.find(x => x),
    hasAgency: (agency: number | undefined) =>
      agency !== undefined ? (keycloak?.userInfo as IUserInfo)?.agencies?.includes(agency) : false,
  };
}

export default useKeycloakWrapper;
