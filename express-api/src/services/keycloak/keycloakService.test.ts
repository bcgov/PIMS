import { IKeycloakUser } from '@/services/keycloak/IKeycloakUser';
import KeycloakService from './keycloakService';
import {
  getRoles,
  getRole,
  updateRole,
  createRole,
  getIDIRUsers,
  getBothBCeIDUser,
  getUserRoles,
  assignUserRoles,
  unassignUserRole,
} from '@bcgov/citz-imb-kc-css-api';
import { faker } from '@faker-js/faker';

jest.mock('@bcgov/citz-imb-kc-css-api');

const mockUser: IKeycloakUser = {
  email: faker.internet.email(),
  username: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  attributes: {
    display_name: [faker.person.fullName()],
  },
};

describe('UNIT - KeycloakService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('syncKeycloakRoles', () => {
    // TODO: finish tests when function is implemented
    xit('should add roles to PIMS if they do not already exist', () => {});
    xit('should remove roles from PIMS if they do not exist in Keycloak', () => {});
    xit('should update roles in PIMS if they do not match what is in Keycloak', () => {});
  });

  describe('getKeycloakRoles', () => {
    it('should return a list of possible roles', async () => {
      // Mock the call to Keycloak
      const expectedRoles = { data: ['role1', 'role2'] };
      (getRoles as jest.Mock).mockResolvedValue(expectedRoles);

      const roles = await KeycloakService.getKeycloakRoles();
      expect(getRoles).toHaveBeenCalledTimes(1);
      expect(roles).toEqual(expectedRoles.data);
    });
  });

  describe('getKeycloakRole', () => {
    it('should return the role information when it exists', async () => {
      // Mock the call to Keycloak
      const expectedRole = { name: 'role1' };
      (getRole as jest.Mock).mockResolvedValue(expectedRole);

      const role = await KeycloakService.getKeycloakRole('role1');
      expect(getRole).toHaveBeenCalledTimes(1);
      expect(role).toEqual(expectedRole);
    });

    it('should throw an error when the role does not exist', async () => {
      // Mock the call to Keycloak
      const expectedResponse = { message: 'role does not exist' };
      (getRole as jest.Mock).mockResolvedValue(expectedResponse);

      expect(KeycloakService.getKeycloakRole('role1')).rejects.toThrow(`keycloakService.getKeycloakRole: role does not exist`);
      expect(getRole).toHaveBeenCalledTimes(1);

    });
  });

  describe('updateKeycloakRole', () => {
    it('should return the updated role when the original role already exists', async () => {
      // Mock the call to Keycloak
      const existingRole = { name: 'role1' };
      const newRole = { name: 'newRoleName' };
      (getRole as jest.Mock)
        .mockResolvedValueOnce({ message: 'error' })
        .mockResolvedValueOnce(existingRole);
      (updateRole as jest.Mock).mockResolvedValue(newRole);

      const response = await KeycloakService.updateKeycloakRole('role1', 'newRoleName');
      expect(getRole).toHaveBeenCalledTimes(2);
      expect(updateRole).toHaveBeenCalledTimes(1);
      expect(response).toEqual(newRole);
    });

    it('should return the created role when neither original or new role exists', async () => {
      // Mock the call to Keycloak
      const newRole = { name: 'newRoleName' };
      (getRole as jest.Mock).mockResolvedValue({ message: 'error' });
      (createRole as jest.Mock).mockResolvedValue(newRole);

      const response = await KeycloakService.updateKeycloakRole('role1', 'newRoleName');
      expect(getRole).toHaveBeenCalledTimes(2);
      expect(createRole).toHaveBeenCalledTimes(1);
      expect(response).toEqual(newRole);
    });

    it('should throw an error if the new role name already exists', async () => {
      // Mock the call to Keycloak
      (getRole as jest.Mock).mockResolvedValue({ name: 'newRoleName' });

      expect(
        KeycloakService.updateKeycloakRole('role1', 'newRoleName')
      ).rejects.toThrow(`keycloakService.updateKeycloakRole: Role newRoleName already exists`);
            expect(getRole).toHaveBeenCalledTimes(1);
      expect(getRole).toHaveBeenCalledWith('newRoleName');
    });
  });

  describe('syncKeycloakUser', () => {
    // TODO: finish tests when function is implemented
    xit('should add update user roles in PIMS', () => {});
    xit('should add user and roles in PIMS if they do not exist', () => {});
  });

  describe('getKeycloakUsers', () => {
    it('should return a list of users', async () => {
      (getIDIRUsers as jest.Mock).mockResolvedValue({ data: [mockUser] });
      (getBothBCeIDUser as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const response = await KeycloakService.getKeycloakUsers({
        firstName: mockUser.firstName,
        guid: mockUser.username,
      });
      expect(getIDIRUsers).toHaveBeenCalledTimes(1);
      expect(getBothBCeIDUser).toHaveBeenCalledTimes(1);
      expect(response).toEqual([mockUser, mockUser]);
    });
  });

  describe('getKeycloakUser', () => {
    it('should return a single user by email', async () => {
      (getIDIRUsers as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const response = await KeycloakService.getKeycloakUser(mockUser.email);
      expect(getIDIRUsers).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockUser);
    });

    it('should return a single user by guid', async () => {
      (getIDIRUsers as jest.Mock).mockResolvedValue({ data: [] });
      (getBothBCeIDUser as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const response = await KeycloakService.getKeycloakUser(mockUser.username);
      expect(getIDIRUsers).toHaveBeenCalledTimes(1);
      expect(getBothBCeIDUser).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockUser);
    });
  });

  describe('updateKeycloakUserRoles', () => {});
});
