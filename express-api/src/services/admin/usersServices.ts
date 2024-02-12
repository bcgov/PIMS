import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';
import { UserFiltering } from '../../controllers/admin/users/usersSchema';
import KeycloakService from '../keycloak/keycloakService';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { UUID } from 'crypto';

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
      Agency: {
        Name: filter.agency,
      },
      Role: {
        Name: filter.role,
      },
      IsDisabled: filter.isDisabled,
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

const updateUser = async (user: User) => {
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
  return keycloakRoles.map((a) => a.name);
};

const userServices = {
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
