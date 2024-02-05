import { AppDataSource } from '@/appDataSource';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

const agencyRepo = AppDataSource.getRepository(Agencies);

/**
 * @description Gets and returns a list of all agencies.
 * @returns { Agencies[] } A list of all agencies in the database
 */
export const getAgencies = async () => {
  const allAgencies = await agencyRepo.find();
  return allAgencies;
};

/**
 * @description Creates a new agency in the database.
 * @param Request information on agency to be created.
 * @returns Status and information on the added agency
 */
export const postAgency = async (agency: Agencies) => {
  try {
    const existingAgency = await getAgencyById(agency.Id);
    if (existingAgency) {
      throw new ErrorWithCode('Agency already exists', 409);
    }
    const newAgency = AppDataSource.getRepository(Agencies).save(agency);
    return newAgency;
  } catch (e) {
    throw new ErrorWithCode(e?.body ?? 'Bad request', e?.status ?? 400);
  }
};

/**
 * @description Finds and returns an agency with a given id.
 * @param Request id.
 * @returns found agency.
 */
export const getAgencyById = async (agencyId: string) => {
  const findAgency = agencyRepo.findOne({
    where: { Id: agencyId },
  });
  return findAgency;
};

/**
 * @description Finds and updates an agency with the given id.
 * @param The id provided in the request.
 * @returns Status and information on updated agency.
 * @throws ErrorWithCode if agency isnt found or another error is hit.
 */
export const updateAgencyById = async (agencyIn: Agencies) => {
  const findAgency = await getAgencyById(agencyIn.Id);
  try {
    const update = await agencyRepo.update(findAgency, agencyIn);
    return update;
  } catch (e) {
    throw new ErrorWithCode(e?.body ?? 'Unable to update element.', e?.status ?? 400);
  }
};

/**
 * @description Finds and removes an agency with the given id.
 * @param the id provided in the request.
 * @returns Status with conformation on the removal.
 * @throws ErrorWithCode if the agency isnt found or another error is hit.
 */
export const deleteAgencyById = async (agencyId: string) => {
  const findAgency = await getAgencyById(agencyId);
  try {
    const deleted = await agencyRepo.delete(findAgency.Id);
    return deleted;
  } catch (e) {
    throw new ErrorWithCode(e?.body ?? 'Unable to update element.', e?.status ?? 400);
  }
};

/**
 * @description Gets a list of agencies that meet the filters provided.
 * @param list of filters in the request.
 * @returns Status with list of agencies.
 * @throws ErrorWithCode if
 */
const getAgenciesFiltered = async () => {
  //logic here to check params and return list of agencies matching parameters paginated
  return getAgencies();
};
