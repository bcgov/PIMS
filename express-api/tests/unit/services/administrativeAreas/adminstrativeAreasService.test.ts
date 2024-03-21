import { AppDataSource } from '@/appDataSource';
import administrativeAreasServices from '@/services/administrativeAreas/administrativeAreasServices';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { produceAdminArea } from 'tests/testUtils/factories';

const _adminAreaFind = jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'find')
  .mockImplementation(async () => [produceAdminArea({})]);

describe('UNIT - admin area services', () => {
  describe('getAdminstrativeAreas', () => {
    it('should return a list of admin areas', async () => {
      const areas = await administrativeAreasServices.getAdministrativeAreas({});
      expect(_adminAreaFind).toHaveBeenCalled();
      expect(Array.isArray(areas)).toBe(true);
    });
  });
});
