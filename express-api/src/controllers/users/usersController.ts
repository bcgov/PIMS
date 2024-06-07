import userServices from '@/services/users/usersServices';
import { Request, Response } from 'express';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { decodeJWT } from '@/utilities/decodeJWT';
import { stubResponse } from '@/utilities/stubResponse';
import { UserFiltering, UserFilteringSchema } from '@/controllers/users/usersSchema';
import { z } from 'zod';
import { isAdmin, isAuditor } from '@/utilities/authorizationChecks';
import notificationServices from '@/services/notifications/notificationServices';
import getConfig from '@/constants/config';
import logger from '@/utilities/winstonLogger';
/**
 * @description Function to filter users based on agencies
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @param {SSOUser}    ssoUser Incoming SSO user.
 * @returns {User[]}      An array of users.
 */
const filterUsersByAgencies = async (req: Request, res: Response, ssoUser: SSOUser) => {
  const filter = UserFilteringSchema.safeParse(req.query);
  if (!filter.success) {
    return res.status(400).send('Failed to parse filter query.');
  }
  const filterResult = filter.data;

  let users;
  if (isAdmin(ssoUser) || isAuditor(ssoUser)) {
    users = await userServices.getUsers(filterResult as UserFiltering);
  } else {
    // Get agencies associated with the requesting user
    const usersAgencies = await userServices.getAgencies(ssoUser.preferred_username);
    filterResult.agencyId = usersAgencies;
    users = await userServices.getUsers(filterResult as UserFiltering);
  }
  return users;
};

/**
 * @description Redirects user to the keycloak user info endpoint.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an object containing keycloak info.
 */

export const getUserInfo = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Redirect user to keycloak user info.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */

  if (!req.token) return res.status(400).send('No access token');
  const [header, payload] = req.token.split('.');
  if (!header || !payload) return res.status(400).send('Bad token format.');

  const info = {
    header: decodeJWT(header),
    payload: decodeJWT(payload),
  };

  if (info) {
    return res.status(200).send(info.payload);
  } else {
    return res.status(400).send('No keycloak user authenticated.');
  }
};

/**
 * @description Get the most recent access request for this user.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the most recent access request.
 */
// export const getUserAccessRequestLatest = async (req: Request, res: Response) => {
//   /**
//    * #swagger.tags = ['Users']
//    * #swagger.description = 'Get user's most recent access request.'
//    * #swagger.security = [{
//       "bearerAuth" : []
//       }]
//    */
//   const user = req?.user as KeycloakUser;
//   try {
//     const result = await userServices.getAccessRequest(user);
//     if (!result) {
//       return res.status(204).send('No access request was found.');
//     }
//     return res.status(200).send(result);
//   } catch (e) {
//     return res.status(e?.code ?? 400).send(e?.message);
//   }
// };

/**
 * @description Submits a user access request.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 201 status with the created access request.
 */
export const submitUserAccessRequest = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Submit a user access request.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  const result = await userServices.addKeycloakUserOnHold(
    req.user as SSOUser,
    Number(req.body.AgencyId),
    req.body.Position,
    req.body.Note,
  );
  const config = getConfig();
  const user = await userServices.getUser(req.user.preferred_username);
  //Note: old PIMS has code that suggests administrator users should be enumerated here and sent notifications.
  //However, current POs no longer desire this functionality. Just the one notification to the common RPD mailbox is fine.
  try {
    const notifRPD = await notificationServices.generateAccessRequestNotification(
      {
        FirstName: user.FirstName,
        LastName: user.LastName,
      },
      config.accessRequest.notificationTemplateRPD,
    );
    await notificationServices.sendNotification(notifRPD, req.user);
  } catch (e) {
    logger.error(`Failed to deliver access request notification: ${e.message}`);
  }

  return res.status(200).send(result);
};

/**
 * @description Gets a user access request by ID.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the user access request matching the Id.
 */
// export const getUserAccessRequestById = async (req: Request, res: Response) => {
//   /**
//    * #swagger.tags = ['Users']
//    * #swagger.description = 'Get a user access request by ID.'
//    * #swagger.security = [{
//       "bearerAuth" : []
//       }]
//    */
//   const user = req?.user as KeycloakUser;
//   const requestId = Number(req.params?.reqeustId);
//   try {
//     const result = await userServices.getAccessRequestById(requestId, user);
//     if (!result) {
//       return res.status(404);
//     }
//     return res.status(200).send(result);
//   } catch (e) {
//     return res.status(e?.code ?? 400).send(e?.message);
//   }
// };

/**
 * @description Updates a user access request.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the updated request.
 */
// export const updateUserAccessRequest = async (req: Request, res: Response) => {
//   /**
//    * #swagger.tags = ['Users']
//    * #swagger.description = 'Update a user access request.'
//    * #swagger.security = [{
//       "bearerAuth" : []
//       }]
//    */
//   const user = req?.user as KeycloakUser;
//   try {
//     const result = await userServices.updateAccessRequest(req.body, user);
//     return res.status(200).send(result);
//   } catch (e) {
//     return res.status(e?.code ?? 400).send(e?.message);
//   }
// };

