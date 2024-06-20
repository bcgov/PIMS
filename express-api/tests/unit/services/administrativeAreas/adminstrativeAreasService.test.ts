import { AppDataSource } from '@/appDataSource';
import administrativeAreasServices from '@/services/administrativeAreas/administrativeAreasServices';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { produceAdminArea } from 'tests/testUtils/factories';

const _adminAreaFind = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'find')
  .mockImplementation(async () => [produceAdminArea({})]);

const _adminAreaFindOne = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'findOne')
  .mockImplementation(async () => produceAdminArea({}));

const _adminAreaUpdate = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'update')
  .mockImplementation(async () => ({ raw: {}, affected: 0, generatedMaps: [] }));

const _adminAreaSave = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'save')
  .mockImplementation(async () => produceAdminArea({}));

describe('UNIT - admin area services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('getAdminstrativeAreas', () => {
    it('should return a list of admin areas', async () => {
      const areas = await administrativeAreasServices.getAdministrativeAreas({
        name: 'endsWith,aaa',
        regionalDistrict: 'contains,aaa',
        isDisabled: 'contains,aaa',
        sortKey: 'RegionalDistrict',
        sortOrder: 'asc',
      });
      expect(_adminAreaFind).toHaveBeenCalled();
      expect(Array.isArray(areas)).toBe(true);
    });
    it('should return a list of admin areas', async () => {
      const areas = await administrativeAreasServices.getAdministrativeAreas({
        sortKey: 'Name',
        sortOrder: 'desc',
      });
      expect(_adminAreaFind).toHaveBeenCalled();
      expect(Array.isArray(areas)).toBe(true);
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
