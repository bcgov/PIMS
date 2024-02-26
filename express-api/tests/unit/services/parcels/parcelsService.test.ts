import { AppDataSource } from '@/appDataSource';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { produceParcel } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';
import * as parcelService from '@/services/parcels/parcelServices';
import { ParcelFilterSchema } from '@/services/parcels/parcelSchema';

//jest.setTimeout(30000);

const parcelRepo = AppDataSource.getRepository(Parcel);

const _parcelSave = jest
  .spyOn(parcelRepo, 'save')
  .mockImplementation(async (parcel: DeepPartial<Parcel> & Parcel) => parcel);

const _parcelFindOne = jest
  .spyOn(parcelRepo, 'findOne')
  .mockImplementation(async () => produceParcel());

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

  describe('UNIT - getParcels', () => {
    it('should return a list of parcels', async () => {
      const parcels = await parcelService.getParcels({});
      expect(parcels).toHaveLength(2);
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
});
