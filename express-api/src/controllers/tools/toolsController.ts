import { z } from 'zod';
import { Request, Response } from 'express';
import chesServices from '@/services/ches/chesServices';
import { ChesFilterSchema } from './toolsSchema';
import geocoderService from '@/services/geocoder/geocoderService';
import { AppDataSource } from '@/appDataSource';
import { JurRollPidXref } from '@/typeorm/Entities/JurRollPidXref';

/**
 * NOTE
 * Routes for the CHES controllers have been removed.
 * Management of notifications and their CHES messages is
 * handled through the notifications routes.
 *
 * Leaving these controllers here for now in case they are needed in the future.
 */

/**
 * @description Gets the status of a CHES message.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const getChesMessageStatusById = async (req: Request, res: Response) => {
  const messageId = z.string().uuid().safeParse(req.params.messageId);
  if (messageId.success) {
    const status = await chesServices.getStatusByIdAsync(messageId.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Message ID was malformed or missing.');
  }
};

/**
 * @description Gets the status of a CHES message.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const getChesMessageStatuses = async (req: Request, res: Response) => {
  const filter = ChesFilterSchema.safeParse(req.query);
  if (filter.success) {
    const status = await chesServices.getStatusesAsync(filter.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
};

/**
 * @description Cancel a CHES message by messageId.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const cancelChesMessageById = async (req: Request, res: Response) => {
  const messageId = z.string().uuid().safeParse(req.params.messageId);
  if (messageId.success) {
    const status = await chesServices.cancelEmailByIdAsync(messageId.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Message ID was missing or malformed.');
  }
};

/**
 * @description Cancel a CHES message.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with a CHES object.
 */
export const cancelChesMessages = async (req: Request, res: Response) => {
  const filter = ChesFilterSchema.safeParse(req.query);
  if (filter.success) {
    const status = await chesServices.cancelEmailsAsync(filter.data);
    return res.status(200).send(status);
  } else {
    return res.status(400).send('Could not parse filter.');
  }
};

/**
 * @description Search Geocoder for an address.
 * @param {Request}     req Incoming request.
 * @param {Response}    res Outgoing response.
 * @returns {Response}      A 200 status with an address object.
 */
export const searchGeocoderAddresses = async (req: Request, res: Response) => {
  const address = String(req.query.address);
  const minScore = isNaN(Number(req.query.minScore)) ? undefined : String(req.query.minScore);
  const maxResults = isNaN(Number(req.query.maxResults)) ? undefined : String(req.query.maxResults);
  const geoReturn = await geocoderService.getSiteAddresses(address, minScore, maxResults);
  return res.status(200).send(geoReturn);
};

/**
 * Retrieves jurisdiction & roll number based on PID.
 * Used to cross reference BC Assessment records with Parcels.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A response with the jurisdiction, roll number, and PID if found.
 */
export const getJurisdictionRollNumberByPid = async (req: Request, res: Response) => {
  const pidQuery = req.query.pid as string;
  if (parseInt(pidQuery)) {
    const result = await AppDataSource.getRepository(JurRollPidXref).findOne({
      where: { PID: parseInt(pidQuery) },
    });
    if (!result) {
      return res.status(404).send('PID not found.');
    }
    return res.status(200).send(result);
  }
  return res.status(400).send('Invalid PID value.');
};
