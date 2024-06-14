import { AppDataSource } from '@/appDataSource';
import { Agency } from '@/typeorm/Entities/Agency';
import { produceAgency } from 'tests/testUtils/factories';
import * as agencyServices from '@/services/agencies/agencyServices';
import { DeepPartial } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

const _agencyFind = jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => [produceAgency()]);
const _agencySave = jest
  .spyOn(AppDataSource.getRepository(Agency), 'save')
  .mockImplementation(async (agency: DeepPartial<Agency> & Agency) => agency);
const _agencyFindOne = jest
  .spyOn(AppDataSource.getRepository(Agency), 'findOne')
  .mockImplementation(async () => produceAgency());
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

    it('should throw an error if the new agency name or code is already taken', async () => {
      _agencyFind.mockResolvedValueOnce([produceAgency()]);
      const addagency = produceAgency();
      expect(async () => await agencyServices.addAgency(addagency)).rejects.toThrow();
    });
  });
  describe('updateAgencyById', () => {
    it('should update an agency and return it', async () => {
      const upagency = produceAgency();
      _agencyFind.mockImplementationOnce(async () => [upagency]);
      await agencyServices.updateAgencyById(upagency);
      expect(_agencySave).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the agency is not found', async () => {
      _agencyFind.mockImplementationOnce(async () => []);
      const upagency = produceAgency();
      expect(async () => await agencyServices.updateAgencyById(upagency)).rejects.toThrow(
        new ErrorWithCode(`Agency not found.`, 404),
      );
    });

    it('should throw an error if the parent Id is not found', async () => {
      const agencyId = 1;
      const upagency = produceAgency({ Id: agencyId, ParentId: agencyId + 1 });
      _agencyFind.mockImplementationOnce(async () => [upagency]);
      expect(async () => await agencyServices.updateAgencyById(upagency)).rejects.toThrow(
        new ErrorWithCode(`Requested Parent Agency Id ${upagency.ParentId} not found.`, 404),
      );
    });

    it('should throw an error if the updated agency is already a parent agency', async () => {
      const agencyId = 1;
      const childAgency = produceAgency({ Id: agencyId + 2, ParentId: agencyId });
      const parentAgency = produceAgency({ Id: agencyId - 1 });
      const upagency = produceAgency({ Id: agencyId, ParentId: parentAgency.Id });
      _agencyFind.mockImplementationOnce(async () => [upagency, childAgency, parentAgency]);
      expect(async () => await agencyServices.updateAgencyById(upagency)).rejects.toThrow(
        new ErrorWithCode('Cannot assign Parent Agency to existing Parent Agency.', 400),
      );
    });

    it('should throw an error if the parent agency id belongs to a child agency', async () => {
      const agencyId = 1;
      const parentAgency = produceAgency({ Id: agencyId - 1, ParentId: agencyId + 1 });
      const upagency = produceAgency({ Id: agencyId, ParentId: parentAgency.Id });
      _agencyFind.mockImplementationOnce(async () => [upagency, parentAgency]);
      expect(async () => await agencyServices.updateAgencyById(upagency)).rejects.toThrow(
        new ErrorWithCode('Cannot assign a child agency as a Parent Agency.', 400),
      );
    });
  });

  describe('deleteAgencyById', () => {
    it('should delete an agency and return it', async () => {
      const delagency = produceAgency();
      await agencyServices.deleteAgencyById(delagency.Id);
      expect(_agencyDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the agency is not found', async () => {
      _agencyFindOne.mockImplementationOnce(async () => null);
      const delagency = produceAgency();
      expect(async () => await agencyServices.deleteAgencyById(delagency.Id)).rejects.toThrow(
        new ErrorWithCode(`Agency not found.`, 404),
      );
    });
  });
});
