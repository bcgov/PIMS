import { getRoles, getUsersWithRole } from '@bcgov/citz-imb-kc-css-api';
import fs from 'fs';

interface IRole {
  name: string;
  composite: boolean;
}

interface IRolesResponse {
  data: IRole[];
}

interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

// Gets list of roles from integration
const getRoleList = async () => {
  const result: IRolesResponse = await getRoles();
  // Filter out base claims
  return result.data.filter(role => role.composite);
}

// Create the user/roles object
const createUserRolesObject = async () => {
  const roleUsers: Record<string, IUser[]> = {};

  // Get roles
  const roleList = await getRoleList();

  // Get all users for each role
  // Runs all calls in parallel
  await Promise.all(roleList.map(async (role) => {
    const users = await getUsersWithRole(role.name);
    roleUsers[role.name] = users.data;
  }))

  // Convert data to an object of users with a list of all their current roles
  const usersWithRoles: Record<string, string[]> = {};
  Object.keys(roleUsers).forEach(role => {
    // For each user with that role
    roleUsers[role].forEach((user: IUser) => {
      // Does this already exist in usersWithRoles?
      if (usersWithRoles[user.username]) {
        // Just add this role to the list
        usersWithRoles[user.username].push(role);
      } else {
        usersWithRoles[user.username] = [role];
      }
    })
  })
  return usersWithRoles;
}

// Save the roles to a file
const saveResultToFile = async () => {
  const result = await createUserRolesObject();
  fs.writeFile('extractResults.json', JSON.stringify(result, null, 2), (err) => {
    if (err) {
      console.error('Error writing file', err);
    } else {
      console.log('Successfully wrote file: extractResults.json');
    }
  });
}

// Call the saving file function
saveResultToFile();
