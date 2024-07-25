import logger from '@/utilities/winstonLogger';
import { Request, Response } from 'express';
import { ErrorReport, errorReportSchema } from '@/controllers/reports/errorReportSchema';
import chesServices, { EmailBody, IEmail } from '@/services/ches/chesServices';
import nunjucks from 'nunjucks';
import getConfig from '@/constants/config';

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

  const emailBody = nunjucks.render('ErrorReport.njk', {
    User: req.user,
    Error: errorParse.data.error?.message,
    Stack: errorParse.data.error?.stack,
    Comment: errorParse.data.userMessage,
    Timestamp: errorParse.data.timestamp ?? new Date().toLocaleString(),
    Url: errorParse.data.url ?? 'unknown',
  });
  const config = getConfig();
  const email: IEmail = {
    to: [config.errorReport.toEmail],
    cc: [req.user.email],
    from: 'pims.error@gov.bc.ca', // Made up for this purpose.
    bodyType: EmailBody.Html,
    subject: 'PIMS Error Report Submission',
    body: emailBody,
  };

  const response = await chesServices.sendEmailAsync(email, req.user);
  return res.status(200).send({
    ...errorParse,
    chesResponse: response,
  });
};
