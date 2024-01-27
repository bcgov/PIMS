import { AppDataSource } from '@/appDataSource';
import { Users } from '@/typeorm/Entities/Users_Agencies_Roles_Claims';
import { UserFiltering } from '../../controllers/admin/users/usersSchema';
import KeycloakService from '../keycloak/keycloakService';

const getUsers = async (filter: UserFiltering) => {
  const users = await AppDataSource.getRepository(Users).find({
    relations: {
      UserAgencies: true,
      UserRoles: { Role: true },
    },
    where: {
      Id: filter.id,
      Username: filter.username,
      DisplayName: filter.displayName,
      LastName: filter.lastName,
      Email: filter.email,
      UserAgencies: {
        Agency: {
          Name: filter.agency,
        },
      },
      UserRoles: {
        Role: {
          Name: filter.role,
        },
      },
      IsDisabled: filter.isDisabled,
      Position: filter.position,
    },
    take: filter.quantity,
    skip: filter.page,
  });
  return users;
};

//type AddUserPayload = Users & { agencies: Agencies[]; roles: Roles[] };

const addUser = async (user: Users) => {
  const retUser = await AppDataSource.getRepository(Users).save(user);
  return retUser;
};

const updateUser = async (user: Users) => {
  const retUser = await AppDataSource.getRepository(Users).update(user.Id, user);
  return retUser.generatedMaps[0];
};

const deleteUser = async (user: Users) => {
  const retUser = await AppDataSource.getRepository(Users).remove(user);
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
};

export default userServices;
