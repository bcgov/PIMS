import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

export const Username = () => {
  const keycloak = useKeycloakWrapper();
  return keycloak.username;
};

export const FindUserType = (username: string) => {
  const isIDIRUser = username.includes('idir');
  const isBCeIDUser = username.includes('bceid');

  if (isIDIRUser) {
    return 'idir';
  } else if (isBCeIDUser) {
    return 'bceid';
  } else {
    return '';
  }
};

export const useGetAccountType = () => {
  const username = Username();
  let userType;
  !!username ? (userType = FindUserType(username)) : (userType = '');

  return userType;
};
