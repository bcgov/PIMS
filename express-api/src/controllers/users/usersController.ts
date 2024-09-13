import userServices from '@/services/users/usersServices';
import { Request, Response } from 'express';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { UserFiltering, UserFilteringSchema } from '@/controllers/users/usersSchema';
import { z } from 'zod';
import notificationServices from '@/services/notifications/notificationServices';
import getConfig from '@/constants/config';
import logger from '@/utilities/winstonLogger';
import { Roles } from '@/constants/roles';

/**
 * @description Submits a user access request.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 201 status with the created access request.
 */
export const submitUserAccessRequest = async (req: Request, res: Response) => {
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

  return res.status(201).send(result);
};

/**
 * @description Gets user agency information.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an array of integers.
 */
export const getUserAgencies = async (req: Request, res: Response) => {
  const user = String(req.params?.username);
  const result = await userServices.getAgencies(user);
  return res.status(200).send(result);
};

/**
 * Retrieves the user information for the currently authenticated user.
 * Normalizes the Keycloak user using internal organization's method.
 * Retrieves the user details based on the normalized username.
 * If user details are found, returns a status of 200 with the user information.
 * If no user details are found, returns a status of 204 indicating a valid request but no user for the Keycloak login.
 *
 * @param {Request} req - The request object containing user information.
 * @param {Response} res - The response object to send back the user details or status.
 * @returns {Response}        A 200 status with user's info.
 */
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
  const ssoUser = req.user as unknown as SSOUser;
  const filter = UserFilteringSchema.safeParse(req.query);
  if (!filter.success) {
    return res.status(400).send('Failed to parse filter query.');
  }
  const filterResult = filter.data;

  let users;
  const isAdmin = await userServices.hasOneOfRoles(ssoUser.preferred_username, [Roles.ADMIN]);
  if (isAdmin) {
    users = await userServices.getUsers(filterResult as UserFiltering);
  } else {
    // Get agencies associated with the requesting user
    const usersAgencies = await userServices.getAgencies(ssoUser.preferred_username);
    filterResult.agencyId = usersAgencies;
    users = await userServices.getUsers(filterResult as UserFiltering);
  }
  return res.status(200).send(users);
};

/**
 * @description Gets a single user that matches an ID.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status and the user data.
 */
export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const uuid = z.string().uuid().safeParse(id);
  const ssoUser = req.user as unknown as SSOUser;
  if (uuid.success) {
    const user = await userServices.getUserById(uuid.data);
    if (user) {
      const isAdmin = await userServices.hasOneOfRoles(ssoUser.preferred_username, [Roles.ADMIN]);
      if (!isAdmin) {
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
