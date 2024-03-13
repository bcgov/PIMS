import { Parcel } from '@/typeorm/Entities/Parcel';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { ParcelFilter } from '@/services/parcels/parcelSchema';
import { DeepPartial, FindOptionsOrder } from 'typeorm';

const parcelRepo = AppDataSource.getRepository(Parcel);

/**
 * @description          Adds a new parcel to the datasource.
 * @param   parcel       incoming parcel data to be added to the database
 * @returns {Parcel}   A 201 status and the data of the role added.
 * @throws ErrorWithCode If the parcel already exists or is unable to be added.
 */
const addParcel = async (parcel: Partial<Parcel>) => {
  const inPID = Number(parcel.PID);
  if (inPID == undefined || Number.isNaN(inPID)) {
    throw new ErrorWithCode('Must include PID in parcel data.', 400);
  }

  const matchPID = inPID.toString().search(/^\d{9}$/);
  if (matchPID === -1) {
    throw new ErrorWithCode('PID must be a number and in the format #########');
  }

  const existingParcel = await getParcelByPid(inPID);

  if (existingParcel) {
    throw new ErrorWithCode('Parcel already exists.', 409);
  }
  const newParcel = parcelRepo.save(parcel);
  return newParcel;
};

/**
 * @description Remove a parcel from the database based on incoming internal ID
 * @param parcelId Incoming ID of parcel to be removed
 * @returns object with data on number of rows affected.
 * @throws ErrorWithCode if no parcels have the ID sent in
 */
const deleteParcelById = async (parcelId: number) => {
  const existingParcel = await getParcelById(parcelId);
  if (!existingParcel) {
    throw new ErrorWithCode('Parcel PID was not found.', 404);
  }
  const removeParcel = await parcelRepo.delete(existingParcel.Id);
  return removeParcel;
};

/**
 * @description Retrieves parcels based on the provided filter.
 * @param filter - The filter object used to specify the criteria for retrieving parcels.
 * @returns {Parcel[]} An array of parcels that match the filter criteria.
 */
const getParcels = async (filter: ParcelFilter, includeRelations: boolean = false) => {
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
const updateParcel = async (incomingParcel: DeepPartial<Parcel>) => {
  if (incomingParcel.PID == undefined) {
    throw new ErrorWithCode('Must include PID in parcel data.', 400);
  }
  const findParcel = await getParcelById(incomingParcel.Id);
  if (findParcel == null || findParcel.Id !== incomingParcel.Id) {
    throw new ErrorWithCode('Parcel not found', 404);
  }
  await parcelRepo.update({ Id: findParcel.Id }, incomingParcel);
  // update function doesn't return data on the row changed. Have to get the changed row again
  const newParcel = await getParcelById(incomingParcel.Id);
  return newParcel;
};

/**
 * @description Finds and returns a parcel with matching PID
 * @param       parcelPID The PID of the parcel.
 * @returns     findParcel Parcel data matching PID passed in.
 */
const getParcelByPid = async (parcelPid: number) => {
  return parcelRepo.findOne({
    where: { PID: parcelPid },
  });
};

/**
 * @description Finds and returns a parcel with matching internal ID
 * @param       parcelId The primary generated ID of the parcel.
 * @returns     findParcel Parcel data matching ID passed in.
 */
const getParcelById = async (parcelId: number) => {
  return parcelRepo.findOne({ where: { Id: parcelId } });
};

const parcelServices = {
  getParcelById,
  getParcelByPid,
  getParcels,
  updateParcel,
  deleteParcelById,
  addParcel,
};

export default parcelServices;
