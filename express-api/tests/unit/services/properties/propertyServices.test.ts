/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDataSource } from '@/appDataSource';
import { PropertyType } from '@/constants/propertyType';
import { Roles } from '@/constants/roles';
import propertyServices, {
  getAgencyOrThrowIfMismatched,
  getBuildingPredominateUseOrThrow,
  getBuildingConstructionTypeOrThrow,
  getClassificationOrThrow,
  Lookups,
  setNewBool,
  checkForHeaders,
  getAdministrativeAreaOrThrow,
  filterPropertiesByMultiPolygon,
} from '@/services/properties/propertiesServices';
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
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { User } from '@/typeorm/Entities/User';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import { PropertyUnion } from '@/typeorm/Entities/views/PropertyUnionView';
import logger from '@/utilities/winstonLogger';
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
  produceParcelEvaluations,
  produceParcelFiscals,
  produceBuildingEvaluations,
  produceBuildingFiscals,
  produceProjectStatus,
  produceProjectProperty,
  produceImportRow,
  producePimsRequestUser,
  producePropertyForMap,
} from 'tests/testUtils/factories';
import { DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';
import xlsx, { WorkSheet } from 'xlsx';

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

const _buildingsCreateQueryBuilder: any = {
  select: () => _buildingsCreateQueryBuilder,
  leftJoinAndSelect: () => _buildingsCreateQueryBuilder,
  where: () => _buildingsCreateQueryBuilder,
  orWhere: () => _buildingsCreateQueryBuilder,
  andWhere: () => _buildingsCreateQueryBuilder,
  take: () => _buildingsCreateQueryBuilder,
  skip: () => _buildingsCreateQueryBuilder,
  orderBy: () => _buildingsCreateQueryBuilder,
  getMany: () => [produceBuilding()],
};

const _propertyUnionCreateQueryBuilder: any = {
  select: () => _propertyUnionCreateQueryBuilder,
  leftJoinAndSelect: () => _propertyUnionCreateQueryBuilder,
  where: () => _propertyUnionCreateQueryBuilder,
  orWhere: () => _propertyUnionCreateQueryBuilder,
  andWhere: () => _propertyUnionCreateQueryBuilder,
  take: () => _propertyUnionCreateQueryBuilder,
  skip: () => _propertyUnionCreateQueryBuilder,
  orderBy: () => _propertyUnionCreateQueryBuilder,
  getMany: () => [
    producePropertyUnion({ Id: 1, PropertyTypeId: PropertyType.LAND }),
    producePropertyUnion({ Id: 1, PropertyTypeId: PropertyType.BUILDING }),
  ],
  getManyAndCount: () => [
    [
      producePropertyUnion({ Id: 1, PropertyTypeId: PropertyType.LAND }),
      producePropertyUnion({ Id: 1, PropertyTypeId: PropertyType.BUILDING }),
    ],
    1,
  ],
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const _projectStatusCreateQueryBuilder: any = {
  select: () => _projectStatusCreateQueryBuilder,
  leftJoinAndSelect: () => _projectStatusCreateQueryBuilder,
  where: () => _projectStatusCreateQueryBuilder,
  orWhere: () => _projectStatusCreateQueryBuilder,
  andWhere: () => _projectStatusCreateQueryBuilder,
  take: () => _projectStatusCreateQueryBuilder,
  skip: () => _projectStatusCreateQueryBuilder,
  orderBy: () => _projectStatusCreateQueryBuilder,
  getMany: () => [produceProjectStatus()],
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const _projectPropertyCreateQueryBuilder: any = {
  select: () => _projectPropertyCreateQueryBuilder,
  leftJoinAndSelect: () => _projectPropertyCreateQueryBuilder,
  where: () => _projectPropertyCreateQueryBuilder,
  orWhere: () => _projectPropertyCreateQueryBuilder,
  andWhere: () => _projectPropertyCreateQueryBuilder,
  take: () => _projectPropertyCreateQueryBuilder,
  skip: () => _projectPropertyCreateQueryBuilder,
  orderBy: () => _projectPropertyCreateQueryBuilder,
  getMany: () => [produceProjectProperty()],
  getRawMany: () => [
    {
      project_number: 1,
      id: 1,
      status_name: 'test',
      description: 'test',
    },
  ],
};

jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'createQueryBuilder')
  .mockImplementation(() => _projectPropertyCreateQueryBuilder);

jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'find')
  .mockImplementation(async () => [produceProjectProperty()]);

jest
  .spyOn(AppDataSource.getRepository(ProjectStatus), 'createQueryBuilder')
  .mockImplementation(() => _projectStatusCreateQueryBuilder);

jest
  .spyOn(AppDataSource.getRepository(ProjectStatus), 'find')
  .mockImplementation(async () => [produceProjectStatus()]);

jest
  .spyOn(AppDataSource.getRepository(Parcel), 'createQueryBuilder')
  .mockImplementation(() => _parcelsCreateQueryBuilder);

jest
  .spyOn(AppDataSource.getRepository(Building), 'createQueryBuilder')
  .mockImplementation(() => _buildingsCreateQueryBuilder);

jest.spyOn(AppDataSource.getRepository(MapProperties), 'find').mockImplementation(async () => [
  producePropertyForMap({
    Id: 1,
    Location: {
      x: 1,
      y: 1,
    },
    PropertyTypeId: 0,
    ClassificationId: 3,
  }),
]);

jest
  .spyOn(AppDataSource.getRepository(PropertyUnion), 'createQueryBuilder')
  .mockImplementation(() => _propertyUnionCreateQueryBuilder);

const parcelRepoSpy = jest
  .spyOn(AppDataSource.getRepository(Parcel), 'find')
  .mockImplementation(async () => [produceParcel()]);
const buildingRepoSpy = jest
  .spyOn(AppDataSource.getRepository(Building), 'find')
  .mockImplementation(async () => [produceBuilding()]);
jest
  .spyOn(AppDataSource.getRepository(ParcelEvaluation), 'find')
  .mockImplementation(async () => produceParcelEvaluations(1));
jest
  .spyOn(AppDataSource.getRepository(ParcelFiscal), 'find')
  .mockImplementation(async () => produceParcelFiscals(1));
jest
  .spyOn(AppDataSource.getRepository(BuildingEvaluation), 'find')
  .mockImplementation(async () => produceBuildingEvaluations(1));
jest
  .spyOn(AppDataSource.getRepository(BuildingFiscal), 'find')
  .mockImplementation(async () => produceBuildingFiscals(1));
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
jest
  .spyOn(AppDataSource.getRepository(ImportResult), 'find')
  .mockImplementation(async () => [produceImportResult()]);
jest
  .spyOn(AppDataSource.getRepository(User), 'findOneBy')
  .mockImplementation(async () => produceUser());

const _mockStartTransaction = jest.fn(async () => {});
const _mockRollbackTransaction = jest.fn(async () => {});
const _mockCommitTransaction = jest.fn(async () => {});

const _mockEntityManager = {
  find: async <Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>) => {
    if (entityClass === Parcel) {
      return produceParcel();
    } else if (entityClass === Building) {
      return produceBuilding();
    } else if (entityClass === ParcelEvaluation) {
      return produceParcelEvaluations(1, { Year: 2023 });
    } else if (entityClass === ParcelFiscal) {
      return produceParcelFiscals(1, { FiscalYear: 2023 });
    } else if (entityClass === BuildingEvaluation) {
      return produceBuildingEvaluations(1, { Year: 2023 });
    } else if (entityClass === BuildingFiscal) {
      return produceBuildingFiscals(1, { FiscalYear: 2023 });
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
      const result = await propertyServices.propertiesFuzzySearch('123', 3, [3]);
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
        agencyIds: [1],
        quantity: 2,
        page: 1,
        updatedOn: 'after,' + new Date(),
        quickFilter: 'contains,someWord',
        projectStatus: 'is,Cancelled',
      });
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.at(0)).toHaveProperty('PropertyType');
      expect(result.data.at(0)).toHaveProperty('Id');
      expect(result.data.at(0)).toHaveProperty('PIN');
      expect(result.data.at(0)).toHaveProperty('PID');
      expect(result.data.at(0)).toHaveProperty('Agency');
      expect(result.data.at(0)).toHaveProperty('Classification');
      expect(result.data.at(0)).toHaveProperty('AdministrativeArea');
    });

    it('should log an invalid sort key if the key is invalid', async () => {
      const loggerErrorSpy = jest.spyOn(logger, 'error');
      await propertyServices.getPropertiesUnion({
        sortKey: 'aaaaa',
        sortOrder: 'DESC',
      });
      expect(loggerErrorSpy).toHaveBeenCalledWith('PropertyUnion Service - Invalid Sort Key');
    });
  });

  describe('getPropertiesforExport', () => {
    it('should get a list of properties based on the filter', async () => {
      parcelRepoSpy.mockImplementationOnce(async () => [produceParcel({ Id: 1 })]);
      buildingRepoSpy.mockImplementationOnce(async () => [produceBuilding({ Id: 1 })]);
      const result = await propertyServices.getPropertiesForExport({
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
        agencyIds: [1],
        quantity: 2,
        page: 1,
        updatedOn: 'after,' + new Date(),
        quickFilter: 'contains,someWord',
      });
      expect(Array.isArray(result)).toBe(true);
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
        Polygon: JSON.stringify([
          [
            [3, 3],
            [3, 0],
            [0, 0],
            [0, 3],
          ],
        ]),
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

    it('should return a list of map property objects, following the UserAgencies filter path', async () => {
      const result = await propertyServices.getPropertiesForMap({
        Name: 'some name',
        UserAgencies: [1],
        AgencyIds: [1],
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result.at(0)).toHaveProperty('Id');
      expect(result.at(0)).toHaveProperty('Location');
      expect(result.at(0)).toHaveProperty('PropertyTypeId');
      expect(result.at(0)).toHaveProperty('ClassificationId');
    });

    it('should return a list of map property objects, following the UserAgencies filter path with polygon filter', async () => {
      const result = await propertyServices.getPropertiesForMap({
        Name: 'some name',
        UserAgencies: [1],
        AgencyIds: [1],
        Polygon: JSON.stringify([
          [
            [3, 3],
            [3, 0],
            [0, 0],
            [0, 3],
          ],
        ]),
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result.at(0)).toHaveProperty('Id');
      expect(result.at(0)).toHaveProperty('Location');
      expect(result.at(0)).toHaveProperty('PropertyTypeId');
      expect(result.at(0)).toHaveProperty('ClassificationId');
    });
  });

  describe('getImportResults', () => {
    it('should return a list of import results', async () => {
      const result = await propertyServices.getImportResults(
        {
          quantity: 1,
        },
        producePimsRequestUser(),
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result.at(0)).toHaveProperty('CompletionPercentage');
    });
  });

  describe('importPropertiesAsJSON', () => {
    it('should insert or update properties into database', async () => {
      jest
        .spyOn(xlsx.utils, 'sheet_to_json')
        .mockImplementationOnce(() => [
          [
            'PropertyType',
            'PID',
            'Name',
            'Classification',
            'AgencyCode',
            'AdministrativeArea',
            'Longitude',
            'Latitude',
            'Name',
            'PredominateUse',
            'ConstructionType',
          ],
        ]);
      jest.spyOn(xlsx.utils, 'sheet_to_json').mockImplementationOnce(() => [
        {
          PropertyType: 'Land',
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
      jest
        .spyOn(xlsx.utils, 'sheet_to_json')
        .mockImplementationOnce(() => [
          [
            'PropertyType',
            'PID',
            'Name',
            'Classification',
            'AgencyCode',
            'AdministrativeArea',
            'Longitude',
            'Latitude',
            'Name',
            'PredominateUse',
            'ConstructionType',
          ],
        ]);
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

  describe('getClassificationOrThrow', () => {
    it('should return a classification if found', () => {
      const result = getClassificationOrThrow(
        {
          Classification: 'Surplus',
        },
        [produceClassification({ Name: 'Surplus', Id: 1 })],
      );
      expect(result).toEqual(1);
    });

    it('should throw an error if there is no classification with a matching name', () => {
      expect(() =>
        getClassificationOrThrow(
          {
            Classification: 'Not Surplus',
          },
          [produceClassification({ Name: 'Surplus', Id: 1 })],
        ),
      ).toThrow();
    });
  });

  describe('getAdministrativeAreaOrThrow', () => {
    it('should throw an error if the administrativeArea is not found', () => {
      expect(() =>
        getAdministrativeAreaOrThrow(
          {
            AdministrativeArea: 'Victoria',
          },
          [produceAdminArea({ Name: 'Vancouver', Id: 1 })],
        ),
      ).toThrow();
    });
  });

  describe('getBuildingPredominateUseOrThrow', () => {
    it('should return a buildingPredominateUse if found', () => {
      const result = getBuildingPredominateUseOrThrow(
        {
          PredominateUse: 'Mixed',
        },
        [producePredominateUse({ Name: 'Mixed', Id: 1 })],
      );
      expect(result).toEqual(1);
    });
    it('should throw an error if there is no buildingPredominateUse with a matching name', () => {
      expect(() =>
        getBuildingPredominateUseOrThrow(
          {
            PredominateUse: 'Mixed',
          },
          [producePredominateUse({ Name: 'Not Mixed', Id: 1 })],
        ),
      ).toThrow();
    });
  });

  describe('getBuildingConstructionTypeOrThrow', () => {
    it('should return a buildingConstructionType if found', () => {
      const result = getBuildingConstructionTypeOrThrow(
        {
          ConstructionType: 'Mixed',
        },
        [produceConstructionType({ Name: 'Mixed', Id: 1 })],
      );
      expect(result).toEqual(1);
    });
    it('should throw an error if there is no buildingConstructionType with a matching name', () => {
      expect(() =>
        getBuildingConstructionTypeOrThrow(
          {
            ConstructionType: 'Mixed',
          },
          [produceConstructionType({ Name: 'Not Mixed', Id: 1 })],
        ),
      ).toThrow();
    });
  });

  describe('getAgencyOrThrowIfMismatched', () => {
    it('should return an agency in if it exists', () => {
      const agency = produceAgency({ Code: 'WLRS' });
      const result = getAgencyOrThrowIfMismatched(
        {
          AgencyCode: 'WLRS',
        },
        {
          agencies: [agency],
        } as Lookups,
        [Roles.ADMIN],
      );
      expect(result.Code).toBe(agency.Code);
    });

    it('should throw an error if agency is not found', () => {
      const agency = produceAgency({ Code: 'WLRS' });
      expect(() =>
        getAgencyOrThrowIfMismatched(
          {
            AgencyCode: 'TEST',
          },
          {
            agencies: [agency],
          } as Lookups,
          [Roles.ADMIN],
        ),
      ).toThrow();
    });

    it('should throw an error if the user does not have permissions', () => {
      const agency = produceAgency({ Code: 'WLRS', Id: 1 });
      expect(() =>
        getAgencyOrThrowIfMismatched(
          {
            AgencyCode: 'WLRS',
          },
          {
            agencies: [{ ...agency, Id: 999 }],
            userAgencies: [],
          } as Lookups,
          [],
        ),
      ).toThrow();
    });
  });

  describe('checkForHeaders', () => {
    it('should throw new error if a header is missing', () => {
      const sheetObj = [
        {
          PropertyType: 'Building',
        },
      ];
      const colArray = [
        'PropertyType',
        'PID',
        'Classification',
        'AgencyCode',
        'AdministrativeArea',
        'Latitude',
        'Longitude',
      ];
      expect(() => checkForHeaders(sheetObj, colArray)).toThrow();
    });
  });

  describe('setNewBool', () => {
    it('should return the first argument if it is set', () => {
      const newValue: boolean = true;
      const previousValue: boolean = undefined;
      const defaultValue: boolean = undefined;
      const returnedBool = setNewBool(newValue, previousValue, defaultValue);
      expect(() => returnedBool === newValue);
    });
    it('should return the second argument if first is not set and second is', () => {
      const newValue: boolean = undefined;
      const previousValue: boolean = true;
      const defaultValue: boolean = undefined;
      const returnedBool = setNewBool(newValue, previousValue, defaultValue);
      expect(() => returnedBool === previousValue);
    });
  });

  describe('makeBuildingUpsertObject', () => {
    const importRow = produceImportRow({
      Netbook: 2,
      FiscalYear: 2024,
      Assessed: 3,
      AssessedYear: 2023,
    });
    const agency = produceAgency({ Code: importRow.AgencyCode });
    const lookups: Lookups = {
      classifications: [produceClassification({ Name: importRow.Classification })],
      adminAreas: [produceAdminArea({ Name: importRow.AdministrativeArea })],
      agencies: [agency],
      predominateUses: [producePredominateUse({ Name: importRow.PredominateUse })],
      userAgencies: [agency.Id],
      constructionTypes: [produceConstructionType({ Name: importRow.ConstructionType })],
    };
    it('should return a new building object when that building does not exist', async () => {
      const queryRunner = AppDataSource.createQueryRunner();
      const result = await propertyServices.makeBuildingUpsertObject(
        importRow,
        produceUser({ AgencyId: agency.Id }),
        [Roles.ADMIN],
        lookups,
        queryRunner,
      );
      // Some fields will be what we passed in
      expect(result.PID).toBe(importRow.PID);
      // Some will be defaults because we didn't import those
      expect(result.IsSensitive).toBe(false);
      expect(result.TotalArea).toBe(0);
      expect(result.BuildingTenancy).toBe('');
    });
  });

  describe('findLinkedProjectsForProperty', () => {
    it('should return the mapped list of linked projects', async () => {
      const result = await propertyServices.findLinkedProjectsForProperty(1);
      expect(Array.isArray(result)).toBe(true);
      expect((result as unknown as any[])[0].StatusName).toBe('test');
    });
  });

  describe('filterPropertiesByMultiPolygon', () => {
    const _isPointInMultiPolygonSpy = jest.fn();
    jest.mock('@/utilities/polygonMath', () => ({
      isPointInMultiPolygon: _isPointInMultiPolygonSpy,
    }));
    const multiPolygon = [
      [
        [0, 0],
        [0, 3],
        [3, 3],
        [3, 0],
      ],
      [
        [5, 0],
        [5, 3],
        [8, 3],
        [8, 0],
      ],
    ];

    it('should remove properties outside of the polygons', () => {
      // Three properties, last one shouldn't pass, so true, true, false
      _isPointInMultiPolygonSpy
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const properties = [
        producePropertyForMap({ Location: { x: 1, y: 1 } }),
        producePropertyForMap({ Location: { x: 1, y: 1 } }),
        producePropertyForMap({ Location: { x: 10, y: 1 } }),
      ];
      const result = filterPropertiesByMultiPolygon(multiPolygon, properties);
      expect(result.length).toEqual(2);
      expect(result.at(0).Location.x).toEqual(1);
      expect(result.at(1).Location.x).toEqual(1);
    });
  });
});
