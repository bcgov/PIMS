import { User, UserStatus } from "./UserEntity";
import { AppDataSource } from "./appDataSource";
import fs from 'fs';

interface KeycloakUser {
  data: {
    username: string;
    email: string;
  }[],
  message?: string;
}

const { CSS_API_CLIENT_ID, CSS_API_CLIENT_SECRET, SSO_ENVIRONMENT } = process.env;
const CSS_API_URL = "https://api.loginproxy.gov.bc.ca/api/v1"

const getKeycloakUser = async (guid: string, token: string, type: 'idir' | 'basic-business-bceid') => {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Create request url.
  const url = `${CSS_API_URL}/${SSO_ENVIRONMENT}/${type}/users?guid=${guid.replaceAll('-', '')}`;

  // Fetch request.
  const response = await fetch(
    url,
    {
      method: "GET",
      headers,
    }
  );
  return response.json();
}

const updateUsernames = async () => {
  // Get Keycloak access token
  const body = {
    grant_type: "client_credentials",
  };

  const headers = {
    Authorization: `Basic ${btoa(
      `${CSS_API_CLIENT_ID}:${CSS_API_CLIENT_SECRET}`
    )}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(`${CSS_API_URL}/token`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.text();
  const access_token = JSON.parse(data).access_token;

  // Initialize database connection
  await AppDataSource.initialize()
    .then(() => {
      console.log('Database connection has been initialized');
    })
    .catch((err?: Error) => {
      console.error('Error during data source initialization. With error: ', err);
    });
  const userRepo = AppDataSource.getRepository(User);

  // Get all users
  const users = await userRepo.find();
  console.log(`Total Users: ${users.length}`)
  let successes = 0;
  let failures = 0;

  interface ErrorQueue {
    message: string;
    user: any;
    action: string;
  }
  const errors: ErrorQueue[] = [];

  const ignoredUsernames = ['system', 'service-account'];

  // For each user
  await Promise.all(users.map(async (user) => {
    try {
      // Checking for ignored users
      if (ignoredUsernames.includes(user.Username)) {
        return;
      }
      // Get their details from Keycloak
      // This must loop. Sometimes the request fails for no reason, but then succeeds on later attempts.
      // A request where they are not found doesn't have an error message, just empty data array.
      let keycloakUser: KeycloakUser;
      do {
        try {
          keycloakUser = user.Username.includes('idir')
          ? await getKeycloakUser(user.KeycloakUserId, access_token, 'idir')
          : await getKeycloakUser(user.KeycloakUserId, access_token, 'basic-business-bceid');
        } catch (e) {
          keycloakUser = e;
        }
      } while (!keycloakUser.data)
      // Only if some user was returned
      if (keycloakUser.data && keycloakUser.data.length > 0) {
        // Update the database table with their proper username
        await userRepo.update({
          Id: user.Id
        },
        {
          Username: keycloakUser.data.at(0).username,
        })
        console.log(`New username: ${user.Username} -> ${keycloakUser.data.at(0).username}`)
        successes++;
      } else {
        console.log(`Could not find Keycloak user for ${user.Username}`)
        failures++;
        // Try to delete. If can't, just disable.
        try {
          await userRepo.delete({ Id: user.Id })
          errors.push({
            message: (keycloakUser as unknown as { message: string; }).message,
            user: user,
            action: 'deleted'
          })
        } catch (e) {
          await userRepo.update({
            Id: user.Id
          },
          {
            IsDisabled: true,
            Status: UserStatus.Disabled
          })
          errors.push({
            message: (keycloakUser as unknown as { message: string; }).message,
            user: user,
            action: 'disabled'
          })
        }
      }
      // Try and fix missing last names (last name also in first name)
      if (!user.LastName) {
        // Is there exactly 2 first names?
        const userNames = user.FirstName.split(' ');
        if (userNames.length === 2){
          const [first, last] = userNames;
          try {
            await userRepo.update({ Id: user.Id }, {
              FirstName: first,
              LastName: last
            })
          } catch (e) {
            console.log(`Failed to update names for user ${user.Username}`)
          }
          // Also handle exactly 3. e.g. Joe Van Name
        } else if (userNames.length === 3){
          const [first, pre, last] = userNames;
          try {
            await userRepo.update({ Id: user.Id }, {
              FirstName: first,
              LastName: `${pre} ${last}`
            })
          } catch (e) {
            console.log(`Failed to update names for user ${user.Username}`)
          }
        }
      }
    } catch (e) {
      console.log(e)
      failures++;
    }
  }))

  fs.writeFile('failures.json', JSON.stringify(errors, null, 2), (err) => {
    if (err) {
      console.error('Error writing file', err);
    } else {
      console.log('Successfully wrote file: failures.json');
    }
  });
  console.log(`Finished username transfer.`)
  console.log(`Successes: ${successes}`)
  console.log(`Failures: ${failures}`)
}

updateUsernames();
