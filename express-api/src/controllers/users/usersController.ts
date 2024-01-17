import userServices from '@/services/users/usersServices';
import { Request, Response } from 'express';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';

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
  const user = req.user;
  if (user) {
    return res.status(200).send(user);
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
export const getUserAccessRequestLatest = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Get user's most recent access request.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  const user = req?.user as KeycloakUser;
  try {
    const result = await userServices.getAccessRequest(user);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(400).send(e?.message);
  }
};

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
  const user = req?.user as KeycloakUser;
  try {
    const result = await userServices.addAccessRequest(req.body, user);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(400).send(e?.message);
  }
};

/**
 * @description Gets a user access request by ID.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the user access request matching the Id.
 */
export const getUserAccessRequestById = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Get a user access request by ID.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  const user = req?.user as KeycloakUser;
  const requestId = Number(req.params?.reqeustId);
  try {
    const result = await userServices.getAccessRequestById(requestId, user);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(400).send(e?.message);
  }
};

/**
 * @description Updates a user access request.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the updated request.
 */
export const updateUserAccessRequest = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Users']
   * #swagger.description = 'Update a user access request.'
   * #swagger.security = [{
      "bearerAuth" : []
      }]
   */
  const user = req?.user as KeycloakUser;
  try {
    const result = await userServices.updateAccessRequest(req.body, user);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(400).send(e?.message);
  }
};

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
  try {
    const result = await userServices.getAgencies(user);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(400).send(e?.message);
  }
};
