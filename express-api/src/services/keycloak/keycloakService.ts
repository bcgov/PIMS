import { IKeycloakErrorResponse } from '@/services/keycloak/IKeycloakErrorResponse';
import { IKeycloakRole, IKeycloakRolesResponse } from '@/services/keycloak/IKeycloakRole';
import { IKeycloakUser, IKeycloakUsersResponse } from '@/services/keycloak/IKeycloakUser';
import {
  keycloakRoleSchema,
  keycloakUserRolesSchema,
  keycloakUserSchema,
} from '@/services/keycloak/keycloakSchemas';
import logger from '@/utilities/winstonLogger';

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
  IDIRUserQuery,
} from '@bcgov/citz-imb-kc-css-api';
import rolesServices from '@/services/admin/rolesServices';
import { randomUUID } from 'crypto';
import { AppDataSource } from '@/appDataSource';
import { DeepPartial, In, Not } from 'typeorm';
import userServices from '@/services/admin/usersServices';
import { User, UserStatus } from '@/typeorm/Entities/User';
import { Role } from '@/typeorm/Entities/Role';

/**
 * @description Sync keycloak roles into PIMS roles.
 */
const syncKeycloakRoles = async () => {
  // Gets roles from keycloak
  // For each role
  // If role is in PIMS, update it
  // If not in PIMS, add it
  // If PIMS has roles that aren't in Keycloak, remove them.
  const roles = await KeycloakService.getKeycloakRoles();
  for (const role of roles) {
    const internalRole = await rolesServices.getRoles({ name: role.name });
    console.log(`Got this internalRole: ${internalRole[0]?.Name} for name ${role.name}`);
    if (internalRole.length == 0) {
      const newRole: Role = {
        Id: randomUUID(),
        Name: role.name,
        IsDisabled: false,
        SortOrder: 0,
        KeycloakGroupId: null,
        Description: '',
        IsPublic: false,
        CreatedById: undefined,
        CreatedBy: undefined,
        CreatedOn: undefined,
        UpdatedById: undefined,
        UpdatedBy: undefined,
        UpdatedOn: undefined,
        Users: [],
      };
      await rolesServices.addRole(newRole);
    } else {
      const overwriteRole: DeepPartial<Role> = {
        Id: internalRole[0].Id,
        Name: role.name,
        IsDisabled: false,
        SortOrder: 0,
        KeycloakGroupId: null,
        Description: '',
        IsPublic: false,
        CreatedById: undefined,
        CreatedOn: undefined,
        UpdatedById: undefined,
        UpdatedOn: undefined,
      };
      console.log(`Called updatedrole for ${role.name}`);
      await rolesServices.updateRole(overwriteRole);
    }

    await AppDataSource.getRepository(Role).delete({
      Name: Not(In(roles.map((a) => a.name))),
    });

    return roles;
  }
};

/**
 * @description Fetch a list of groups from Keycloak and their associated role within PIMS
 * @returns {IKeycloakRoles[]}  A list of roles from Keycloak.
 */
const getKeycloakRoles = async () => {
  // Get roles available in Keycloak
  const keycloakRoles: IKeycloakRolesResponse = await getRoles();
  // Return the list of roles
  return keycloakRoles.data;
};

/**
 * @description Get information on a single Keycloak role from the role name.
 * @param   {string}   roleName String name of role in Keycloak
 * @returns {IKeycloakRole}  A single role object.
 * @throws If the role does not exist in Keycloak.
 */
const getKeycloakRole = async (roleName: string) => {
  // Get single role
  const response: IKeycloakRole | IKeycloakErrorResponse = await getRole(roleName);
  // Did the role exist? If not, it will be of type IKeycloakErrorResponse.
  if (!keycloakRoleSchema.safeParse(response).success) {
    const message = `keycloakService.getKeycloakRole: ${
      (response as IKeycloakErrorResponse).message
    }`;
    logger.warn(message);
    throw new Error(message);
  }
  // Return role info
  return response;
};

