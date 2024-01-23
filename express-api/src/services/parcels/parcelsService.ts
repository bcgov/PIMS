import { AppDataSource } from '@/appDataSource';
import { IUser } from '@/controllers/admin/users/IUser';
import { IParcel } from '@/controllers/parcels/IParcel';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { Parcels } from '@/typeorm/Entities/Parcels';
import { PropertyClassifications } from '@/typeorm/Entities/PropertyClassifications';
import { PropertyTypes } from '@/typeorm/Entities/PropertyTypes';
import { UserAgencies } from '@/typeorm/Entities/UserAgencies';
import { Users } from '@/typeorm/Entities/Users';
import { pidStringToNumber } from '@/utilities/pidConversion';
import { KeycloakUser, KeycloakIdirUser } from '@bcgov/citz-imb-kc-express';
import { Point } from 'typeorm';
import { ClassificationType } from 'typescript';

const parcelsRepository = AppDataSource.getRepository(Parcels);
const usersRepository = AppDataSource.getRepository(Users);
const userAgenciesRepository = AppDataSource.getRepository(UserAgencies);

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
  const point: Point = {
    type: 'Point',
    coordinates: [lat, lng],
  };

  const parcel = await parcelsRepository
    .createQueryBuilder()
    .where('ST_Equals(parcel.Location, ST_GeomFromGeoJSON(:point))', {
      point: JSON.stringify(point),
    })
    .getOneOrFail();
  return parcel;
};

const getParcelByPid = async (pid: string) => {
  const parcel = await parcelsRepository.findOneByOrFail({
    PID: pidStringToNumber(pid),
  });
  return parcel;
};

const addParcel = async (parcel: IParcel, user: KeycloakUser & KeycloakIdirUser) => {
  // Does user belong to this agency?
  const userEntity = await usersRepository
    .findOneByOrFail({
      Email: user.email,
    })
    .catch(() => {
      throw new Error(`User with email ${user.email} not found.`);
    });
  const usersAgencies = await userAgenciesRepository.find({
    where: {
      UserId: userEntity.Id,
    },
  });
  if (userEntity) {
  }
  const parcelEntity = await parcelsRepository.create();
  // Is this a part of another parcel?
  if (parcel.parentParcelPID) {
    parcelEntity.PropertyTypeId = await AppDataSource.getRepository(PropertyTypes).findOneBy({
      Name: 'Subdivision',
    });
    // Ensure that the parent parcel exists and assign it.
    parcelEntity.ParentParcel = await parcelsRepository
      .findOneByOrFail({
        PID: parcel.parentParcelPID,
      })
      .catch(() => {
        throw new Error(`Parent parcel ${parcel.parentParcelPID} not found`);
      });
  }

  // Add other fields. 
  parcelEntity.Name = parcel.name;
  parcelEntity.Description = parcel.description;
  parcelEntity.ClassificationId = await AppDataSource.getRepository(PropertyClassifications).findOneByOrFail({ Id: parcel.classificationId})
  parcelEntity.AgencyId = await AppDataSource.getRepository(Agencies).findOneByOrFail({ Id: parcel.agencyId})
  parcelEntity.IsSensitive = parcel.isSensitive;
  parcelEntity.IsVisibleToOtherAgencies = parcel.isVisibleToOtherAgencies;
  parcelEntity.Location = parcel.location;
  parcelEntity.ProjectNumbers = parcel.projectNumbers; // FIXME: what type should be here?
  parcelEntity.PID = pidStringToNumber(parcel.pid);
  parcelEntity.PIN = parcel.pin;
  parcelEntity.LandArea = parcel.landArea;
  parcelEntity.LandLegalDescription = parcel.landLegalDescription;
  parcelEntity.Zoning = parcel.zoning;
  parcelEntity.ZoningPotential = parcel.zoningPotential;
  parcelEntity.NotOwned = false; // TODO: Not clear where this comes from.

  return await parcelsRepository.insert(parcelEntity);
};

const updateParcel = async () => { };

const updateParcelFinancials = async () => { };

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
