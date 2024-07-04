import { AppDataSource } from '@/appDataSource';
import { Roles } from '@/constants/roles';
import propertyServices from '@/services/properties/propertiesServices';
import userServices from '@/services/users/usersServices';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { Agency } from '@/typeorm/Entities/Agency';
import { Building } from '@/typeorm/Entities/Building';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { ImportResult } from '@/typeorm/Entities/ImportResult';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import { PropertyUnion } from '@/typeorm/Entities/views/PropertyUnionView';
import {
  produceParcel,
  produceBuilding,
  producePropertyUnion,
  produceAgency,
  producePredominateUse,
  produceClassification,
  produceConstructionType,
  produceAdminArea,
  produceUser,
  produceImportResult,
  produceParcelEvaluation,
  produceParcelFiscal,
  produceBuildingEvaluation,
  produceBuildingFiscal,
} from 'tests/testUtils/factories';
import { DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';
import xlsx, { WorkSheet } from 'xlsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _parcelsCreateQueryBuilder: any = {
  select: () => _parcelsCreateQueryBuilder,
  leftJoinAndSelect: () => _parcelsCreateQueryBuilder,
  where: () => _parcelsCreateQueryBuilder,
  orWhere: () => _parcelsCreateQueryBuilder,
  andWhere: () => _parcelsCreateQueryBuilder,
  take: () => _parcelsCreateQueryBuilder,
  skip: () => _parcelsCreateQueryBuilder,
  orderBy: () => _parcelsCreateQueryBuilder,
  getMany: () => [produceParcel()],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _buildingsCreateQueryBuilder: any = {
  select: () => _parcelsCreateQueryBuilder,
  leftJoinAndSelect: () => _parcelsCreateQueryBuilder,
  where: () => _parcelsCreateQueryBuilder,
  orWhere: () => _parcelsCreateQueryBuilder,
  andWhere: () => _parcelsCreateQueryBuilder,
  take: () => _parcelsCreateQueryBuilder,
  skip: () => _parcelsCreateQueryBuilder,
  orderBy: () => _parcelsCreateQueryBuilder,
  getMany: () => [produceBuilding()],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _propertyUnionCreateQueryBuilder: any = {
  select: () => _parcelsCreateQueryBuilder,
  leftJoinAndSelect: () => _parcelsCreateQueryBuilder,
  where: () => _parcelsCreateQueryBuilder,
  orWhere: () => _parcelsCreateQueryBuilder,
  andWhere: () => _parcelsCreateQueryBuilder,
  take: () => _parcelsCreateQueryBuilder,
  skip: () => _parcelsCreateQueryBuilder,
  orderBy: () => _parcelsCreateQueryBuilder,
  getMany: () => [producePropertyUnion()],
};

jest
  .spyOn(AppDataSource.getRepository(Parcel), 'createQueryBuilder')
  .mockImplementation(() => _parcelsCreateQueryBuilder);

jest
  .spyOn(AppDataSource.getRepository(Building), 'createQueryBuilder')
  .mockImplementation(() => _buildingsCreateQueryBuilder);

jest.spyOn(AppDataSource.getRepository(MapProperties), 'find').mockImplementation(async () => [
  {
    Id: 1,
    Location: {
      x: -122.873862825,
      y: 49.212751465,
    },
    PropertyTypeId: 0,
    ClassificationId: 3,
  } as MapProperties,
]);

jest
  .spyOn(AppDataSource.getRepository(PropertyUnion), 'createQueryBuilder')
  .mockImplementation(() => _propertyUnionCreateQueryBuilder);

const _findParcel = jest.fn().mockImplementation(async () => produceParcel);
const _findBuilding = jest.fn().mockImplementation(async () => produceParcel);

jest.spyOn(AppDataSource.getRepository(Parcel), 'find').mockImplementation(() => _findParcel());
jest.spyOn(AppDataSource.getRepository(Building), 'find').mockImplementation(() => _findBuilding());
jest
  .spyOn(AppDataSource.getRepository(Parcel), 'save')
  .mockImplementation(async () => produceParcel());
jest
  .spyOn(AppDataSource.getRepository(Building), 'save')
  .mockImplementation(async () => produceBuilding());

jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => [produceAgency({ Id: 1, Name: 'TestAgency', Code: 'TEST' })]);
jest
  .spyOn(AppDataSource.getRepository(BuildingPredominateUse), 'find')
  .mockImplementation(async () => [producePredominateUse({ Name: 'Corporate' })]);
jest
  .spyOn(AppDataSource.getRepository(PropertyClassification), 'find')
  .mockImplementation(async () => [produceClassification({ Name: 'Core Operational' })]);
jest
  .spyOn(AppDataSource.getRepository(BuildingConstructionType), 'find')
  .mockImplementation(async () => [produceConstructionType({ Name: 'Concrete' })]);
jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'find')
  .mockImplementation(async () => [produceAdminArea({ Name: 'TestArea' })]);
jest.spyOn(userServices, 'getAgencies').mockImplementation(async () => [1]);
jest
  .spyOn(AppDataSource.getRepository(ImportResult), 'save')
  .mockImplementation(async () => produceImportResult());

const _mockStartTransaction = jest.fn(async () => {});
const _mockRollbackTransaction = jest.fn(async () => {});
const _mockCommitTransaction = jest.fn(async () => {});

