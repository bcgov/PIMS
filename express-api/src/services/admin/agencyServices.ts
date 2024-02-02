import { AppDataSource } from "@/appDataSource";
import { Agencies } from "@/typeorm/Entities/Agencies";

const agencyRepo = AppDataSource.getRepository(Agencies);

/**
 * @description Gets and returns a list of all agencies.
 * @returns { Agencies[] } A list of agencies 
 * @throws ErrorWithCode if an error is hit.
 */
export const getAgencies = async () => { 
    const allAgencies = await agencyRepo.find();
    return allAgencies;
};

/**
 * @description Creates a new agency in the database.
 * @param Request information on agency to be created.
 * @returns Status and information on the added agency
 * @throws Error With Code if there is an error adding to the database.
 */
const postAgency = async () => {
    // create agency
    // connect to database and try to add the agency
    // if fail throw ErrorWithCode to be caught in controller
    // if pass send back good response. 
};

/**
 * @description Finds and returns an agency with a given id.
 * @param Request id. 
 * @returns Status and found agency.
 * @throws ErrorWithCode if the agency isn't found or if there is another error hit.
 */
const getAgencyById = async () => { 
    // logic here for getting a single agency that matches provided id 
};

/**
 * @description Finds and updates an agency with the given id.
 * @param The id provided in the request.
 * @returns Status and information on updated agency.
 * @throws ErrorWithCode if agency isnt found or another error is hit.
 */
const updateAgencyById = async () => { 
    // logic here for posting a single agency that matches provided id
};

/**
 * @description Finds and removes an agency with the given id. 
 * @param the id provided in the request. 
 * @returns Status with conformation on the removal. 
 * @throws ErrorWithCode if the agency isnt found or another error is hit.
 */
const deleteAgencyById = async () => { 
    // logic here for deleting a single agency that matches provided id
};

/**
 * @description Gets a list of agencies that meet the filters provided.
 * @param list of filters in the request. 
 * @returns Status with list of agencies. 
 * @throws ErrorWithCode if 
 */
const getAgenciesFiltered = async () => {
    //logic here to check params and return list of agencies matching parameters paginated
}

