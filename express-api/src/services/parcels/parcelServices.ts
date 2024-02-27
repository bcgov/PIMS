import { Parcel } from '@/typeorm/Entities/Parcel';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { ParcelFilter } from '@/services/parcels/parcelSchema';
import { FindOptionsOrder } from 'typeorm';

const parcelRepo = AppDataSource.getRepository(Parcel);

/**
 * @description          Adds a new parcel to the datasource.
 * @param   parcel       incoming parcel data to be added to the database
 * @returns {Parcel}   A 201 status and the data of the role added.
 * @throws ErrorWithCode If the parcel already exists or is unable to be added.
 */
export const addParcel = async (parcel: Partial<Parcel>) => {
  const existingParcel = await getParcelByPid(parcel.PID);
  if (existingParcel) {
    throw new ErrorWithCode('Parcel already exists.', 409);
  }
  try {
    const newParcel = parcelRepo.save(parcel);
    return newParcel;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * @description Remove a parcel from the database based on incoming PID
 * @param parcelId Incoming PID of parcel to be removed
 * @returns object with data on number of rows affected.
 * @throws ErrorWithCode if no parcels have the PID sent in
 */
export const deleteParcelByPid = async (parcelPid: number) => {
  const existingParcel = await getParcelByPid(parcelPid);
  if (!existingParcel) {
    throw new ErrorWithCode('Parcel PID was not found.', 404);
  }
  try {
    const removeParcel = await parcelRepo.delete(existingParcel.Id);
    return removeParcel;
  } catch (e) {
    throw new ErrorWithCode(e.message);
  }
};

/**
 * @description Retrieves parcels based on the provided filter.
 * @param filter - The filter object used to specify the criteria for retrieving parcels.
 * @returns {Parcel[]} An array of parcels that match the filter criteria.
 */
export const getParcels = async (filter: ParcelFilter, includeRelations: boolean = false) => {
  const parcels = await parcelRepo.find({
    relations: {
      ParentParcel: includeRelations,
      Agency: includeRelations,
      AdministrativeArea: includeRelations,
      Classification: includeRelations,
      PropertyType: includeRelations,
    },
    where: {
      PID: filter.pid,
      ClassificationId: filter.classificationId,
      AgencyId: filter.agencyId,
      AdministrativeAreaId: filter.administrativeAreaId,
      PropertyTypeId: filter.propertyTypeId,
      IsSensitive: filter.isSensitive,
    },
    take: filter.quantity,
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    order: filter.sort as FindOptionsOrder<Parcel>,
  });
  return parcels;
};

/**
 * @description Finds and updates parcel based on the incoming PID
 * @param incomingParcel incoming parcel information to be updated
 * @returns updated parcel information and status
 * @throws Error with code if parcel is not found or if an unexpected error is hit on update
 */
export const updateParcelByPid = async (incomingParcel: Parcel) => {
  const findParcel = await getParcelByPid(incomingParcel.PID);
  if (findParcel == null) {
    throw new ErrorWithCode('Parcel not found', 404);
  }
  try {
    const updateParcel = await parcelRepo.update({ Id: findParcel.Id }, incomingParcel);
    return updateParcel.raw[0];
  } catch (e) {
    throw new ErrorWithCode('Error updating parcel');
  }
};

/**
 * @description Finds and returns a parcel with matching PID
 * @param       parcelPID Number representing parcel we want to find.
 * @returns     findParcel Parcel data matching PID passed in.
 */
export const getParcelByPid = async (parcelPid: number) => {
  try {
    const findParcel = await parcelRepo.findOne({
      where: { PID: parcelPid },
    });
    return findParcel;
  } catch (e) {
    throw new ErrorWithCode(e.message, e.status);
  }
};
