import { AppDataSource } from '@/appDataSource';
import { IParcel } from '@/controllers/parcels/IParcel';
import { AdministrativeAreas } from '@/typeorm/Entities/AdministrativeAreas';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { Parcels } from '@/typeorm/Entities/Parcels';
import { PropertyClassifications } from '@/typeorm/Entities/PropertyClassifications';
import { PropertyTypes } from '@/typeorm/Entities/PropertyTypes';
import { UserAgencies } from '@/typeorm/Entities/UserAgencies';
import { Users } from '@/typeorm/Entities/Users';
import { pidNumberToString, pidStringToNumber } from '@/utilities/pidConversion';
import { KeycloakUser, KeycloakIdirUser } from '@bcgov/citz-imb-kc-express';
import { Point, QueryFailedError } from 'typeorm';
import { hasRole } from '@bcgov/citz-imb-kc-express';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

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
 * @throws {ErrorWithCode}
 */
const getParcelById = async (id: number) => {
  const parcel = await parcelsRepository
    .findOneByOrFail({
      Id: id,
    })
    .catch(() => {
      throw new ErrorWithCode(`Parcel with ID ${id} not found.`, 404);
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
    .getOneOrFail()
    .catch(() => {
      throw new ErrorWithCode(`Parcel with that location not found.`, 404);
    });
  return parcel;
};

const getParcelByPid = async (pid: string) => {
  const parcel = await parcelsRepository
    .findOneByOrFail({
      PID: pidStringToNumber(pid),
    })
    .catch(() => {
      throw new ErrorWithCode(`Parcel with PID ${pid} not found.`, 404);
    });
  return parcel;
};

const addParcel = async (parcel: IParcel, user: KeycloakUser & KeycloakIdirUser) => {
  // If user is not an admin, do they belong to this agency?
  if (!hasRole(user, ['admin'])) {
    const userEntity = await usersRepository
      .findOneByOrFail({
        Email: user.email,
      })
      .catch(() => {
        throw new ErrorWithCode(`User with email ${user.email} not found.`, 404);
      });
    const usersAgencies = await userAgenciesRepository.find({
      where: {
        UserId: userEntity.Id,
      },
    });
    if (userEntity) {
    }
  }

  // Make sure that the PID doesn't already exist.
  const existingParcel = await parcelsRepository.findOneBy({ PID: pidStringToNumber(parcel.pid) });
  if (existingParcel != null)
    throw new ErrorWithCode(`A parcel with PID ${parcel.pid} already exists.`);
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
        throw new ErrorWithCode(`Parent parcel ${parcel.parentParcelPID} not found`, 404);
      });
  }

  // Add other fields.
  parcelEntity.Name = parcel.name;
  parcelEntity.Description = parcel.description;
  parcelEntity.ClassificationId = await AppDataSource.getRepository(
    PropertyClassifications,
  ).findOneByOrFail({ Id: parcel.classificationId });
  parcelEntity.AgencyId = await AppDataSource.getRepository(Agencies).findOneByOrFail({
    Id: parcel.agencyId,
  });
  parcelEntity.AdministrativeAreaId = await AppDataSource.getRepository(
    AdministrativeAreas,
  ).findOneByOrFail({ Id: parcel.administrativeArea });
  parcelEntity.IsSensitive = parcel.isSensitive;
  parcelEntity.IsVisibleToOtherAgencies = false;
  parcelEntity.Location = parcel.location;
  parcelEntity.Address1 = parcel.address1;
  parcelEntity.Address2 = parcel.address2;
  parcelEntity.Postal = parcel.postal;
  parcelEntity.SiteId = parcel.siteId;
  parcelEntity.PID = pidStringToNumber(parcel.pid);
  parcelEntity.PIN = parcel.pin;
  parcelEntity.LandArea = parcel.landArea;
  parcelEntity.LandLegalDescription = parcel.landLegalDescription;
  parcelEntity.Zoning = parcel.zoning;
  parcelEntity.ZoningPotential = parcel.zoningPotential;
  parcelEntity.NotOwned = false; // TODO: Not clear where this comes from.

  const result = await parcelsRepository.insert(parcelEntity);

  // If insert successful, add relations to buildings and subdivisions
  parcel.buildings.forEach((building) => {
    // TODO: Call update building when building service is ready
  });
  parcel.subdivisionPids.forEach(async (pid) => {
    const subdivision = await getParcelByPid(pid);
    subdivision.ParentParcel = await getParcelByPid(pidNumberToString(parcel.parentParcelPID));
    updateParcel(subdivision);
  });
  return result;
};

const updateParcel = async (parcel: Parcels) => {
  await parcelsRepository.update({ Id: parcel.Id }, parcel);
};

const updateParcelFinancials = async () => {};

const deleteParcel = async (id: number) => {
  // TODO: Does user have permission? And agency?
  await parcelsRepository
    .delete({
      Id: id,
    })
    .catch((e: unknown) => {
      throw new ErrorWithCode(`Deletion failed: ${(e as QueryFailedError).message}`, 400);
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
