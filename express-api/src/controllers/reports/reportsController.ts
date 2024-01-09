import { stubResponse } from '../../utilities/stubResponse';
import { Request, Response } from 'express';

/**
 * @description Get all reports as a CSV or Excel file.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the requested reports.
 */
export const getSpreadsheetProjectsReports = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Exports projects as CSV or Excel file. Include 'Accept' header to request the appropriate expor - ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get all reports as a CSV or Excel file.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the requested reports.
 */
export const getSpreadsheetPropertiesReports = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Exports projects as CSV or Excel file. Include 'Accept' header to request the appropriate expor - ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};

/**
 * @description Get all reports as a CSV or Excel file.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with the requested reports.
 */
export const getSpreadsheetUsersReports = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Projects']
   * #swagger.description = 'Exports projects as CSV or Excel file. Include 'Accept' header to request the appropriate expor - ["text/csv", "application/application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  return stubResponse(res);
};
