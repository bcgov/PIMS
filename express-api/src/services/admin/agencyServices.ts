import { AppDataSource } from "@/appDataSource";
import { Agencies } from "@/typeorm/Entities/Agencies";

const agencyRepo = AppDataSource.getRepository(Agencies);

export const getAgencies = async () => { 
    const allAgencies = await agencyRepo.find();
    return allAgencies;
};

const postAgency = async () => {
    // provide logic here for posting agency
};

const getAgencyById = async () => { 
    // logic here for getting a single agency that matches provided id 
};

const updateAgencyById = async () => { 
    // logic here for posting a single agency that matches provided id
};

const deleteAgencyById = async () => { 
    // logic here for deleting a single agency that matches provided id
};

const getAgenciesFiltered = async () => {
    //logic here to check params and return list of agencies matching parameters paginated
}

