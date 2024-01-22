import { AppDataSource } from '@/appDataSource';
import KeycloakService from '../keycloak/keycloakService';
import { In } from 'typeorm/find-options/operator/In';
import { Roles } from '@/typeorm/Entities/Roles';

const getRoles = async () => {
  const roles = await KeycloakService.getKeycloakRoles();
  return AppDataSource.getRepository(Roles).findBy({
    Name: In(roles.map((a) => a.name)),
  });
};

const getUserRoles = async (username: string) => {
  const keycloakRoles = await KeycloakService.getKeycloakUserRoles(username);
  return keycloakRoles.map((a) => a.name);
};

const updateUserRoles = async (username: string, roleNames: string[]) => {
  const keycloakRoles = await KeycloakService.updateKeycloakUserRoles(username, roleNames);
  return keycloakRoles.map((a) => a.name);
};

const rolesServices = {
  getRoles,
  getUserRoles,
  updateUserRoles,
};

export default rolesServices;
