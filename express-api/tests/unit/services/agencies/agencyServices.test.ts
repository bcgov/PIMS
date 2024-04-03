import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { produceAgency } from 'tests/testUtils/factories';
import * as agencyServices from '@/services/agencies/agencyServices';
import { DeepPartial } from 'typeorm';

const _agencyFind = jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => [produceAgency()]);
const _agencySave = jest
  .spyOn(AppDataSource.getRepository(Agency), 'save')
  .mockImplementation(async (agency: DeepPartial<Agency> & Agency) => agency);
const _agencyFindOne = jest
  .spyOn(AppDataSource.getRepository(Agency), 'findOne')
  .mockImplementation(async () => produceAgency());
const _agencyUpdate = jest
  .spyOn(AppDataSource.getRepository(Agency), 'update')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));
const _agencyDelete = jest
  .spyOn(AppDataSource.getRepository(Agency), 'delete')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

describe('UNIT - agency services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('getAgencies', () => {
    it('should get a list of agencies', async () => {
      const agencies = await agencyServices.getAgencies({});
      expect(_agencyFind).toHaveBeenCalledTimes(1);
      expect(Array.isArray(agencies)).toBe(true);
    });
  });
  describe('getAgencyById', () => {
    it('should get one agency with the specified id', async () => {
      const getagency = produceAgency();
      _agencyFindOne.mockResolvedValueOnce(getagency);
      const agency = await agencyServices.getAgencyById(getagency.Id);
      expect(agency.Id).toBe(getagency.Id);
      expect(_agencyFindOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('addAgency', () => {
    it('should add an agency and return it', async () => {
      _agencyFind.mockResolvedValueOnce([]);
      const addagency = produceAgency();
      const agency = await agencyServices.addAgency(addagency);
      expect(agency.Id).toBe(addagency.Id);
      expect(_agencySave).toHaveBeenCalledTimes(1);
    });
  });
  describe('updateAgencyById', () => {
    it('should update an agency and return it', async () => {
      const upagency = produceAgency();
      await agencyServices.updateAgencyById(upagency);
      expect(_agencyUpdate).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteAgencyById', () => {
    it('should delete an agency and return it', async () => {
      const delagency = produceAgency();
      await agencyServices.deleteAgencyById(delagency.Id);
      expect(_agencyDelete).toHaveBeenCalledTimes(1);
    });
  });
});
