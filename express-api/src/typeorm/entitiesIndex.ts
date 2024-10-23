import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { Agency } from '@/typeorm/Entities/Agency';
import { Building } from '@/typeorm/Entities/Building';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import { BuildingOccupantType } from '@/typeorm/Entities/BuildingOccupantType';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { EvaluationKey } from '@/typeorm/Entities/EvaluationKey';
import { FiscalKey } from '@/typeorm/Entities/FiscalKey';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { NotificationTemplate } from '@/typeorm/Entities/NotificationTemplate';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectAgencyResponse } from '@/typeorm/Entities/ProjectAgencyResponse';
import { ProjectNote } from '@/typeorm/Entities/ProjectNote';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectRisk } from '@/typeorm/Entities/ProjectRisk';
import { ProjectSnapshot } from '@/typeorm/Entities/ProjectSnapshot';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { ProjectStatusHistory } from '@/typeorm/Entities/ProjectStatusHistory';
import { ProjectStatusNotification } from '@/typeorm/Entities/ProjectStatusNotification';
import { ProjectTask } from '@/typeorm/Entities/ProjectTask';
import { ProjectType } from '@/typeorm/Entities/ProjectType';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { PropertyType } from '@/typeorm/Entities/PropertyType';
import { Province } from '@/typeorm/Entities/Province';
import { RegionalDistrict } from '@/typeorm/Entities/RegionalDistrict';
import { ReportType } from '@/typeorm/Entities/ReportType';
import { Role } from '@/typeorm/Entities/Role';
import { Task } from '@/typeorm/Entities/Task';
import { TierLevel } from '@/typeorm/Entities/TierLevel';
import { User } from '@/typeorm/Entities/User';
import { BuildingRelations } from '@/typeorm/Entities/views/BuildingRelationsView';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import { NoteType } from './Entities/NoteType';
import { ProjectMonetary } from './Entities/ProjectMonetary';
import { ProjectTimestamp } from './Entities/ProjectTimestamp';
import { MonetaryType } from './Entities/MonetaryType';
import { TimestampType } from './Entities/TimestampType';
import { PropertyUnion } from './Entities/views/PropertyUnionView';
import { ImportResult } from './Entities/ImportResult';
import { ProjectJoin } from './Entities/views/ProjectJoinView';
import { AdministrativeAreaJoinView } from '@/typeorm/Entities/views/AdministrativeAreaJoinView';
import { AgencyJoinView } from '@/typeorm/Entities/views/AgencyJoinView';
import { JurRollPidXref } from '@/typeorm/Entities/JurRollPidXref';

const views = [
  BuildingRelations,
  MapProperties,
  PropertyUnion,
  ProjectJoin,
  AdministrativeAreaJoinView,
  AgencyJoinView,
];

export default [
  AdministrativeArea,
  Agency,
  Building,
  BuildingConstructionType,
  BuildingEvaluation,
  BuildingFiscal,
  BuildingOccupantType,
  BuildingPredominateUse,
  EvaluationKey,
  FiscalKey,
  NotificationQueue,
  NotificationTemplate,
  Parcel,
  ParcelEvaluation,
  ParcelFiscal,
  Project,
  ProjectAgencyResponse,
  ProjectNote,
  ProjectProperty,
  ProjectRisk,
  ProjectSnapshot,
  ProjectStatus,
  ProjectStatusHistory,
  ProjectStatusNotification,
  ProjectTask,
  ProjectType,
  ProjectMonetary,
  ProjectTimestamp,
  PropertyClassification,
  PropertyType,
  Province,
  RegionalDistrict,
  ReportType,
  Role,
  Task,
  MonetaryType,
  TimestampType,
  TierLevel,
  User,
  NoteType,
  ImportResult,
  JurRollPidXref,
  ...views,
];
