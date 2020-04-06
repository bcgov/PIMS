import { useKeycloak } from '@react-keycloak/web';
import { SYSTEM_ADMINISTRATOR, AGENCY_ADMINISTRATOR } from 'constants/strings';

function useKeycloakWrapper() {
  const { keycloak } = useKeycloak();
  const hasClaim = (claim?: string) => {
    return !claim || keycloak?.hasResourceRole(claim);
  };
  const hasRole = (role?: string) => {
    return !role || (keycloak?.userInfo as any)?.Groups?.includes(role);
  };
  interface UserInfo {
    Groups: any[];
    given_name: string;
    agencies: string[];
  }
  const roles = () => {
    return (keycloak?.userInfo as UserInfo)?.Groups
      ? [...(keycloak?.userInfo as UserInfo)?.Groups]
      : [];
  };
  const firstName = () => {
    return (keycloak?.userInfo as UserInfo)?.given_name;
  };
  return {
    firstName: firstName(),
    isAdmin: hasRole(SYSTEM_ADMINISTRATOR) || hasRole(AGENCY_ADMINISTRATOR),
    hasRole: hasRole,
    hasClaim: hasClaim,
    obj: keycloak,
    roles: roles(),
    agency: (keycloak?.userInfo as UserInfo)?.agencies?.find(x => x),
  };
}

export default useKeycloakWrapper;
