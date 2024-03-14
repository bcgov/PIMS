const buildings1 = [
  {
    Id: 1,
    ClassificationId: 0,
    Classification: {
      Name: 'Core operational',
      Id: 0,
    },
    AgencyId: 1,
    Agency: { Name: 'Smith & Weston' },
    PID: '010-113-1344',
    IsSensitive: true,
    UpdatedOn: new Date(),
  },
  {
    Id: 2,
    ClassificationId: 5,
    Classification: {
      Name: 'Disposed',
      Id: 5,
    },
    AgencyId: 1,
    Agency: { Name: 'Smith & Weston' },
    PID: null,
    IsSensitive: false,
    UpdatedOn: new Date(),
  },
];

const useBuildingsApi = () => {
  const getBuildings = async () => {
    return buildings1;
  };

  const getBuildingById = async (id: number) => {
    return buildings1.find((b) => b.Id === id);
  };

  return {
    getBuildings,
    getBuildingById,
  };
};

export default useBuildingsApi;
