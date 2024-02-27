import { AppDataSource } from '@/appDataSource';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { produceParcel } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';
import * as parcelService from '@/services/parcels/parcelServices';
import { ParcelFilterSchema } from '@/services/parcels/parcelSchema';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

//jest.setTimeout(30000);

const parcelRepo = AppDataSource.getRepository(Parcel);

const _parcelSave = jest
  .spyOn(parcelRepo, 'save')
  .mockImplementation(async (parcel: DeepPartial<Parcel> & Parcel) => parcel);

const _parcelDelete = jest
  .spyOn(parcelRepo, 'delete')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

const _parcelFindOne = jest
  .spyOn(parcelRepo, 'findOne')
  .mockImplementation(async () => produceParcel());

const _parcelUpdate = jest
  .spyOn(parcelRepo, 'update')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

jest.spyOn(parcelRepo, 'find').mockImplementation(async () => [produceParcel(), produceParcel()]);

describe('UNIT - Parcel Services', () => {
  describe('addParcel', () => {
    it('should add a new parcel and return it', async () => {
      _parcelFindOne.mockResolvedValueOnce(null);
      const parcel = produceParcel();
      const ret = await parcelService.addParcel(parcel);
      expect(_parcelSave).toHaveBeenCalledTimes(1);
      expect(ret.Id).toBe(parcel.Id);
    });
    it('should throw an error if the agency already exists', () => {
      const parcel = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(parcel);
      expect(async () => await parcelService.addParcel(parcel)).rejects.toThrow();
    });
  });

  describe('deleteParcelByPid', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should delete a parcel and return a 204 status code', async () => {
      const parcelToDelete = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(parcelToDelete);
      await parcelService.deleteParcelByPid(parcelToDelete.PID);
      expect(_parcelDelete).toHaveBeenCalledTimes(1);
    });
    it('should throw an error if the PID does not exist in the parcel table', () => {
      const parcelToDelete = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(null);
      expect(
        async () => await parcelService.deleteParcelByPid(parcelToDelete.PID),
      ).rejects.toThrow();
    });
    it('should throw an error if the Parcel has a child Parcel relationship', async () => {
      const newParentParcel = produceParcel();
      const errorMessage = `update or delete on table "parcel" violates foreign key constraint "FK_9720341fe17e4c22decf0a0b87f" on table "parcel"`;
      _parcelFindOne.mockResolvedValueOnce(newParentParcel);
      _parcelDelete.mockImplementationOnce(() => {
        throw new ErrorWithCode(errorMessage);
      });
      expect(
        async () => await parcelService.deleteParcelByPid(newParentParcel.PID),
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
      const updateParcel = produceParcel();
      await parcelService.updateParcel(updateParcel);
      expect(_parcelUpdate).toHaveBeenCalledTimes(1);
    });
    it('should throw an error if the parcel is not found.', async () => {
      const updateParcel = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(null);
      expect(async () => await parcelService.updateParcel(updateParcel)).rejects.toThrow();
    });
    it('should throw and error if parcel is unable to be updated', async () => {
      const updateParcel = produceParcel();
      _parcelFindOne.mockResolvedValueOnce(updateParcel);
      _parcelUpdate.mockImplementationOnce(() => {
        throw new ErrorWithCode('errorMessage');
      });
      expect(async () => await parcelService.updateParcel(updateParcel)).rejects.toThrow();
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
