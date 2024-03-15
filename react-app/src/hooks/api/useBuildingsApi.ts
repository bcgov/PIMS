const buildings1 = [
  {
    Id: 1,
    ClassificationId: 0,
    Classification: {
      Name: 'Core operational',
      Id: 0,
    },
    Address1: '2345 Example St.',
    AgencyId: 1,
    Agency: { Name: 'Smith & Weston' },
    PID: 111333444,
    IsSensitive: true,
    UpdatedOn: new Date(),
    Evaluations: [{ Value: 99888, Date: new Date() }],
    Fiscals: [{ Value: 1235000, FiscalYear: 2024 }],
  },
  {
    Id: 2,
    ClassificationId: 5,
    Classification: {
      Name: 'Disposed',
      Id: 5,
    },
    Address1: '6432 Nullabel Ln.',
    AgencyId: 1,
    Agency: { Name: 'Smith & Weston' },
    PID: 676555444,
    IsSensitive: false,
    UpdatedOn: new Date(),
    Evaluations: [{ Value: 999988, Date: new Date() }],
    Fiscals: [{ Value: 1235000, FiscalYear: 2024, }],
  },
];

const useBuildingsApi = () => {
  const getBuildings = async () => {
    return buildings1;
  };

  const getBuildingById = async (id: number) => {
    return buildings1.find((b) => b.Id === id);
  };

  const getBuildingsByPid = async (pid: number) => {
    return buildings1.filter((b) => b.PID === pid);
  };

  return {
    getBuildings,
    getBuildingById,
    getBuildingsByPid,
  };
};

export default useBuildingsApi;
