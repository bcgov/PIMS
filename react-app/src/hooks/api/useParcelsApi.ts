const parcels = [
  {
    Id: 1,
    PID: '010-113-1332',
    ClassificationId: 0,
    Classification: {
      Name: 'Core operational',
      Id: 0,
    },
    AgencyId: 1,
    Agency: { Name: 'Smith & Weston' },
    Address1: '1450 Whenever Pl',
    ProjectNumbers: 'FX1234',
    Corporation: 'asdasda',
    Ownership: 50,
    IsSensitive: true,
    UpdatedOn: new Date(),
  },
  {
    Id: 2,
    PID: '330-11-4335',
    ClassificationId: 1,
    Classification: {
      Name: 'Core strategic',
      Id: 1,
    },
    AgencyId: 2,
    Agency: { Name: 'Burger King' },
    Address1: '1143 Bigapple Rd',
    ProjectNumbers: 'FX121a4',
    Corporation: 'Big Corp',
    Ownership: 99,
    IsSensitive: false,
    UpdatedOn: new Date(),
  },
];

const useParcelsApi = () => {
  const getParcels = async () => {
    return parcels;
  };
  const getParcelById = async (id: number) => {
    return parcels.find((p) => p.Id === id);
  };
  return {
    getParcels,
    getParcelById,
  };
};

export default useParcelsApi;
