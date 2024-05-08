import { Request, Response } from 'express';
import ltsaService from '@/services/ltsa/ltsaServices';

/**
 * @description Used to retrieve property information from LTSA.
 * @param   {Request}     req Incoming request
 * @param   {Response}    res Outgoing response
 * @returns {Response}        A 200 status with LTSA order information.
 */
export const getLTSA = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['LTSA']
   * #swagger.description = 'Returns property information from LTSA.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const pid = req.query.pid as string;
  const getLandTitleInfo = await ltsaService.processLTSARequest(pid);
  return res.status(200).send(getLandTitleInfo);
};
