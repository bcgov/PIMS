import { AppDataSource } from "@/appDataSource";
import { Parcel } from "@/typeorm/Entities/Parcel";
import { DeepPartial } from "typeorm";

const parcelRepo = AppDataSource.getRepository(Parcel);

const _parcelSave = jest
  .spyOn(parcelRepo, 'save')
  .mockImplementation(async (parcel: DeepPartial<Parcel> & Parcel) => parcel);

  describe('UNIT - Parcel Services', () => {
    describe('addParcel', () => {
        it('should add a new parcel and return it', async () => {
            
        })
    })
  })