/**
 * @description Gets user agency information.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an array of integers.
 *
 *  Note that the original docs imply it gives the full user response, but looking at the implementation
 *  I think it only gives the numeric agency Ids.
 */
export const getUserAgencies = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Get user agency information.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  const user = String(req.params?.username);
  const result = await userServices.getAgencies(user);
  return res.status(200).send(result);
};

export const getSelf = async (req: Request, res: Response) => {
  const user = userServices.normalizeKeycloakUser(req.user as SSOUser);
  const result = await userServices.getUser(user.username);
  if (result) {
    return res.status(200).send(result);
  } else {
    return res.status(204).send(); //Valid request, but no user for this keycloak login.
  }
};

/**
 * @description Gets a paged list of users.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of users.
 */
export const getUsers = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a paged list of users.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const filter = UserFilteringSchema.safeParse(req.query);
  if (!filter.success) {
    return res.status(400).send('Failed to parse filter query.');
  }
  const ssoUser = req.user as unknown as SSOUser;
  const users = await filterUsersByAgencies(req, res, ssoUser);
  return res.status(200).send(users);
};

/**
 * @description Adds a new user to the datasource.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 201 status and the data of the user added.
 */
export const addUser = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Adds a new user to the datasource.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  try {
    const user = await userServices.addUser(req.body);
    return res.status(201).send(user);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

/**
 * @description Gets a single user that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the user data.
 */
export const getUserById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Returns an user that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const id = req.params.id;
  const uuid = z.string().uuid().safeParse(id);
  const ssoUser = req.user as unknown as SSOUser;
  if (uuid.success) {
    const user = await userServices.getUserById(uuid.data);

    if (user) {
      if (!isAdmin(ssoUser) && !isAuditor(ssoUser)) {
        // check if user has the correct agencies
        const usersAgencies = await userServices.hasAgencies(ssoUser.preferred_username, [
          user.AgencyId,
        ]);
        if (!usersAgencies) {
          return res.status(403).send('User does not have permission to view this user');
        }
      }
      return res.status(200).send(user);
    } else {
      return res.status(404).send('User not found');
    }
  } else {
    return res.status(400).send('Could not parse UUID.');
  }
};

/**
 * @description Updates a single user that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the user data.
 */
export const updateUserById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Updates an user that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const idParse = z.string().uuid().safeParse(req.params.id);
  if (!idParse.success) {
    return res.status(400).send(idParse);
  }
  if (idParse.data != req.body.Id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  const user = await userServices.updateUser(req.body);
  return res.status(200).send(user);
};

/**
 * @description Deletes a single user that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 204 status indicating successful deletion.
 */
export const deleteUserById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Deletes an user that matches the supplied ID.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  const idParse = z.string().uuid().safeParse(req.params.id);
  if (!idParse.success) {
    return res.status(400).send(idParse);
  }
  if (idParse.data != req.body.Id) {
    return res.status(400).send('The param ID does not match the request body.');
  }
  const user = await userServices.deleteUser(req.body);
  return res.status(200).send(user);
};

/**
 * @description Gets a paged list of users within the user's agency.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of users.
 */
export const getUsersSameAgency = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a paged list of users within the user's agency.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Gets all roles of a user based on their name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of the user's roles.
 */
export const getAllRoles = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a list of roles assigned to a user.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const roles = await userServices.getKeycloakRoles();
  return res.status(200).send(roles);
};

/**
 * @description Gets all roles of a user based on their name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with a list of the user's roles.
 */
export const getUserRolesByName = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Gets a list of roles assigned to a user.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const username = req.params.username;
  if (!username) {
    return res.status(400).send('Username was empty.');
  }
  const roles = await userServices.getKeycloakUserRoles(username);
  return res.status(200).send(roles);
};

export const updateUserRolesByName = async (req: Request, res: Response) => {
  const username = req.params.username;
  const roles = z.string().array().safeParse(req.body);
  if (!roles.success) {
    return res.status(400).send('Request body was wrong format.');
  }
  if (!username) {
    return res.status(400).send('Username was empty.');
  }
  const updatedRoles = await userServices.updateKeycloakUserRoles(username, roles.data);
  return res.status(200).send(updatedRoles);
};

// Leaving these two below here for now but I think that we can just consolidate them into the above function instead.

/**
 * @description Adds a role to a user based on their name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with the user's updated information.
 */
export const addUserRoleByName = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Adds a role to a user based on their name.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Deletes a role from a user based on their name.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with the user's updated information.
 */
export const deleteUserRoleByName = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users - Admin']
   * #swagger.description = 'Deletes a role from a user based on their name.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
