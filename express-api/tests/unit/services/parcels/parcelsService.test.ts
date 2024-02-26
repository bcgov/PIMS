import { AppDataSource } from '@/appDataSource';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { produceParcel } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';
import * as parcelService from '@/services/parcels/parcelServices';

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
  });
});
