import { Request, Response } from 'express';
import { stubResponse } from '@/utilities/stubResponse';

/**
 * @description Sync keycloak groups into PIMS roles.
 * @param   {Request}   req Incoming request
 * @param   {Response}  res Outgoing response
 * @returns {Response}  A 200 status with success json schema
 */
export const syncKeycloakGroups = async (req: Request, res: Response) => {
    /**
     * #swagger.tags = ['Keycloak - Roles']
     * #swagger.description = 'Sync keycloak groups into PIMS roles.'
     * #swagger.security = [{
     *         "bearerAuth": []
     *     }]
     */

    // TODO: replace stub with controller logic
    return stubResponse(res);
};

/**
 * @description Fetch a list of groups from Keycloak and their associated role within PIMS
 * @param   {Request}   req Incoming request
 * @param   {Response}  res Outgoing response
 * @returns {Response}  A 200 status with a list of keycloak groups and roles.
 */
export const getKeycloakRoles = async (req: Request, res: Response) => {
    /**
     * #swagger.tags = ['Keycloak - Roles']
     * #swagger.description = 'Fetch a list of groups from Keycloak and their associated role within PIMS.'
     * #swagger.security = [{
     *         "bearerAuth": []
     *     }]
     */

    // TODO: replace  stub with controller logic
    return stubResponse(res);
};

/**
 * @description Fetch role for the specified 'id'. If the group or role doesn't exist in keycloak it will return a 400 BaqRequest.
 * @param   {Request}   req Incoming Request
 * @param   {Response}  res Outgoing Response
 * @returns {Response}  A 200 response with information on the requested role/ group. 
 */
export const getKeycloakRole = async (req: Request, res: Response) => {
    /**
     * #swagger.tags = ['Keycloak - Roles']
     * #swagger.description = 'Fetch role for the specified 'id'. If the group or role doesn't exist in keycloak it will return a 400 BaqRequest.'
     * #swagger.security = [{
     *         "bearerAuth": []
     *     }]
     */

    // TODO: replace stub with controller logic
    return stubResponse(res);
};
