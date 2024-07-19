import logger from '@/utilities/winstonLogger';
import { Request, Response } from 'express';
import { ErrorReport, errorReportSchema } from '@/controllers/reports/errorReportSchema';

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
