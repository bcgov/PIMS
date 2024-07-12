import { AppDataSource } from '@/appDataSource';
import administrativeAreasServices from '@/services/administrativeAreas/administrativeAreasServices';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { AdministrativeAreaJoinView } from '@/typeorm/Entities/views/AdministrativeAreaJoinView';
import { faker } from '@faker-js/faker';
import { produceAdminArea } from 'tests/testUtils/factories';

const _adminAreaFindOne = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'findOne')
  .mockImplementation(async () => produceAdminArea({}));

const _adminAreaUpdate = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'update')
  .mockImplementation(async () => ({ raw: {}, affected: 0, generatedMaps: [] }));

const _adminAreaSave = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'save')
  .mockImplementation(async () => produceAdminArea({}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _adminAreaJoinView: any = {
  select: () => _adminAreaJoinView,
  leftJoinAndSelect: () => _adminAreaJoinView,
  where: () => _adminAreaJoinView,
  orWhere: () => _adminAreaJoinView,
  andWhere: () => _adminAreaJoinView,
  take: () => _adminAreaJoinView,
  skip: () => _adminAreaJoinView,
  orderBy: () => _adminAreaJoinView,
  getMany: () => [produceAdminArea()],
  getManyAndCount: () => [[produceAdminArea()], 1],
};

jest
  .spyOn(AppDataSource.getRepository(AdministrativeAreaJoinView), 'createQueryBuilder')
  .mockImplementation(() => _adminAreaJoinView);

describe('UNIT - admin area services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('getAdminstrativeAreas', () => {
    it('should return a list of admin areas', async () => {
      const areas = await administrativeAreasServices.getAdministrativeAreas({
        name: 'endsWith,aaa',
        regionalDistrictName: 'contains,aaa',
        isDisabled: 'contains,aaa',
        sortKey: 'RegionalDistrictName',
        sortOrder: 'asc',
        quantity: 1,
        page: 1,
        quickFilter: 'wow',
        createdOn: faker.date.recent().toUTCString(),
        updatedOn: faker.date.recent().toUTCString(),
      });
      expect(Array.isArray(areas.data)).toBe(true);
      expect(areas.totalCount).toBe(1);
    });
    it('should return a list of admin areas and trigger invalid sort key', async () => {
      const areas = await administrativeAreasServices.getAdministrativeAreas({
        sortKey: 'wow',
        sortOrder: 'desc',
      });
      expect(Array.isArray(areas.data)).toBe(true);
      expect(areas.totalCount).toBe(1);
    });
  });
  describe('getAdministrativeAreaById', () => {
    it('should an admin area', async () => {
      await administrativeAreasServices.getAdministrativeAreaById(1);
      expect(_adminAreaFindOne).toHaveBeenCalled();
    });
  });
  describe('updateAdministrativeArea', () => {
    it('should an admin area', async () => {
      await administrativeAreasServices.updateAdministrativeArea({ SortOrder: 0 });
      expect(_adminAreaUpdate).toHaveBeenCalled();
    });
  });
  describe('addAdministrativeArea', () => {
    it('should return an admin area', async () => {
      _adminAreaFindOne.mockImplementationOnce(() => null);
      await administrativeAreasServices.addAdministrativeArea(produceAdminArea({}));
      expect(_adminAreaSave).toHaveBeenCalled();
      expect(_adminAreaFindOne).toHaveBeenCalledTimes(1);
    });
  });
});
