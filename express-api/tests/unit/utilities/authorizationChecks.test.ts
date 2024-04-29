import {
  isAdmin,
  isAuditor,
  canUserEdit,
  isUserDisabled,
  isUserActive,
} from '@/utilities/authorizationChecks';
import { getUser as getUserService } from '@/services/users/usersServices';
import { produceSSO } from '@/../tests/testUtils/factories';

// Mock the getUser function
jest.mock('@/services/users/usersServices', () => ({
  getUser: jest.fn(),
}));

describe('Authorization Checks', () => {
  const mockUser = produceSSO();
  mockUser.client_roles.push('Administrator');

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