const _mockEntityManager = {
  find: async <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>) => {
    if (entityClass === Parcel) {
      return _findParcel();
    } else if (entityClass === Building) {
      return _findBuilding();
    } else if (entityClass === ParcelEvaluation) {
      return produceParcelEvaluation(1, { Year: 2023 });
    } else if (entityClass === ParcelFiscal) {
      return produceParcelFiscal(1, { FiscalYear: 2023 });
    } else if (entityClass === BuildingEvaluation) {
      return produceBuildingEvaluation(1, { Year: 2023 });
    } else if (entityClass === BuildingFiscal) {
      return produceBuildingFiscal(1, { FiscalYear: 2023 });
    } else {
      return [];
    }
  },
  save: async <Entity extends ObjectLiteral, T extends DeepPartial<Entity>>(
    entityClass: EntityTarget<Entity>,
    obj: T,
  ) => {
    if (entityClass === Parcel) {
      return produceParcel();
    } else if (entityClass === Building) {
      return produceBuilding();
    } else {
      return obj;
    }
  },
  findOne: async <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>) => {
    if (entityClass === Parcel) {
      return produceParcel();
    } else if (entityClass === Building) {
      return produceBuilding();
    } else {
      return {};
    }
  },
};

jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
  ...jest.requireActual('@/appDataSource').createQueryRunner,
  startTransaction: _mockStartTransaction,
  rollbackTransaction: _mockRollbackTransaction,
  commitTransaction: _mockCommitTransaction,
  release: jest.fn(async () => {}),
  manager: _mockEntityManager,
});

describe('UNIT - Property Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fuzzySearchProperties', () => {
    it('should return an object with parcels and buildings', async () => {
      const result = await propertyServices.propertiesFuzzySearch('123', 3);
      expect(Array.isArray(result.Parcels)).toBe(true);
      expect(Array.isArray(result.Buildings)).toBe(true);
    });
  });

  describe('getPropertyUnion', () => {
    it('should return a list of buildings and parcels', async () => {
      const result = await propertyServices.getPropertiesUnion({
        pid: 'contains,123',
        pin: 'contains,456',
        administrativeArea: 'contains,aaa',
        agency: 'startsWith,aaa',
        propertyType: 'contains,Building',
        sortKey: 'Agency',
        sortOrder: 'DESC',
        landArea: 'startsWith,1',
        address: 'contains,742 Evergreen Terr.',
        classification: 'contains,core',
        agencyId: [1],
        quantity: 2,
        page: 1,
        updatedOn: 'after,' + new Date(),
      });
      expect(Array.isArray(result));
      expect(result.at(0)).toHaveProperty('PropertyType');
      expect(result.at(0)).toHaveProperty('Id');
      expect(result.at(0)).toHaveProperty('PIN');
      expect(result.at(0)).toHaveProperty('PID');
      expect(result.at(0)).toHaveProperty('Agency');
      expect(result.at(0)).toHaveProperty('Classification');
      expect(result.at(0)).toHaveProperty('AdministrativeArea');
    });
  });

  describe('getPropertiesForMap', () => {
    it('should return a list of map property objects', async () => {
      const result = await propertyServices.getPropertiesForMap({
        Name: 'some name',
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result.at(0)).toHaveProperty('Id');
      expect(result.at(0)).toHaveProperty('Location');
      expect(result.at(0)).toHaveProperty('PropertyTypeId');
      expect(result.at(0)).toHaveProperty('ClassificationId');
    });

    it('should return a list of map property objects, assuming arrays are also sent', async () => {
      const result = await propertyServices.getPropertiesForMap({
        Address: 'some address',
        AgencyIds: [1, 2],
        PropertyTypeIds: [1],
        ClassificationIds: [5, 6],
        AdministrativeAreaIds: [12, 34],
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result.at(0)).toHaveProperty('Id');
      expect(result.at(0)).toHaveProperty('Location');
      expect(result.at(0)).toHaveProperty('PropertyTypeId');
      expect(result.at(0)).toHaveProperty('ClassificationId');
    });
  });

  describe('importPropertiesAsJSON', () => {
    it('should insert or update properties into database', async () => {
      jest.spyOn(xlsx.utils, 'sheet_to_json').mockImplementationOnce(() => [
        {
          PropertyType: 'Land',
          Status: 'Active',
          Classification: 'Core Operational',
          AgencyCode: 'TEST',
          AdministrativeArea: 'TestArea',
          Latitude: 50,
          Longitude: 50,
          Assessed: 1234,
          Netbook: 1234,
          FiscalYear: 2024,
          AssessedYear: 2024,
          PID: 1234,
          PIN: 1234,
          ConstructionType: 'Concrete',
        },
        {
          PropertyType: 'Building',
          Status: 'Active',
          Classification: 'Core Operational',
          AgencyCode: 'TEST',
          AdministrativeArea: 'TestArea',
          PredominateUse: 'Corporate',
          Latitude: 50,
          Longitude: 50,
          Assessed: 1234,
          Netbook: 1234,
          FiscalYear: 2024,
          AssessedYear: 2024,
          PID: 1234,
          PIN: 1234,
          ConstructionType: 'Concrete',
        },
        {
          PropertyType: 'BadPropertyType',
        },
      ]);
      const result = await propertyServices.importPropertiesAsJSON(
        {} as WorkSheet,
        produceUser(),
        [Roles.ADMIN],
        1,
      );
      expect(Array.isArray(result)).toBe(true);
    });
    it('should error out on all rows', async () => {
      jest.spyOn(xlsx.utils, 'sheet_to_json').mockImplementationOnce(() => [
        {
          PropertyType: 'Land',
          Status: 'Active',
        },
        {
          PropertyType: 'Building',
          Status: 'Active',
        },
      ]);
      const result = await propertyServices.importPropertiesAsJSON(
        {} as WorkSheet,
        produceUser(),
        [Roles.ADMIN],
        1,
      );
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
