import { AppDataSource } from '@/appDataSource';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { stubResponse } from '@/utilities/stubResponse';
import { Request, Response } from 'express';
import {
  BuildingConstructionPublicResponseSchema,
  ClassificationPublicResponseSchema,
  PredominateUsePublicResponseSchema,
  RegionalDistrictPublicResponseSchema,
  TaskPublicResponseSchema,
  TierLevelPublicResponseSchema,
  ProjectStatusPublicResponseSchema,
} from './lookupSchema';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { RegionalDistrict } from '@/typeorm/Entities/RegionalDistrict';
import { TierLevel } from '@/typeorm/Entities/TierLevel';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Task } from '@/typeorm/Entities/Task';

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
  const classifications = await AppDataSource.getRepository(PropertyClassification).find();
  const filtered = classifications.filter((c) => !c.IsDisabled);
  const parsed = ClassificationPublicResponseSchema.array().safeParse(filtered);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

export const lookupBuildingPredominateUse = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all predomanite uses entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const uses = await AppDataSource.getRepository(BuildingPredominateUse).find();
  const filtered = uses.filter((u) => !u.IsDisabled);
  const parsed = PredominateUsePublicResponseSchema.array().safeParse(filtered);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

export const lookupBuildingConstructionType = async (req: Request, res: Response) => {
  /**
   * #swagger.tags = ['Lookup']
   * #swagger.description = 'Get all building construction type entries.'
   * #swagger.security = [{
            "bearerAuth": []
      }]
   */
  const uses = await AppDataSource.getRepository(BuildingConstructionType).find();
  const filtered = uses.filter((u) => !u.IsDisabled);
  const parsed = BuildingConstructionPublicResponseSchema.array().safeParse(filtered);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

export const lookupRegionalDistricts = async (req: Request, res: Response) => {
  // Uses sort instead of TypeORM order because some names start with lowercase letters
  const districts = (await AppDataSource.getRepository(RegionalDistrict).find()).sort((a, b) =>
    a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()),
  );
  const parsed = RegionalDistrictPublicResponseSchema.array().safeParse(districts);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

/**
 * @description Get all project tier level entries.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of project tier levels.
 */
export const lookupProjectTierLevels = async (req: Request, res: Response) => {
  const tiers = (await AppDataSource.getRepository(TierLevel).find()).sort(
    (a, b) => a.SortOrder - b.SortOrder,
  );
  const filtered = tiers.filter((u) => !u.IsDisabled);
  const parsed = TierLevelPublicResponseSchema.array().safeParse(filtered);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

/**
 * @description Get all project project status entries.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of project statuses.
 */
export const lookupProjectStatuses = async (req: Request, res: Response) => {
  const status = (await AppDataSource.getRepository(ProjectStatus).find()).sort(
    (a, b) => a.SortOrder - b.SortOrder,
  );
  const filtered = status.filter((u) => !u.IsDisabled);
  const parsed = ProjectStatusPublicResponseSchema.array().safeParse(filtered);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

/**
 * @description Get all possible tasks, optionally select by status id.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list of tasks.
 */
export const lookupTasks = async (req: Request, res: Response) => {
  const statusId = req.query.statusId ? parseInt(req.query.statusId.toString()) : undefined;
  const tasks = (
    await AppDataSource.getRepository(Task).find({ where: { StatusId: statusId } })
  ).sort((a, b) => a.SortOrder - b.SortOrder);
  const parsed = TaskPublicResponseSchema.array().safeParse(tasks);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
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
