import { User, UserStatus } from '@/typeorm/Entities/User';
import { AppDataSource } from '@/appDataSource';
import { KeycloakBCeIDUser, KeycloakIdirUser, KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { DeepPartial, In } from 'typeorm';
import { Agency } from '@/typeorm/Entities/Agency';
import { randomUUID, UUID } from 'crypto';
import KeycloakService from '@/services/keycloak/keycloakService';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { UserFiltering } from '@/controllers/users/usersSchema';

interface NormalizedKeycloakUser {
  given_name: string;
  family_name: string;
  username: string;
  guid: string;
  email: string;
  display_name: string;
}

const getUser = async (username: string): Promise<User | null> => {
  const user = await AppDataSource.getRepository(User).findOneBy({
    Username: username,
  });
  return user;
};

const normalizeKeycloakUser = (kcUser: KeycloakUser): NormalizedKeycloakUser => {
  const provider = kcUser.identity_provider;
  const normalizeUuid = (keycloakUuid: string) =>
    keycloakUuid.toLowerCase().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/g, '$1-$2-$3-$4-$5');
  let user;
  switch (provider) {
    case 'idir':
      user = kcUser as KeycloakIdirUser;
      return {
        given_name: user.given_name,
        family_name: user.family_name,
        username: kcUser.preferred_username,
        email: kcUser.email,
        display_name: kcUser.display_name,
        guid: normalizeUuid(user.idir_user_guid),
      };
    case 'bceidbasic':
      user = kcUser as KeycloakBCeIDUser;
      return {
        given_name: '',
        family_name: '',
        username: kcUser.preferred_username,
        email: kcUser.email,
        display_name: kcUser.display_name,
        guid: normalizeUuid(user.bceid_user_guid),
      };
    default:
      throw new Error();
  }
};

// const getUserFromKeycloak = async (kcUser: KeycloakUser) => {
//   const normalized = normalizeKeycloakUser(kcUser);
//   return getUser(normalized.guid ?? normalized.username);
// };

const activateUser = async (kcUser: KeycloakUser) => {
  const normalizedUser = normalizeKeycloakUser(kcUser);
  const internalUser = await getUser(kcUser.preferred_username);
  if (!internalUser) {
    const { given_name, family_name, username, guid } = normalizedUser;
    AppDataSource.getRepository(User).insert({
      Username: username,
      FirstName: given_name,
      LastName: family_name,
      KeycloakUserId: guid,
    });
  } else {
    internalUser.LastLogin = new Date();
    internalUser.KeycloakUserId = normalizedUser.guid;
    AppDataSource.getRepository(User).update({ Id: internalUser.Id }, internalUser);
  }
};

// const getAccessRequest = async (kcUser: KeycloakUser) => {
//   const internalUser = await getUserFromKeycloak(kcUser);
//   const accessRequest = AppDataSource.getRepository(AccessRequest)
//     .createQueryBuilder('AccessRequests')
//     .leftJoinAndSelect('AccessRequests.AgencyId', 'Agencies')
//     .leftJoinAndSelect('AccessRequests.RoleId', 'Roles')
//     .leftJoinAndSelect('AccessRequests.UserId', 'Users')
//     .where('AccessRequests.UserId = :userId', { userId: internalUser.Id })
//     .andWhere('AccessRequests.Status = :status', { status: 0 })
//     .orderBy('AccessRequests.CreatedOn', 'DESC')
//     .getOne();
//   return accessRequest;
// };

// const getAccessRequestById = async (requestId: number, kcUser: KeycloakUser) => {
//   const accessRequest = await AppDataSource.getRepository(AccessRequest)
//     .createQueryBuilder('AccessRequests')
//     .leftJoinAndSelect('AccessRequests.AgencyId', 'Agencies')
//     .leftJoinAndSelect('AccessRequests.RoleId', 'Roles')
//     .leftJoinAndSelect('AccessRequests.UserId', 'Users')
//     .where('AccessRequests.Id = :requestId', { requestId: requestId })
//     .getOne();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const normalizedKc = await normalizeKeycloakUser(kcUser);
//   return accessRequest;
// };

// const deleteAccessRequest = async (accessRequest: AccessRequest) => {
//   const existing = await AppDataSource.getRepository(AccessRequest).findOne({
//     where: { Id: accessRequest.Id },
//   });
//   if (!existing) {
//     throw new ErrorWithCode('No access request found', 404);
//   }
//   const deletedRequest = AppDataSource.getRepository(AccessRequest).remove(accessRequest);
//   return deletedRequest;
// };

