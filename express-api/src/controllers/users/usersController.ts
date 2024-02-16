import userServices from '@/services/users/usersServices';
import { Request, Response } from 'express';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import KeycloakService from '@/services/keycloak/keycloakService';
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
  const decodeJWT = (jwt: string) => {
    try {
      return JSON.parse(Buffer.from(jwt, 'base64').toString('ascii'));
    } catch {
      throw new Error('Invalid input in decodeJWT()');
    }
  };

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
  try {
    const result = await userServices.addKeycloakUserOnHold(
      req.user as KeycloakUser,
      Number(req.body.AgencyId),
      req.body.Position,
      req.body.Note,
    );
    return res.status(200).send(result);
  } catch (e) {
    return res.status(e?.code ?? 400).send(e?.message);
  }
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
  try {
    const result = await userServices.getAgencies(user);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(e?.code ?? 400).send(e?.message);
  }
};

export const getSelf = async (req: Request, res: Response) => {
  try {
    await KeycloakService.syncKeycloakRoles();
    const user = userServices.normalizeKeycloakUser(req.user as KeycloakUser);
    const result = await userServices.getUser(user.username);
    if (result) {
      const syncedUser = await KeycloakService.syncKeycloakUser(user.guid);
      return res.status(200).send(syncedUser);
    } else {
      return res.status(204).send(); //Valid request, but no user for this keycloak login.
    }
  } catch (e) {
    return res.status(e?.code ?? 400).send(e?.message);
  }
};
