import { AppDataSource } from '@/appDataSource';
import { AdministrativeAreas } from '@/typeorm/Entities/AdministrativeAreas';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { Parcels } from '@/typeorm/Entities/Parcels';
import { PropertyClassifications } from '@/typeorm/Entities/PropertyClassifications';
import { PropertyTypes } from '@/typeorm/Entities/PropertyTypes';
import { pidStringToNumber } from '@/utilities/pidConversion';
import { KeycloakUser, KeycloakIdirUser } from '@bcgov/citz-imb-kc-express';
import { Point, QueryFailedError } from 'typeorm';
import { hasRole } from '@bcgov/citz-imb-kc-express';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { Buildings } from '@/typeorm/Entities/Buildings';
import { Roles } from '@/constants/roles';

const parcelsRepository = AppDataSource.getRepository(Parcels);

const getParcels = async (filter?: unknown) => {
  // TODO: Does user have matching agency?
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
  // TODO: Does user have matching agency?

  // TODO: Validate parcel id
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
  // TODO: Does user have matching agency?
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
      throw new ErrorWithCode(`Parcel with location [${lat},${lng}] not found.`, 404);
    });
  return parcel;
};

const getParcelByPid = async (pid: number) => {
  // TODO: Does user have matching agency?

  // TODO: Validate pid
  const parcel = await parcelsRepository
    .findOneByOrFail({
      PID: pid,
    })
    .catch(() => {
      throw new ErrorWithCode(`Parcel with PID ${pid} not found.`, 404);
    });
  return parcel;
};

const addParcel = async (
  parcel: Parcels,
  user: KeycloakUser & KeycloakIdirUser,
  subdivisionPids?: string[],
) => {
  // TODO: refactor this out so it can be used everywhere.
  // If user is not an admin, do they belong to this agency?
  // And do they have the sensitive-view claim?
  if (!hasRole(user, [Roles.ADMIN])) {
    // TODO: Check agencies against user after usersService is up.
  }

  // Validate incoming parcel

  // Make sure that the PID doesn't already exist.
  const existingParcel = await parcelsRepository.findOneBy({ PID: parcel.PID });
  if (existingParcel != null)
    throw new ErrorWithCode(`A parcel with PID ${parcel.PID} already exists.`);

  // Is this a part of another parcel or just land?
  if (parcel.ParentParcel) {
    parcel.PropertyType = await AppDataSource.getRepository(PropertyTypes).findOneBy({
      Name: 'Subdivision',
    });
    // Ensure that the parent parcel exists and assign it.
    parcel.ParentParcel = await parcelsRepository
      .findOneByOrFail({
        PID: parcel.ParentParcel.PID,
      })
      .catch(() => {
        throw new ErrorWithCode(`Parent parcel ${parcel.ParentParcel.PID} not found`, 404);
      });
  } else {
    parcel.PropertyType = await AppDataSource.getRepository(PropertyTypes).findOneBy({
      Name: 'Land',
    });
  }

  // Does this Classification ID exist?
  await AppDataSource.getRepository(PropertyClassifications)
    .findOneByOrFail({
      Id: parcel.Classification.Id,
    })
    .catch(() => {
      throw new ErrorWithCode(`Classification ID ${parcel.Classification.Id} not found.`, 404);
    });

  // Does this Agency exist?
  await AppDataSource.getRepository(Agencies)
    .findOneByOrFail({
      Id: parcel.Agency.Id,
    })
    .catch(() => {
      throw new ErrorWithCode(`Agency ID ${parcel.Agency.Id} not found`, 404);
    });

  // Does this Administrative Area exist?
  await AppDataSource.getRepository(AdministrativeAreas)
    .findOneByOrFail({
      Id: parcel.AdministrativeArea.Id,
    })
    .catch(() => {
      throw new ErrorWithCode(
        `Administrative Area ID ${parcel.AdministrativeArea.Id} not found`,
        404,
      );
    });

  const result = await parcelsRepository.insert(parcel);

  // If insert successful, add relations to buildings and subdivisions
  parcel.Buildings.forEach((building: Buildings) => {
    // TODO: Call update building when building service is ready
  });
  subdivisionPids.forEach(async (pid) => {
    await parcelsRepository.update({ PID: pidStringToNumber(pid) }, { ParentParcel: parcel });
  });
  return result;
};

const updateParcel = async (
  parcel: Parcels,
  user: KeycloakUser & KeycloakIdirUser,
  newSubdivisionPids?: string[],
) => {
  // TODO: Does user have matching agency?
  // Get original parcel
  const original = await parcelsRepository.findOneByOrFail({ Id: parcel.Id }).catch(() => {
    throw new ErrorWithCode(`Parcel ID ${parcel.Id} not found`, 404);
  });
  // TODO: Is this property in a project already? If so, reject update.

  const classificationTypes = await AppDataSource.getRepository(PropertyClassifications).find();
  // Unless admin...
  if (!hasRole(user, [Roles.ADMIN])) {
    // no switching of agencies
    if (original.Agency != parcel.Agency) {
      throw new ErrorWithCode(`Parcel cannot be transferred to the specified agency.`, 403);
    }
    // No disposing of property
    if (
      parcel.Classification.Id ===
      classificationTypes.find((classification) => classification.Name === 'Disposed').Id
    ) {
      throw new ErrorWithCode(`Parcel classification cannot be changed to Disposed.`, 403);
    }

    // No changing classification to subdivided
    if (
      parcel.Classification.Id ===
      classificationTypes.find((classification) => classification.Name === 'Subdivided').Id
    ) {
      throw new ErrorWithCode(`Parcel classification cannot be changed to Subdivided.`, 403);
    }
  }

  // No making properties visible through update
  if (original.IsVisibleToOtherAgencies != parcel.IsVisibleToOtherAgencies) {
    throw new ErrorWithCode(
      `Cannot make a parcel visible to other agencies through this service.`,
      403,
    );
  }
  // No changing parcels to demolished classification
  if (
    parcel.Classification.Id ===
    classificationTypes.find((classification) => classification.Name === 'Demolished').Id
  ) {
    throw new ErrorWithCode(`Parcel classification cannot be changed to Demolished.`, 403);
  }

  // TODO: Do we need to check buildings, or will they be included in this update?

  // Update parcel
  const updatedParcel = await parcelsRepository.update({ Id: parcel.Id }, parcel);

  // If there are any attached subdivisions, update them with the new PID
  newSubdivisionPids.forEach(async (pid) => {
    await parcelsRepository.update({ PID: pidStringToNumber(pid) }, { ParentParcel: parcel });
  });
 
  // TODO: Add/Update Fiscals and Evaluations
  
  // TODO: Remove outdated fiscals and evaluations

  // TODO: Do we need to verify buildings? Do we remove them if not in incoming parcel?
  
  return updatedParcel;
};

const updateParcelFinancials = async () => {
  // TODO: Does user have matching agency?
};

const deleteParcel = async (id: number) => {
  // TODO: Does user have permission? And agency?
  // TODO: Is this property in a project already? If so, reject deletion.

  // TODO: Do we delete related buildings too?

  return await parcelsRepository
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
