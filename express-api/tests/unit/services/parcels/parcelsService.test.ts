import { AppDataSource } from '@/appDataSource';
import { Parcel } from '@/typeorm/Entities/Parcel';
import {
  produceParcel,
  produceParcelEvaluations,
  produceParcelFiscals,
  producePimsRequestUser,
  produceUser,
} from 'tests/testUtils/factories';
import parcelService from '@/services/parcels/parcelServices';
import { ParcelFilterSchema } from '@/services/parcels/parcelSchema';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { DeepPartial, UpdateResult } from 'typeorm';
import userServices from '@/services/users/usersServices';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { Roles } from '@/constants/roles';

const parcelRepo = AppDataSource.getRepository(Parcel);

const _parcelSave = jest
  .spyOn(parcelRepo, 'save')
  .mockImplementation(async (parcel: DeepPartial<Parcel> & Parcel) => parcel);

const _parcelFindOne = jest.spyOn(parcelRepo, 'findOne').mockImplementation(async () => {
  const parcel = produceParcel();
  const { Id } = parcel;
  produceParcelFiscals(Id);
  return parcel;
});

// const _parcelFiscalExists = jest
//   .spyOn(AppDataSource.getRepository(ParcelFiscal), 'exists')
//   .mockImplementation(async () => true);

// const _parcelEvaluationExists = jest
//   .spyOn(AppDataSource.getRepository(ParcelEvaluation), 'exists')
//   .mockImplementation(async () => true);

const _parcelEvaluationFindOne = jest
  .spyOn(AppDataSource.getRepository(ParcelEvaluation), 'findOne')
  .mockImplementation(async () => produceParcelEvaluations(1)[0]);
const _parcelFiscalFindOne = jest
  .spyOn(AppDataSource.getRepository(ParcelFiscal), 'findOne')
  .mockImplementation(async () => produceParcelFiscals(1)[0]);

// const _parcelFindOne = jest
//   .spyOn(parcelRepo, 'findOne')
//   .mockImplementation(async () => produceParcel());

jest.spyOn(AppDataSource.getRepository(ProjectProperty), 'find').mockImplementation(async () => []);

jest.spyOn(parcelRepo, 'find').mockImplementation(async () => [produceParcel(), produceParcel()]);

jest.spyOn(userServices, 'getUser').mockImplementation(async () => produceUser());
jest.spyOn(userServices, 'getAgencies').mockImplementation(async () => []);

jest
  .spyOn(AppDataSource.getRepository(ParcelEvaluation), 'find')
  .mockImplementation(async () => produceParcelEvaluations(1));
jest
  .spyOn(AppDataSource.getRepository(ParcelFiscal), 'find')
  .mockImplementation(async () => produceParcelFiscals(1));

const _mockStartTransaction = jest.fn(async () => {});
const _mockRollbackTransaction = jest.fn(async () => {});
const _mockCommitTransaction = jest.fn(async () => {});
const _mockParcelUpdate = jest.fn(async (): Promise<UpdateResult> => {
  return {
    raw: {},
    generatedMaps: [],
  };
});

const _mockEntityManager = {
  update: () => _mockParcelUpdate(),
};

jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
  ...jest.requireActual('@/appDataSource').createQueryRunner,
  startTransaction: _mockStartTransaction,
  rollbackTransaction: _mockRollbackTransaction,
  commitTransaction: _mockCommitTransaction,
  release: jest.fn(async () => {}),
  manager: _mockEntityManager,
});
const adminUser = producePimsRequestUser({ RoleId: Roles.ADMIN, hasOneOfRoles: () => true });
describe('UNIT - Parcel Services', () => {
  describe('addParcel', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should add a new parcel and return it', async () => {
      _parcelFindOne.mockResolvedValueOnce(null);
      const parcel = produceParcel();
      const ret = await parcelService.addParcel(parcel);
      expect(_parcelSave).toHaveBeenCalledTimes(1);
      expect(ret.Id).toBe(parcel.Id);
    });
    it('should throw an error if the parcel already exists', () => {
      const parcel = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(parcel);
      expect(async () => await parcelService.addParcel(parcel)).rejects.toThrow();
    });
    // it('should throw an error if PID is not in schema', () => {
    //   const parcel = {};
    //   expect(async () => await parcelService.addParcel(parcel)).rejects.toThrow();
    // });
    it('should throw an error if the PID is too short', () => {
      const parcel = { PID: 11111111 };
      expect(async () => await parcelService.addParcel(parcel)).rejects.toThrow();
    });
    it('should throw an error if the PID is too long', () => {
      const parcel = { PID: 1111111111 };
      expect(async () => await parcelService.addParcel(parcel)).rejects.toThrow();
    });
    it('should throw an error if the save statement fails', () => {
      _parcelFindOne.mockResolvedValueOnce(null);
      const parcel = produceParcel();
      _parcelSave.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await parcelService.addParcel(parcel)).rejects.toThrow();
    });
  });

  describe('deleteParcelByPid', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should delete a parcel and return a 204 status code', async () => {
      const parcelToDelete = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(parcelToDelete);
      await parcelService.deleteParcelById(parcelToDelete.Id, adminUser);
      expect(_mockParcelUpdate).toHaveBeenCalledTimes(3);
    });
    it('should throw an error if the PID does not exist in the parcel table', () => {
      const parcelToDelete = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(null);
      expect(
        async () => await parcelService.deleteParcelById(parcelToDelete.Id, adminUser),
      ).rejects.toThrow();
    });
    it('should throw an error if the Parcel has a child Parcel relationship', async () => {
      const newParentParcel = produceParcel();
      const errorMessage = `update or delete on table "parcel" violates foreign key constraint "FK_9720341fe17e4c22decf0a0b87f" on table "parcel"`;
      _parcelFindOne.mockResolvedValueOnce(newParentParcel);
      _mockParcelUpdate.mockImplementationOnce(() => {
        throw new ErrorWithCode(errorMessage);
      });
      expect(
        async () => await parcelService.deleteParcelById(newParentParcel.Id, adminUser),
      ).rejects.toThrow();
    });
  });

  describe('getParcels', () => {
    it('should return a list of parcels', async () => {
      const parcels = await parcelService.getParcels({});
      expect(parcels).toHaveLength(2);
    });
  });

  describe('updateParcels', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should update an existing parcel', async () => {
      _parcelFindOne.mockResolvedValueOnce({ ...produceParcel(), Id: 1 });
      const updateParcel = { ...produceParcel(), Id: 1 };
      await parcelService.updateParcel(updateParcel, adminUser);
      expect(_parcelSave).toHaveBeenCalledTimes(1);
    });
    it('should throw an error if the parcel is not found.', async () => {
      const updateParcel = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(null);
      expect(
        async () => await parcelService.updateParcel(updateParcel, adminUser),
      ).rejects.toThrow();
    });
    it('should throw and error if parcel is unable to be updated', async () => {
      const updateParcel = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(updateParcel);
      _parcelSave.mockImplementationOnce(() => {
        throw new ErrorWithCode('errorMessage');
      });
      expect(
        async () => await parcelService.updateParcel(updateParcel, adminUser),
      ).rejects.toThrow();
    });
    it('should throw an error if PID is not in schema', () => {
      const parcel = {};
      expect(async () => await parcelService.updateParcel(parcel, adminUser)).rejects.toThrow();
    });

    it('should update Fiscals and Evaluations when they exist in the building object', async () => {
      const updateParcel = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(updateParcel);

      await parcelService.updateParcel(updateParcel, adminUser);
      expect(_parcelFiscalFindOne).toHaveBeenCalledTimes(1);
      expect(_parcelEvaluationFindOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getParcelByPid', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should return an error if the database fails', () => {
      const searchPID = 999999999;
      _parcelFindOne.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await parcelService.getParcelByPid(searchPID)).rejects.toThrow();
    });
  });
});

describe('UNIT - ParcelFilterSchema', () => {
  it('should validate partial or complete filters', () => {
    // Empty filter
    expect(() => ParcelFilterSchema.parse({})).not.toThrow();
    // Partial filter
    expect(() =>
      ParcelFilterSchema.parse({
        agencyId: 3,
      }),
    ).not.toThrow();
    // Filter with only page
    expect(() =>
      ParcelFilterSchema.parse({
        page: 3,
        quantity: 50,
      }),
    ).not.toThrow();
  });
  it('should throw an error when invalid filters are given', () => {
    expect(() =>
      ParcelFilterSchema.parse({
        agencyId: 'hi',
      }),
    ).toThrow();
  });
});
