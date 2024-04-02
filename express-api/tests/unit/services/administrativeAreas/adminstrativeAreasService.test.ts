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

describe('UNIT - admin area services', () => {
  describe('getAdminstrativeAreas', () => {
    it('should return a list of admin areas', async () => {
      const areas = await administrativeAreasServices.getAdministrativeAreas({});
      expect(_adminAreaFind).toHaveBeenCalled();
      expect(Array.isArray(areas)).toBe(true);
    });
  });
  describe('getAdministrativeAreaById', () => {
    it('should return a list of admin areas', async () => {
      await administrativeAreasServices.getAdministrativeAreaById(1);
      expect(_adminAreaFindOne).toHaveBeenCalled();
    });
  });
  describe('updateAdministrativeArea', () => {
    it('should return a list of admin areas', async () => {
      await administrativeAreasServices.updateAdministrativeArea({ SortOrder: 0 });
      expect(_adminAreaUpdate).toHaveBeenCalled();
    });
  });
});
