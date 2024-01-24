import { Users } from '@/typeorm/Entities/Users';
import { AppDataSource } from '@/appDataSource';
import { KeycloakBCeIDUser, KeycloakIdirUser, KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { z } from 'zod';
import { AccessRequests } from '@/typeorm/Entities/AccessRequests';
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
    return AppDataSource.getRepository(Users).findOneByOrFail({
      KeycloakUserId: userGuid.data,
    });
  } else {
    return AppDataSource.getRepository(Users).findOneByOrFail({
      Username: nameOrGuid,
    });
  }
};

const normalizeKeycloakUser = (kcUser: KeycloakUser): NormalizedKeycloakUser => {
  const provider = kcUser.identity_provider;
  let user;
  switch (provider) {
    case 'idir':
      user = kcUser as KeycloakIdirUser;
      return {
        given_name: user.given_name,
        family_name: user.family_name,
        username: user.idir_username,
        guid: user.idir_user_guid,
      };
    case 'bceidbasic':
      user = kcUser as KeycloakBCeIDUser;
      return {
        given_name: '',
        family_name: '',
        username: user.bceid_username,
        guid: user.bceid_user_guid,
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
  const internalUser = await getUser(kcUser.display_name);
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
  if (accessRequest && accessRequest.UserId.Id != internalUser.Id) throw new Error('Not authorized.');
  return accessRequest;
};

const deleteAccessRequest = async (accessRequest: AccessRequests) => {
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
  if (updateRequest == null || updateRequest.AgencyId == null || updateRequest.RoleId)
    throw new Error('Null argument.');

  const internalUser = await getUserFromKeycloak(kcUser);

  if (updateRequest.UserId.Id != internalUser.Id) throw new Error('Not authorized.');

  return AppDataSource.getRepository(AccessRequests).update(
    { Id: updateRequest.Id },
    updateRequest,
  );
};

const getAgencies = async (username: string) => {
  const user = await getUser(username);
  const userAgencies = await AppDataSource.getRepository(Users)
    .createQueryBuilder('Users')
    .leftJoinAndSelect('Users.Agencies', 'Agencies')
    .where('User.Id = :userId', { userId: user.Id })
    .getOneOrFail();
  const agencies = userAgencies.Agencies.map((a) => a.Id);
  const children = await AppDataSource.getRepository(Agencies)
    .createQueryBuilder('Agencies')
    .where('Agencies.ParentId IN (:...ids)', { ids: agencies })
    .getMany();
  return [...agencies, ...children];
};

const getAdministrators = async (agencyIds: number[]) => {
  const admins = await AppDataSource.getRepository(Users)
    .createQueryBuilder('Users')
    .leftJoinAndSelect('Users.Roles', 'Roles')
    .leftJoinAndSelect('Roles.Claims', 'Claims')
    .leftJoinAndSelect('Users.Agencies', 'Agencies')
    .where('Agencies.Id IN (:...agencyIds)', { agencyIds: agencyIds })
    .andWhere('Claims.Name = :systemAdmin', { systemAdmin: 'System Admin' })
    .getMany();

  return admins;
};

const userServices = {
  activateUser,
  getAccessRequest,
  getAccessRequestById,
  deleteAccessRequest,
  addAccessRequest,
  updateAccessRequest,
  getAgencies,
  getAdministrators,
};

export default userServices;
