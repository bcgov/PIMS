import {
  isAdmin,
  isAuditor,
  canUserEdit,
  isUserDisabled,
  isUserActive,
} from '@/utilities/authorizationChecks';
import { faker } from '@faker-js/faker';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { getUser as getUserService } from '@/services/users/usersServices';

// Mock the getUser function
jest.mock('@/services/users/usersServices', () => ({
  getUser: jest.fn(),
}));

describe('Authorization Checks', () => {
  const mockUser: SSOUser = {
    name: faker.string.alphanumeric(),
    preferred_username: faker.string.alphanumeric(),
    email: faker.internet.email(),
    display_name: faker.string.alphanumeric(),
    identity_provider: 'idir',
    guid: faker.string.uuid(),
    username: faker.string.alphanumeric(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    client_roles: ['Administrator'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('isAdmin should return true if user has ADMIN role', () => {
    expect(isAdmin(mockUser)).toBe(true);
  });

  it('isAuditor should return false if user does not have AUDITOR role', () => {
    expect(isAuditor(mockUser)).toBe(false);
  });

  it('canUserEdit should return true if user has GENERAL_USER or ADMIN role', () => {
    expect(canUserEdit(mockUser)).toBe(true);
  });

  it('isUserDisabled should return true if user is disabled', async () => {
    const mockDisabledUser = {
      IsDisabled: true,
    };
    // Mock the getUser function to return the mockDisabledUser
    (getUserService as jest.Mock).mockResolvedValue(mockDisabledUser);

    const result = await isUserDisabled(mockUser);
    expect(result).toBe(true);
  });

  it('isUserActive should return true if user is active', async () => {
    const mockActiveUser = {
      Status: 'Active',
    };
    // Mock the getUser function to return the mockDisabledUser
    (getUserService as jest.Mock).mockResolvedValue(mockActiveUser);

    const result = await isUserActive(mockUser);
    expect(result).toBe(true);
  });
});
