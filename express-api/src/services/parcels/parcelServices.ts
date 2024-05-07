import { Parcel } from '@/typeorm/Entities/Parcel';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { ParcelFilter } from '@/services/parcels/parcelSchema';
import { DeepPartial, FindOptionsOrder, In } from 'typeorm';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';

const parcelRepo = AppDataSource.getRepository(Parcel);

/**
 * @description          Adds a new parcel to the datasource.
 * @param   parcel       Incoming parcel data to be added to the database
 * @returns {Parcel}     The new Parcel added.
 * @throws ErrorWithCode If the parcel already exists or is unable to be added.
 */
const addParcel = async (parcel: DeepPartial<Parcel>) => {
  const numberPID = Number(parcel.PID);

  const stringPID = numberPID.toString();
  if (parcel.PID != null && (stringPID.length > 9 || isNaN(numberPID))) {
    throw new ErrorWithCode('PID must be a number and in the format #########');
  }

  const existingParcel = parcel.PID != null ? await getParcelByPid(numberPID) : undefined;

  if (existingParcel) {
    throw new ErrorWithCode('Parcel already exists.', 409);
  }
  const newParcel = await parcelRepo.save(parcel);
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
      AgencyId: filter.agencyId
        ? In(typeof filter.agencyId === 'number' ? [filter.agencyId] : filter.agencyId)
        : undefined,
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
  if (incomingParcel.PID == null && incomingParcel.PIN == null) {
    throw new ErrorWithCode('Must include PID or PIN in parcel data.', 400);
  }
  const findParcel = await getParcelById(incomingParcel.Id);
  if (findParcel == null || findParcel.Id !== incomingParcel.Id) {
    throw new ErrorWithCode('Parcel not found', 404);
  }
  if (incomingParcel.Fiscals && incomingParcel.Fiscals.length) {
    incomingParcel.Fiscals = await Promise.all(
      incomingParcel.Fiscals.map(async (fiscal) => {
        const exists = await AppDataSource.getRepository(ParcelFiscal).exists({
          where: {
            ParcelId: incomingParcel.Id,
            FiscalYear: fiscal.FiscalYear,
            FiscalKeyId: fiscal.FiscalKeyId,
          },
        });
        const fiscalEntity: DeepPartial<ParcelFiscal> = {
          ...fiscal,
          CreatedById: exists ? undefined : incomingParcel.UpdatedById,
          UpdatedById: exists ? incomingParcel.UpdatedById : undefined,
        };
        return fiscalEntity;
      }),
    );
  }
  if (incomingParcel.Evaluations && incomingParcel.Evaluations.length) {
    incomingParcel.Evaluations = await Promise.all(
      incomingParcel.Evaluations.map(async (evaluation) => {
        const exists = await AppDataSource.getRepository(ParcelEvaluation).exists({
          where: {
            ParcelId: incomingParcel.Id,
            Year: evaluation.Year,
            EvaluationKeyId: evaluation.EvaluationKeyId,
          },
        });
        const fiscalEntity: DeepPartial<ParcelFiscal> = {
          ...evaluation,
          CreatedById: exists ? undefined : incomingParcel.UpdatedById,
          UpdatedById: exists ? incomingParcel.UpdatedById : undefined,
        };
        return fiscalEntity;
      }),
    );
  }

  return parcelRepo.save(incomingParcel);
};

/**
 * @description Finds and returns a parcel with matching PID
 * @param       parcelPID The PID of the parcel.
 * @returns     findParcel Parcel data matching PID passed in.
 */
const getParcelByPid = async (parcelPid: number) => {
  return await parcelRepo.findOne({
    where: { PID: parcelPid },
  });
};

/**
 * @description Finds and returns a parcel with matching internal ID
 * @param       parcelId The primary generated ID of the parcel.
 * @returns     findParcel Parcel data matching ID passed in.
 */
const getParcelById = async (parcelId: number) => {
  return parcelRepo.findOne({
    relations: {
      ParentParcel: true,
      Agency: true,
      AdministrativeArea: true,
      Classification: true,
      PropertyType: true,
      Evaluations: true,
      Fiscals: true,
    },
    where: { Id: parcelId },
  });
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
