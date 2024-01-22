import { AppDataSource } from '@/appDataSource';
import { Users } from '@/typeorm/Entities/Users';
import { UUID } from 'crypto';

interface IUserFiltering {
  page?: number;
  quantity?: number;
  username?: string;
  displayName?: string;
  lastName?: string;
  firstName?: string;
  email: string;
  agency: string;
  role: string;
  position: string;
  id: UUID;
  isDisabled: boolean;
}

const getUsers = async (filter: IUserFiltering) => {
  const users = await AppDataSource.getRepository(Users).find({
    relations: {
      Agencies: true,
      Roles: true,
    },
    where: {
      Id: filter.id,
      Username: filter.username,
      DisplayName: filter.displayName,
      LastName: filter.lastName,
      Email: filter.email,
      Agencies: {
        Name: filter.agency,
      },
      Roles: {
        Name: filter.role,
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
  return retUser;
};

const deleteUser = async (user: Users) => {
  const retUser = await AppDataSource.getRepository(Users).remove(user);
  return retUser;
};

const userServices = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};

export default userServices;