const addKeycloakUserOnHold = async (
  kcUser: KeycloakUser,
  agencyId: number,
  position: string,
  note: string,
) => {
  if (
    agencyId == null
    // roleId == null
  ) {
    throw new Error('Null argument.');
  }
  //Iterating through agencies and roles no longer necessary here?
  const normalizedKc = normalizeKeycloakUser(kcUser);
  const systemUser = await AppDataSource.getRepository(User).findOne({
    where: { Username: 'system' },
  });
  const result = await AppDataSource.getRepository(User).insert({
    Id: randomUUID(),
    FirstName: normalizedKc.given_name,
    LastName: normalizedKc.family_name,
    Email: normalizedKc.email,
    DisplayName: normalizedKc.display_name,
    KeycloakUserId: normalizedKc.guid,
    Username: normalizedKc.username,
    Status: UserStatus.OnHold,
    IsSystem: false,
    EmailVerified: false,
    IsDisabled: false,
    AgencyId: agencyId,
    Position: position,
    Note: note,
    CreatedById: systemUser.Id,
  });
  return result.generatedMaps[0];
};

// const updateAccessRequest = async (updateRequest: AccessRequest, kcUser: KeycloakUser) => {
//   if (updateRequest == null || updateRequest.AgencyId == null || updateRequest.RoleId == null)
//     throw new Error('Null argument.');

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const normalizedKc = await normalizeKeycloakUser(kcUser);

//   const result = await AppDataSource.getRepository(AccessRequest).update(
//     { Id: updateRequest.Id },
//     updateRequest,
//   );
//   if (!result.affected) {
//     throw new ErrorWithCode('Resource not found.', 404);
//   }
//   return result.generatedMaps[0];
// };

const getAgencies = async (username: string) => {
  const user = await getUser(username);
  const userAgencies = await AppDataSource.getRepository(User).findOneOrFail({
    relations: {
      Agency: true,
    },
    where: {
      Id: user.Id,
    },
  });
  const agencyId = userAgencies.Agency.Id;
  const children = await AppDataSource.getRepository(Agency).find({
    where: {
      ParentId: agencyId,
    },
  });
  return [agencyId, ...children.map((c) => c.Id)];
};

const hasAgencies = async (username: string, agencies: number[]) => {
  const usersAgencies = await getAgencies(username);
  const result = agencies.every((id) => usersAgencies.includes(id));
  return result;
};

const getAdministrators = async (agencyIds: string[]) => {
  const admins = await AppDataSource.getRepository(User).find({
    relations: {
      Role: true,
      Agency: true,
    },
    where: {
      Agency: In(agencyIds),
      Role: { Name: 'System Admin' },
    },
  });
  return admins;
};

const getUsers = async (filter: UserFiltering) => {
  const users = await AppDataSource.getRepository(User).find({
    relations: {
      Agency: true,
      Role: true,
    },
    where: {
      Id: filter.id,
      Username: filter.username,
      DisplayName: filter.displayName,
      LastName: filter.lastName,
      Email: filter.email,
      KeycloakUserId: filter.guid,
      AgencyId: filter.agencyId
        ? In(typeof filter.agencyId === 'number' ? [filter.agencyId] : filter.agencyId)
        : undefined,
      Role: {
        Name: filter.role,
      },
      Position: filter.position,
    },
    take: filter.quantity,
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
  });
  return users;
};

const getUserById = async (id: string) => {
  return AppDataSource.getRepository(User).findOne({
    relations: {
      Agency: true,
      Role: true,
    },
    where: {
      Id: id as UUID,
    },
  });
};

const addUser = async (user: User) => {
  const resource = await AppDataSource.getRepository(User).findOne({ where: { Id: user.Id } });
  if (resource) {
    throw new ErrorWithCode('Resource already exists.', 409);
  }
  const retUser = await AppDataSource.getRepository(User).save(user);
  return retUser;
};

const updateUser = async (user: DeepPartial<User>) => {
  const resource = await AppDataSource.getRepository(User).findOne({ where: { Id: user.Id } });
  if (!resource) {
    throw new ErrorWithCode('Resource does not exist.', 404);
  }
  const retUser = await AppDataSource.getRepository(User).update(user.Id, user);
  return retUser.generatedMaps[0];
};

const deleteUser = async (user: User) => {
  const resource = await AppDataSource.getRepository(User).findOne({ where: { Id: user.Id } });
  if (!resource) {
    throw new ErrorWithCode('Resource does not exist.', 404);
  }
  const retUser = await AppDataSource.getRepository(User).remove(user);
  return retUser;
};

const getKeycloakRoles = async () => {
  const roles = await KeycloakService.getKeycloakRoles();
  return roles.map((a) => a.name);
};

const getKeycloakUserRoles = async (username: string) => {
  const keycloakRoles = await KeycloakService.getKeycloakUserRoles(username);
  return keycloakRoles.map((a) => a.name);
};

const updateKeycloakUserRoles = async (username: string, roleNames: string[]) => {
  const keycloakRoles = await KeycloakService.updateKeycloakUserRoles(username, roleNames);
  await KeycloakService.syncKeycloakUser(username);
  return keycloakRoles.map((a) => a.name);
};

const userServices = {
  getUser,
  activateUser,
  addKeycloakUserOnHold,
  hasAgencies,
  getAgencies,
  getAdministrators,
  normalizeKeycloakUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getKeycloakRoles,
  getKeycloakUserRoles,
  updateKeycloakUserRoles,
  getUserById,
};

export default userServices;
