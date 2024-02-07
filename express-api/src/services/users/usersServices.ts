import { User } from '@/typeorm/Entities/User';
import { AppDataSource } from '@/appDataSource';
import { KeycloakBCeIDUser, KeycloakIdirUser, KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { z } from 'zod';
import { AccessRequest } from '@/typeorm/Entities/AccessRequest';
import { In } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { Agency } from '@/typeorm/Entities/Agency';

interface NormalizedKeycloakUser {
  given_name: string;
  family_name: string;
  username: string;
  guid: string;
}

const getUser = async (nameOrGuid: string): Promise<User> => {
  const userGuid = z.string().uuid().safeParse(nameOrGuid);
  if (userGuid.success) {
    return AppDataSource.getRepository(User).findOneBy({
      KeycloakUserId: userGuid.data,
    });
  } else {
    return AppDataSource.getRepository(User).findOneBy({
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

const getAccessRequest = async (kcUser: KeycloakUser) => {
  const internalUser = await getUserFromKeycloak(kcUser);
  const accessRequest = AppDataSource.getRepository(AccessRequest)
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
  const accessRequest = await AppDataSource.getRepository(AccessRequest)
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

const deleteAccessRequest = async (accessRequest: AccessRequest) => {
  const existing = await AppDataSource.getRepository(AccessRequest).findOne({
    where: { Id: accessRequest.Id },
  });
  if (!existing) {
    throw new ErrorWithCode('No access request found', 404);
  }
  const deletedRequest = AppDataSource.getRepository(AccessRequest).remove(accessRequest);
  return deletedRequest;
};

const addAccessRequest = async (accessRequest: AccessRequest, kcUser: KeycloakUser) => {
  if (accessRequest == null || accessRequest.AgencyId == null || accessRequest.RoleId == null) {
    throw new Error('Null argument.');
  }
  const internalUser = await getUserFromKeycloak(kcUser);
  accessRequest.UserId = internalUser;
  internalUser.Position = accessRequest.UserId.Position;

  //Iterating through agencies and roles no longer necessary here?

  return AppDataSource.getRepository(AccessRequest).insert(accessRequest);
};

const updateAccessRequest = async (updateRequest: AccessRequest, kcUser: KeycloakUser) => {
  if (updateRequest == null || updateRequest.AgencyId == null || updateRequest.RoleId == null)
    throw new Error('Null argument.');

  const internalUser = await getUserFromKeycloak(kcUser);

  if (updateRequest.UserId.Id != internalUser.Id) throw new Error('Not authorized.');

  const result = await AppDataSource.getRepository(AccessRequest).update(
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
      ParentId: { Id: agencyId },
    },
  });
  return [agencyId, ...children.map((c) => c.Id)];
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
