import { IProperty } from 'actions/parcelsActions';
import { Roles } from 'constants/roles';
import useKeycloakWrapper, { IUserInfo } from 'hooks/useKeycloakWrapper';

jest.mock('@react-keycloak/web', () => ({
  useKeycloak: () => ({
    keycloak: {
      tokenParsed: {
        displayName: 'John',
        username: 'jdoe',
        name: 'John',
        preferred_username: 'Johnny',
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@netscape.com',
        groups: ['admin-properties', 'property-edit'],
        roles: ['admin-properties', 'property-edit', 'System Administrator'],
        given_name: 'John',
        family_name: 'Doe',
        agencies: [0, 1],
        client_roles: ['admin-properties', 'System Administrator'],
        identity_provider: 'idir',
        idir_username: 'jdoe',
        bceid_username: '',
        idir_user_guid: 'jdoe',
        bceid_user_guid: '',
      } as IUserInfo,
    },
  }),
}));

jest.mock('react-redux', () => ({
  useSelector: () => [0, 1],
}));

jest.mock('react', () => ({
  useMemo: (fn: () => any, params: any[]) => {
    if (params) {
      return fn();
    }
    return fn();
  },
}));

const property: IProperty = {
  id: 0,
  agencyId: 0,
  agency: 'Mock Agency',
  latitude: 0,
  longitude: 0,
  isSensitive: false,
};

const keycloak = useKeycloakWrapper();

describe('useKeycloakWrapper Tests', () => {
  it('Retrieve username property as IDIR user', () => {
    const result = keycloak.username;
    expect(result).toBe('jdoe@idir');
  });

  it('Retrieve user ID', () => {
    const result = keycloak.userId;
    expect(result).toBe('jdoe');
  });

  it('Retrieve display name', () => {
    const result = keycloak.displayName;
    expect(result).toBe('John Doe');
  });

  it('Retrieve first name', () => {
    const result = keycloak.firstName;
    expect(result).toBe('John');
  });

  it('Retrieve last name', () => {
    const result = keycloak.lastName;
    expect(result).toBe('Doe');
  });

  it('Retrieve email', () => {
    const result = keycloak.email;
    expect(result).toBe('jdoe@netscape.com');
  });

  it('Check if user is an admin', () => {
    const result = keycloak.isAdmin;
    expect(result).toBe(true);
  });

  it('Check if user has matching claim', () => {
    let result = keycloak.hasClaim('admin-properties');
    expect(result).toBe(true);
    result = keycloak.hasClaim('property-delete');
    expect(result).toBe(false);
    result = keycloak.hasClaim();
    expect(result).toBe(false);
  });

  it('Check if user has matching role', () => {
    let result = keycloak.hasRole('System Administrator');
    expect(result).toBe(true);
    result = keycloak.hasRole(Roles.SRES);
    expect(result).toBe(false);
    result = keycloak.hasRole();
    expect(result).toBe(false);
  });

  it('Retrieve list of roles for user', () => {
    const result = keycloak.roles;
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('admin-properties');
    expect(result[1]).toBe('System Administrator');
  });

  it('Retrieve list of system roles for user', () => {
    const result = keycloak.systemRoles;
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('System Administrator');
  });

  it('Retrieve main agency for user', () => {
    const result = keycloak.agencyId;
    expect(result).toBe(0);
  });

  it('Retrieve all agencies for user', () => {
    const result = keycloak.agencyIds;
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(1);
  });

  it('Check if user has matching agency', () => {
    let result = keycloak.hasAgency(0);
    expect(result).toBe(true);
    result = keycloak.hasAgency(2);
    expect(result).toBe(false);
  });

  it('Check if user can edit property', () => {
    const result = keycloak.canUserEditProperty(property);
    expect(result).toBe(true);
  });

  it('Check if user can delete property', () => {
    const result = keycloak.canUserDeleteProperty(property);
    expect(result).toBe(true);
  });

  it('Check if user can view property', () => {
    const result = keycloak.canUserViewProperty(property);
    expect(result).toBe(true);
  });
});
