import chesServices, { EmailBody, IEmail } from '@/services/ches/chesServices';
import KeycloakService from '@/services/keycloak/keycloakService';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { Request, Response } from 'express';

/**
 * @description Used to check if API is running.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status indicating API is healthy and running
 */
export const healthCheck = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Health']
   * #swagger.description = 'Returns a 200 (OK) status if API is reached.'
   */
  const email: IEmail = {
    from: '',
    to: ['graham.stewart@quartech.com'],
    bodyType: EmailBody.Text,
    subject: 'Test email',
    body: 'Test message'
  };
  const user = req.user as KeycloakUser;
  const result = await chesServices.sendEmailAsync(email, user);
  console.log(JSON.stringify(result));
  return res.status(200).send('/health endpoint reached. API running.');
};
