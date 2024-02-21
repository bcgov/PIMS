import { Parcel } from '@/typeorm/Entities/Parcel';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

const parcelRepo = AppDataSource.getRepository(Parcel);

/**
 * @description          Adds a new parcel to the datasource.
 * @param   parcel       incoming parcel data to be added to the database
 * @returns {Response}   A 201 status and the data of the role added.
 * @throws ErrorWithCode If the parcel already exists or is unable to be added.
 */
export const postParcel = async (parcel: Parcel) => {
  const existingParcel = await getParcelById(parcel.Id);
  if (existingParcel) {
    throw new ErrorWithCode('Parcel already exists', 409);
  }
  const newParcel = parcelRepo.save(parcel);
  return newParcel;
};

/**
 * @description Finds and returns a parcel with matching Id
 * @param       parcelId Number representing parcel we want to find.
 * @returns     findParcel Parcel data matching Id passed in.
 */
export const getParcelById = async (parcelId: number) => {
  try {
    const findParcel = await parcelRepo.findOne({
      where: { Id: parcelId },
    });
    return findParcel;
  } catch (e) {
    throw new ErrorWithCode(e.message, e.status);
  }
};
