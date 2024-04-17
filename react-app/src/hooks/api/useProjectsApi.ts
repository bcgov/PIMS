import { IFetch } from '../useFetch';

const projects = [
  {
    Id: 1,
    ProjectNumber: 'SFP-1000',
    Name: 'Project Example 1',
    ReportedFiscalYear: 2024,
    ActualFiscalYear: 2024,
    Description: 'Lorem ipsum',
    NetBook: 120000,
    Market: 150000,
    Assessed: 199000,
    Appraised: 234000,
    Agency: {
      Name: 'Test Agency',
    },
    Status: {
      Name: 'In ERP',
    },
    UpdatedOn: new Date(),
  },
  {
    Id: 2,
    ProjectNumber: 'SFP-1111',
    Name: 'Project Example 2',
    ReportedFiscalYear: 2012,
    ActualFiscalYear: 2013,
    Description: 'Lorem ipsum',
    NetBook: 3341414,
    Market: 124213123,
    Assessed: 12414441,
    Appraised: 1241244,
    Agency: {
      Name: 'Test Agency 2',
    },
    Status: {
      Name: 'Approved for Exemption',
    },
    UpdatedOn: new Date(),
    UpdatedBy: {
      FirstName: 'Joe',
      LastName: 'Shmoe',
    },
  },
];

// TODO: remove eslint diable once absolute fetch is used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useProjectsApi = (absoluteFetch: IFetch) => {
  const getProjects = async () => {
    return projects;
  };

  return {
    getProjects,
  };
};

export default useProjectsApi;
