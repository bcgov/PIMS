import { stubResponse } from '@/utilities/stubResponse';
import { Request, Response } from 'express';

// TODO: What controllers here could just be replaced by existing GET requests?

/**
 * @description Get all agency entries.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of agencies.
 */
export const lookupAgencies = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all agency entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Get all role entries.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of roles.
 */
export const lookupRoles = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all role entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Get all property classification entries.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of property classifications.
 */
export const lookupPropertyClassifications = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all property classification entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Get all project tier level entries.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of project tier levels.
 */
export const lookupProjectTierLevels = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all project tier level entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Get all project risk entries.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of project risks.
 */
export const lookupProjectRisks = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all project risk entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};

/**
 * @description Get all entries. // TODO: Not clear what this means.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list entries.
 */
export const lookupAll = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */

  // TODO: Replace stub response with controller logic
  return stubResponse(res);
};
