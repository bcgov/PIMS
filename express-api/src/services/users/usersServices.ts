import { Users } from '@/typeorm/Entities/Users_Roles_Claims';
import { AppDataSource } from '@/appDataSource';
import { KeycloakBCeIDUser, KeycloakIdirUser, KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { z } from 'zod';
import { AccessRequests } from '@/typeorm/Entities/AccessRequests';
import { In } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { Agencies } from '@/typeorm/Entities/Agencies';

interface NormalizedKeycloakUser {
  given_name: string;
  family_name: string;
  username: string;
  guid: string;
}

const getUser = async (nameOrGuid: string): Promise<Users> => {
  const userGuid = z.string().uuid().safeParse(nameOrGuid);
  if (userGuid.success) {
    return AppDataSource.getRepository(Users).findOneBy({
      KeycloakUserId: userGuid.data,
    });
  } else {
    return AppDataSource.getRepository(Users).findOneBy({
      Username: nameOrGuid,
    });
  }
};

const normalizeKeycloakUser = (kcUser: KeycloakUser): NormalizedKeycloakUser => {
  const provider = kcUser.identity_provider;
  const username = kcUser.preferred_username;
  const normalizeUuid = (keycloakUuid: string) =>
    keycloakUuid.toLowerCase().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/g, '$1-$2-$3-$4-$5');
  let user;
  switch (provider) {
    case 'idir':
      user = kcUser as KeycloakIdirUser;
      return {
        given_name: user.given_name,
        family_name: user.family_name,
        username: username,
        guid: normalizeUuid(user.idir_user_guid),
      };
    case 'bceidbasic':
      user = kcUser as KeycloakBCeIDUser;
      return {
        given_name: '',
        family_name: '',
        username: username,
        guid: normalizeUuid(user.bceid_user_guid),
      };
    default:
      throw new Error();
  }
};

const getUserFromKeycloak = async (kcUser: KeycloakUser) => {
  const normalized = normalizeKeycloakUser(kcUser);
  return getUser(normalized.guid ?? normalized.username);
};

const activateUser = async (kcUser: KeycloakUser) => {
  const normalizedUser = normalizeKeycloakUser(kcUser);
  const internalUser = await getUser(kcUser.preferred_username);
  if (!internalUser) {
    const { given_name, family_name, username, guid } = normalizedUser;
    AppDataSource.getRepository(Users).insert({
      Username: username,
      FirstName: given_name,
      LastName: family_name,
      KeycloakUserId: guid,
    });
  } else {
    internalUser.LastLogin = new Date();
    internalUser.KeycloakUserId = normalizedUser.guid;
    AppDataSource.getRepository(Users).update({ Id: internalUser.Id }, internalUser);
  }
};

const getAccessRequest = async (kcUser: KeycloakUser) => {
  const internalUser = await getUserFromKeycloak(kcUser);
  const accessRequest = AppDataSource.getRepository(AccessRequests)
    .createQueryBuilder('AccessRequests')
    .leftJoinAndSelect('AccessRequests.AgencyId', 'Agencies')
    .leftJoinAndSelect('AccessRequests.RoleId', 'Roles')
    .leftJoinAndSelect('AccessRequests.UserId', 'Users')
    .where('AccessRequests.UserId = :userId', { userId: internalUser.Id })
    .andWhere('AccessRequests.Status = :status', { status: 0 })
    .orderBy('AccessRequests.CreatedOn', 'DESC')
    .getOne();
  return accessRequest;
};

const getAccessRequestById = async (requestId: number, kcUser: KeycloakUser) => {
  const accessRequest = await AppDataSource.getRepository(AccessRequests)
    .createQueryBuilder('AccessRequests')
    .leftJoinAndSelect('AccessRequests.AgencyId', 'Agencies')
    .leftJoinAndSelect('AccessRequests.RoleId', 'Roles')
    .leftJoinAndSelect('AccessRequests.UserId', 'Users')
    .where('AccessRequests.Id = :requestId', { requestId: requestId })
    .getOne();
  const internalUser = await getUserFromKeycloak(kcUser);
  if (accessRequest && accessRequest.UserId.Id != internalUser.Id)
    throw new Error('Not authorized.');
  return accessRequest;
};

const deleteAccessRequest = async (accessRequest: AccessRequests) => {
  const existing = await AppDataSource.getRepository(AccessRequests).findOne({
    where: { Id: accessRequest.Id },
  });
  if (!existing) {
    throw new ErrorWithCode('No access request found', 404);
  }
  const deletedRequest = AppDataSource.getRepository(AccessRequests).remove(accessRequest);
  return deletedRequest;
};

const addAccessRequest = async (accessRequest: AccessRequests, kcUser: KeycloakUser) => {
  if (accessRequest == null || accessRequest.AgencyId == null || accessRequest.RoleId == null) {
    throw new Error('Null argument.');
  }
  const internalUser = await getUserFromKeycloak(kcUser);
  accessRequest.UserId = internalUser;
  internalUser.Position = accessRequest.UserId.Position;

  //Iterating through agencies and roles no longer necessary here?

  return AppDataSource.getRepository(AccessRequests).insert(accessRequest);
};

const updateAccessRequest = async (updateRequest: AccessRequests, kcUser: KeycloakUser) => {
  if (updateRequest == null || updateRequest.AgencyId == null || updateRequest.RoleId == null)
    throw new Error('Null argument.');

  const internalUser = await getUserFromKeycloak(kcUser);

  if (updateRequest.UserId.Id != internalUser.Id) throw new Error('Not authorized.');

  const result = await AppDataSource.getRepository(AccessRequests).update(
    { Id: updateRequest.Id },
    updateRequest,
  );
  if (!result.affected) {
    throw new ErrorWithCode('Resource not found.', 404);
  }
  return result.generatedMaps[0];
};

const getAgencies = async (username: string) => {
  const user = await getUser(username);
  const userAgencies = await AppDataSource.getRepository(Users).findOneOrFail({
    relations: {
      Agency: true,
    },
    where: {
      Id: user.Id,
    },
  });
  const agencyId = userAgencies.Agency.Id;
  const children = await AppDataSource.getRepository(Agencies).find({
    where: {
      ParentId: { Id: agencyId },
    },
  });
  // .createQueryBuilder('Agencies')
  // .where('Agencies.ParentId IN (:...ids)', { ids: agencies })
  // .getMany();
  return [agencyId, ...children.map((c) => c.Id)];
};

const getAdministrators = async (agencyIds: string[]) => {
  const admins = await AppDataSource.getRepository(Users).find({
    relations: {
      UserRoles: { Role: { RoleClaims: { Claim: true } } },
      Agency: true,
    },
    where: {
      Agency: In(agencyIds),
      UserRoles: { Role: { RoleClaims: { Claim: { Name: 'System Admin' } } } },
    },
  });
  // .createQueryBuilder('Users')
  // .leftJoinAndSelect('Users.Roles', 'Roles')
  // .leftJoinAndSelect('Roles.Claims', 'Claims')
  // .leftJoinAndSelect('Users.Agencies', 'Agencies')
  // .where('Agencies.Id IN (:...agencyIds)', { agencyIds: agencyIds })
  // .andWhere('Claims.Name = :systemAdmin', { systemAdmin: 'System Admin' })
  // .getMany();

  return admins;
};

const userServices = {
  getUser,
  activateUser,
  getAccessRequest,
  getAccessRequestById,
  deleteAccessRequest,
  addAccessRequest,
  updateAccessRequest,
  getAgencies,
  getAdministrators,
  normalizeKeycloakUser,
};

export default userServices;
