import { assignUserRoles } from '@bcgov/citz-imb-kc-css-api';
import fs from 'fs';
import data from '../extractResults.json';
import { getMappedRole } from './roleMappingConversion';

// Seemingly needed so it identifies keys as strings
const typedData = data as Record<string, string[]>;

const importRoles = async () => {
  const usernames: string[] = Object.keys(typedData);

  await Promise.all(usernames.map(async (username) => {
    // Get old roles
    const oldRoles = typedData[username];
    // Map old roles to new roles
    // and convert to Set to remove duplicates
    const newRoles: Set<string> = new Set(oldRoles.map((role: string) => getMappedRole(role)))
    try {
      // If there is more than one new role, we have to choose the most permissive
      // Logic should work if there's only one role as well.
      switch (true) {
        case newRoles.has('admin'):
          await assignUserRoles(username, ['admin']);
          break;
        case newRoles.has('auditor'):
          await assignUserRoles(username, ['auditor']);
          break;
        case newRoles.has('general user'):
          await assignUserRoles(username, ['general user']);
          break;
        default:
          break;
      }

    } catch (e) {
      console.error(e);
    }
  }))
}

importRoles();