/**
 * @description Update a role that exists in Keycloak. Create it if it does not exist.
 * @param   {string}   roleName String name of role in Keycloak
 * @param   {string}   newRoleName The name to change the role name to.
 * @returns {IKeycloakRole} The updated role information. Existing role info if cannot be updated.
 * @throws  {Error} If the newRoleName already exists.
 */
const updateKeycloakRole = async (roleName: string, newRoleName: string) => {
  const roleWithNameAlready: IKeycloakRole = await getRole(newRoleName);
  // If it already exists, log the error and return existing role
  if (keycloakRoleSchema.safeParse(roleWithNameAlready).success) {
    const message = `keycloakService.updateKeycloakRole: Role ${newRoleName} already exists`;
    logger.warn(message);
    throw new Error(message);
  }
  const response: IKeycloakRole = await getRole(roleName);
  // Did the role to be changed exist? If not, it will be of type IKeycloakErrorResponse.
  let role: IKeycloakRole;
  if (keycloakRoleSchema.safeParse(response).success) {
    // Already existed. Update the role.
    role = await updateRole(roleName, newRoleName);
  } else {
    // Didn't exist already. Add the role.
    role = await createRole(newRoleName);
  }

  // Return role info
  return role;
};

const syncKeycloakUser = async (keycloakGuid: string) => {
  // Does user exist in Keycloak?
  // Get their existing roles.
  // Does user exist in PIMS
  // If user exists in PIMS...
  // Update the roles in PIMS to match their Keycloak roles
  // If they don't exist in PIMS...
  // Add user and assign their roles
  const kuser = await KeycloakService.getKeycloakUser(keycloakGuid);
  const kroles = await KeycloakService.getKeycloakUserRoles(kuser.username);
  const internalUser = await userServices.getUsers({ username: kuser.username });

  for (const krole of kroles) {
    const internalRole = await rolesServices.getRoles({ name: krole.name });
    if (internalRole.length == 0) {
      const newRole: Role = {
        Id: randomUUID(),
        Name: krole.name,
        IsDisabled: false,
        SortOrder: 0,
        KeycloakGroupId: '',
        Description: '',
        IsPublic: false,
        Users: [],
        CreatedById: undefined,
        CreatedBy: undefined,
        CreatedOn: undefined,
        UpdatedById: undefined,
        UpdatedBy: undefined,
        UpdatedOn: undefined,
      };
      await rolesServices.addRole(newRole);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const newUsersRoles = await AppDataSource.getRepository(Role).find({
    where: { Name: In(kroles.map((a) => a.name)) },
  });

  if (internalUser.length == 0) {
    const newUser: User = {
      Id: randomUUID(),
      CreatedById: undefined,
      CreatedBy: undefined,
      CreatedOn: undefined,
      UpdatedById: undefined,
      UpdatedBy: undefined,
      UpdatedOn: undefined,
      Username: kuser.username,
      DisplayName: kuser.attributes.display_name[0],
      FirstName: kuser.firstName,
      MiddleName: '',
      LastName: kuser.lastName,
      Email: kuser.email,
      Position: '',
      EmailVerified: false,
      IsSystem: false,
      Note: '',
      LastLogin: new Date(),
      ApprovedById: undefined,
      ApprovedBy: undefined,
      ApprovedOn: undefined,
      KeycloakUserId: keycloakGuid,
      Role: undefined,
      RoleId: undefined,
      Agency: undefined,
      AgencyId: undefined,
      Status: UserStatus.Active,
      IsDisabled: false,
    };
    return await userServices.addUser(newUser);
  } else {
    // internalUser[0].UserRoles = newUsersRoles.map((a) => ({
    //   UserId: internalUser[0].Id,
    //   RoleId: a.Id,
    //   User: internalUser[0],
    //   Role: a,
    // }));
    // return await userServices.updateUser(internalUser[0]);
    return;
  }
};

/**
 * @description Retrieves Keycloak users based on the provided filter.
 * @param {IKeycloakUsersFilter} filter The filter to apply when retrieving users.
 * @returns {IKeycloakUser[]} A list of Keycloak users.
 */
const getKeycloakUsers = async (filter: IDIRUserQuery) => {
  // Get all users from Keycloak for IDIR
  // CSS API returns an empty list if no match.
  let users: IKeycloakUser[] = ((await getIDIRUsers(filter)) as IKeycloakUsersResponse).data;
  // Add BCeID if GUID was included.
  if (filter.guid) {
    users = users.concat(((await getBothBCeIDUser(filter.guid)) as IKeycloakUsersResponse).data);
  }
  // Return list of users
  return users;
};

/**
 * @description Retrieves a Keycloak user that matches the provided guid.
 * @param {string} guid The guid of the desired user.
 * @returns {IKeycloakUser} A single Keycloak user.
 * @throws If the user is not found.
 */
const getKeycloakUser = async (guid: string) => {
  // Should be by guid. Only way to guarantee uniqueness.
  const user: IKeycloakUser = (await getKeycloakUsers({ guid: guid }))?.at(0);
  if (keycloakUserSchema.safeParse(user).success) {
    // User found
    return user;
  } else {
    // User not found
    throw new Error(`keycloakService.getKeycloakUser: User ${guid} not found.`);
  }
};

/**
 * @description Retrieves a Keycloak user's roles.
 * @param {string} username The user's username.
 * @returns {IKeycloakRole[]} A list of the user's roles.
 * @throws If the user is not found.
 */
const getKeycloakUserRoles = async (username: string) => {
  const existingRolesResponse: IKeycloakRolesResponse | IKeycloakErrorResponse =
    await getUserRoles(username);
  if (!keycloakUserRolesSchema.safeParse(existingRolesResponse).success) {
    const message = `keycloakService.getKeycloakUserRoles: ${
      (existingRolesResponse as IKeycloakErrorResponse).message
    }`;
    logger.warn(message);
    throw new Error(message);
  }
  return (existingRolesResponse as IKeycloakRolesResponse).data;
};

/**
 * @description Updates a user's roles in Keycloak.
 * @param {string} username The user's username.
 * @param {string[]} roles A list of roles that the user should have.
 * @returns {IKeycloakRole[]} A list of the updated Keycloak roles.
 * @throws If the user does not exist.
 */
const updateKeycloakUserRoles = async (username: string, roles: string[]) => {
  try {
    const existingRolesResponse = await getKeycloakUserRoles(username);

    // User is found in Keycloak.
    const existingRoles: string[] = existingRolesResponse.map((role) => role.name);

    // Find roles that are in Keycloak but are not in new user info.
    const rolesToRemove = existingRoles.filter((existingRole) => !roles.includes(existingRole));
    // Remove old roles
    // No call to remove all as list, so have to loop.
    rolesToRemove.forEach(async (role) => {
      await unassignUserRole(username, role);
    });

    // Find new roles that aren't in Keycloak already.
    const rolesToAdd = roles.filter((newRole) => !existingRoles.includes(newRole));
    // Add new roles
    const updatedRoles: IKeycloakRolesResponse = await assignUserRoles(username, rolesToAdd);

    // Return updated list of roles
    return updatedRoles.data;
  } catch (e: unknown) {
    const message = `keycloakService.updateKeycloakUserRoles: ${
      (e as IKeycloakErrorResponse).message
    }`;
    logger.warn(message);
    throw new Error(message);
  }
};

const KeycloakService = {
  getKeycloakUserRoles,
  syncKeycloakRoles,
  getKeycloakRole,
  getKeycloakRoles,
  updateKeycloakRole,
  syncKeycloakUser,
  getKeycloakUser,
  getKeycloakUsers,
  updateKeycloakUserRoles,
};

export default KeycloakService;
