import { AppDataSource } from '@/appDataSource';
import { Parcels } from '@/typeorm/Entities/Parcels';

const parcelsRepository = AppDataSource.getRepository(Parcels)

const getParcels = async (filter?: unknown) => {
  if (filter) {
    return await parcelsRepository.findBy(filter);
  } else {
    return await parcelsRepository.find();
  }
};

/**
 *
 * @param id
 * @returns
 * @throws {QueryFailedError}
 */
const getParcelById = async (id: number) => {
  const parcel = await parcelsRepository.findOneByOrFail({
    Id: id,
  });
  return parcel;
};

const getParcelByLocation = async (lat: number, lng: number) => {
  // const point: Point = {
  //   type: "Point",
  //   coordinates: [lat, lng],
  // }
  // const parcel = await AppDataSource.manager.findOneByOrFail(Parcels, {
  //   Location: point,
  // });
  // return parcel;
};

const getParcelByPid = async (pid: number) => {
  const parcel = await parcelsRepository.findOneByOrFail({
    PID: pid,
  });
  return parcel;
};

const addParcel = async () => {};

const updateParcel = async () => {};

const updateParcelFinancials = async () => {};

const deleteParcel = async (id: number) => {
  await parcelsRepository.delete({
    Id: id,
  });
};

const isPidAvailable = async (pid: number) => {
  const parcel = await parcelsRepository.findAndCountBy({
    PID: pid,
  });
  // Second element of array is the count of elements.
  if (parcel[1] > 0) return false;
  return true;
};

const isPinAvailable = async (pin: number) => {
  const parcel = await parcelsRepository.findAndCountBy({
    PIN: pin,
  });
  // Second element of array is the count of elements.
  if (parcel[1] > 0) return false;
  return true;
};

const parcelsService = {
  getParcels,
  getParcelById,
  getParcelByLocation,
  getParcelByPid,
  addParcel,
  updateParcel,
  updateParcelFinancials,
  deleteParcel,
  isPidAvailable,
  isPinAvailable,
};

export default parcelsService;
