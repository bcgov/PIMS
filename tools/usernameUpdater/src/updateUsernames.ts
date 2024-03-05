import { User } from "./UserEntity";
import { AppDataSource } from "./appDataSource";

interface KeycloakUser {
  data: {
    username: string;
    email: string;
  }[]
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
  const url = `${CSS_API_URL}/${SSO_ENVIRONMENT}/${type}/users?guid=${guid.replaceAll('-','')}`;

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
  // For each user
  await Promise.all(users.map(async (user) => {
    try {
      console.log(`Current user: ${user.Username}`)
      // Get their details from Keycloak
      const keycloakUser: KeycloakUser = user.Username.includes('idir') 
        ? await getKeycloakUser(user.KeycloakUserId, access_token, 'idir') 
        : await getKeycloakUser(user.KeycloakUserId, access_token, 'basic-business-bceid');

      if (keycloakUser.data && keycloakUser.data.length > 0) {
        // Update the database table with their proper username
        // userRepo.update({
        //   Id: user.Id
        // },
        // {
        //   Username: keycloakUser.data.at(0).username,
        // })
        console.log(`New username: ${user.Username} -> ${keycloakUser.data.at(0).username}`)
        successes++;
      } else {
        console.log(`Could not find Keycloak user for ${user.Username}`)
        failures++;
      }
    } catch (e) {
      console.log(e)
      failures++;
    }
  }))
  console.log(`Finished username transfer.`)
  console.log(`Successes: ${successes}`)
  console.log(`Failures: ${failures}`)
}

updateUsernames();
