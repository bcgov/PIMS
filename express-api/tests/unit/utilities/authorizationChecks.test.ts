import { canUserEdit, isUserDisabled, isUserActive } from '@/utilities/authorizationChecks';
import { getUser as getUserService } from '@/services/users/usersServices';
import { producePimsRequestUser, produceSSO } from '@/../tests/testUtils/factories';
import { Roles } from '@/constants/roles';

// Mock the getUser function
jest.mock('@/services/users/usersServices', () => ({
  getUser: jest.fn(),
}));

describe('Authorization Checks', () => {
  const mockUser = producePimsRequestUser({ RoleId: Roles.ADMIN, hasOneOfRoles: () => true });
  const mockKeycloakUser = produceSSO();

  beforeEach(() => {
    jest.clearAllMocks();
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

    const result = await isUserDisabled(mockKeycloakUser);
    expect(result).toBe(true);
  });

  it('isUserActive should return true if user is active', async () => {
    const mockActiveUser = {
      Status: 'Active',
    };
    // Mock the getUser function to return the mockDisabledUser
    (getUserService as jest.Mock).mockResolvedValue(mockActiveUser);

    const result = await isUserActive(mockKeycloakUser);
    expect(result).toBe(true);
  });
});
