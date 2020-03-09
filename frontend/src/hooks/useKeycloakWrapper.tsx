import { useKeycloak } from '@react-keycloak/web';
import { ADMINISTRATOR } from 'constants/strings';

function useKeycloakWrapper() {
  const { keycloak } = useKeycloak();
  const isAdmin = () => {
    return hasRole(ADMINISTRATOR);
  };
  const hasRole = (role?: string) => {
    return !role || keycloak?.realmAccess?.roles.includes(role);
  };
  const firstName = () => {
    return keycloak?.profile?.firstName;
  };
  return {
    firstName: firstName(),
    isAdmin: isAdmin,
    hasRole: hasRole,
    obj: keycloak,
  };
}

export default useKeycloakWrapper;
