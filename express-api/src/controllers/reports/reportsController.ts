import logger from '@/utilities/winstonLogger';
import { stubResponse } from '../../utilities/stubResponse';
import { Request, Response } from 'express';
import { ErrorReport, errorReportSchema } from '@/controllers/reports/errorReportSchema';

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

export const submitErrorReport = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Reports']
   * #swagger.description = 'Accepts an error report from the frontend and sends an email to administrators.'
   * #swagger.security = [{
   *   "bearerAuth" : []
   * }]
   */
  const info: ErrorReport = req.body;
  logger.info(info);
  const errorParse = errorReportSchema.safeParse(info);
  if (!errorParse.success) {
    return res.status(400).send(errorParse);
  }
  // TODO: Add email component after CHES is in. Response depends on that outcome.
  return res.status(200).send(info);
};
