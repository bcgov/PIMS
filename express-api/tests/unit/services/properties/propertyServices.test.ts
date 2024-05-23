import { AppDataSource } from '@/appDataSource';
import propertyServices from '@/services/properties/propertiesServices';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';
import { produceParcel, produceBuilding } from 'tests/testUtils/factories';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _parcelsCreateQueryBuilder: any = {
  select: () => _parcelsCreateQueryBuilder,
  leftJoinAndSelect: () => _parcelsCreateQueryBuilder,
  where: () => _parcelsCreateQueryBuilder,
  orWhere: () => _parcelsCreateQueryBuilder,
  take: () => _parcelsCreateQueryBuilder,
  getMany: () => [produceParcel()],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _buildingsCreateQueryBuilder: any = {
  select: () => _parcelsCreateQueryBuilder,
  leftJoinAndSelect: () => _parcelsCreateQueryBuilder,
  where: () => _parcelsCreateQueryBuilder,
  orWhere: () => _parcelsCreateQueryBuilder,
  take: () => _parcelsCreateQueryBuilder,
  getMany: () => [produceBuilding()],
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
});
