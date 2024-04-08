import { AppDataSource } from '@/appDataSource';
import propertyServices from '@/services/properties/propertiesServices';
import { Building } from '@/typeorm/Entities/Building';
import { Parcel } from '@/typeorm/Entities/Parcel';
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

describe('UNIT - Property Services', () => {
  describe('fuzzySearchProperties', () => {
    it('should return an object with parcels and buildings', async () => {
      const result = await propertyServices.propertiesFuzzySearch('123', 3);
      expect(Array.isArray(result.Parcels)).toBe(true);
      expect(Array.isArray(result.Buildings)).toBe(true);
    });
  });
});
