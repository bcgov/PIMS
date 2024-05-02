import { Request, Response } from 'express';
import ltsaService from '@/services/ltsa/ltsaService';

// import * as ltsaService from '@/services/ltsa/ltsaservice';

// export const getToken = async (req: Request, res: Response) => {
//   const token = await ltsaService.getTokenAsync();
//   return res.status(200).send(token);
// };
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

  if (!getLandTitleInfo) {
    return res.status(404).send('Land Title information matching this internal PID not found.');
  } else return res.status(200).send(getLandTitleInfo);
};
