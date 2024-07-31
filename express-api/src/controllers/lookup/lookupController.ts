import { AppDataSource } from '@/appDataSource';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { Request, Response } from 'express';
import {
  BuildingConstructionPublicResponseSchema,
  ClassificationPublicResponseSchema,
  PredominateUsePublicResponseSchema,
  RegionalDistrictPublicResponseSchema,
  TierLevelPublicResponseSchema,
  ProjectStatusPublicResponseSchema,
  ProjectMetadataTypeSchema,
  TaskPublicResponseSchema,
} from './lookupSchema';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { RegionalDistrict } from '@/typeorm/Entities/RegionalDistrict';
import { TierLevel } from '@/typeorm/Entities/TierLevel';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Task } from '@/typeorm/Entities/Task';
import { PropertyType } from '@/typeorm/Entities/PropertyType';
import { NoteType } from '@/typeorm/Entities/NoteType';
import { MonetaryType } from '@/typeorm/Entities/MonetaryType';
import { TimestampType } from '@/typeorm/Entities/TimestampType';
import { ProjectRisk } from '@/typeorm/Entities/ProjectRisk';
import { Role } from '@/typeorm/Entities/Role';
import { Agency } from '@/typeorm/Entities/Agency';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { Workflow } from '@/typeorm/Entities/Workflow';

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
 * Retrieves all property types from the database and sends them as a response.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A response with all property types and status code 200.
 */
export const lookupPropertyTypes = async (req: Request, res: Response) => {
  const types = await AppDataSource.getRepository(PropertyType).find();
  return res.status(200).send(types);
};

/**
 * Retrieves all note types from the database. Optionally filter by status.
 * @param req - Request object.
 * @param res - Response object.
 * @returns A response with note types and status code 200.
 */
export const lookupNoteTypes = async (req: Request, res: Response) => {
  const statusId = req.query.statusId ? parseInt(req.query.statusId.toString()) : undefined;
  const types = (
    await AppDataSource.getRepository(NoteType).find({ where: { StatusId: statusId } })
  ).sort((a, b) => a.SortOrder - b.SortOrder);
  const parsed = ProjectMetadataTypeSchema.array().safeParse(types);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

export const lookupMonetaryTypes = async (req: Request, res: Response) => {
  const statusId = req.query.statusId ? parseInt(req.query.statusId.toString()) : undefined;
  const types = (
    await AppDataSource.getRepository(MonetaryType).find({ where: { StatusId: statusId } })
  ).sort((a, b) => a.SortOrder - b.SortOrder);
  const parsed = ProjectMetadataTypeSchema.array().safeParse(types);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

export const lookupTimestampTypes = async (req: Request, res: Response) => {
  const statusId = req.query.statusId ? parseInt(req.query.statusId.toString()) : undefined;
  const types = (
    await AppDataSource.getRepository(TimestampType).find({ where: { StatusId: statusId } })
  ).sort((a, b) => a.SortOrder - b.SortOrder);
  const parsed = ProjectMetadataTypeSchema.array().safeParse(types);
  if (parsed.success) {
    return res.status(200).send(parsed.data);
  } else {
    return res.status(400).send(parsed);
  }
};

/**
 * @description Get all entries for frontend lookup context.
 * @param {Request}     req Incoming request
 * @param {Response}    res Outgoing response
 * @returns {Response}      A 200 status and a list entries.
 */
export const lookupAll = async (req: Request, res: Response) => {
  const Risks = await AppDataSource.getRepository(ProjectRisk).find({
    select: {
      Id: true,
      Name: true,
      Code: true,
      Description: true,
    },
    order: {
      SortOrder: 'asc',
    },
    where: { IsDisabled: false },
  });
  const TimestampTypes = await AppDataSource.getRepository(TimestampType).find({
    select: {
      Id: true,
      Name: true,
      IsOptional: true,
      Description: true,
      StatusId: true,
    },
    order: {
      SortOrder: 'asc',
    },
    where: { IsDisabled: false },
  });
  const MonetaryTypes = await AppDataSource.getRepository(MonetaryType).find({
    select: {
      Id: true,
      Name: true,
      IsOptional: true,
      Description: true,
      StatusId: true,
    },
    order: {
      SortOrder: 'asc',
    },
    where: { IsDisabled: false },
  });
  const NoteTypes = await AppDataSource.getRepository(NoteType).find({
    select: {
      Id: true,
      Name: true,
      IsOptional: true,
      Description: true,
      StatusId: true,
    },
    order: {
      SortOrder: 'asc',
    },
    where: { IsDisabled: false },
  });
  const PropertyTypes = await AppDataSource.getRepository(PropertyType).find({
    select: {
      Id: true,
      Name: true,
    },
    where: {
      IsDisabled: false,
    },
  });
  const Tasks = await AppDataSource.getRepository(Task).find({
    select: {
      Id: true,
      Name: true,
      IsOptional: true,
      Description: true,
      StatusId: true,
    },
    order: {
      SortOrder: 'asc',
    },
    where: {
      IsDisabled: false,
    },
  });
  const ProjectStatuses = await AppDataSource.getRepository(ProjectStatus).find({
    select: { Name: true, Id: true, Description: true },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const ProjectTiers = await AppDataSource.getRepository(TierLevel).find({
    select: {
      Name: true,
      Id: true,
      Description: true,
    },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const RegionalDistricts = await AppDataSource.getRepository(RegionalDistrict).find({
    select: {
      Id: true,
      Name: true,
    },
  });
  const ConstructionTypes = await AppDataSource.getRepository(BuildingConstructionType).find({
    select: {
      Name: true,
      Id: true,
    },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const PredominateUses = await AppDataSource.getRepository(BuildingPredominateUse).find({
    select: {
      Id: true,
      Name: true,
    },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const Classifications = await AppDataSource.getRepository(PropertyClassification).find({
    select: { Id: true, Name: true, IsVisible: true },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const Roles = await AppDataSource.getRepository(Role).find({
    select: {
      Id: true,
      Name: true,
      Description: true,
    },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const Agencies = await AppDataSource.getRepository(Agency).find({
    select: {
      Id: true,
      Name: true,
      Code: true,
      ParentId: true,
    },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const AdministrativeAreas = await AppDataSource.getRepository(AdministrativeArea).find({
    select: {
      Id: true,
      Name: true,
      RegionalDistrictId: true,
    },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });
  const Workflows = await AppDataSource.getRepository(Workflow).find({
    select: {
      Id: true,
      Name: true,
    },
    order: { SortOrder: 'asc', Name: 'asc' },
    where: { IsDisabled: false },
  });

  const returnObj = {
    Risks,
    TimestampTypes,
    MonetaryTypes,
    NoteTypes,
    PropertyTypes,
    Tasks,
    ProjectStatuses,
    ProjectTiers,
    ConstructionTypes,
    PredominateUses,
    Classifications,
    Roles,
    Agencies: (await Agencies).sort((a, b) =>
      a.Name.toLowerCase().localeCompare(b.Name.toLowerCase(), undefined, { numeric: true }),
    ),
    AdministrativeAreas,
    RegionalDistricts: (await RegionalDistricts).sort((a, b) =>
      a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()),
    ),
    Workflows,
  };
  return res.status(200).send(returnObj);
};
