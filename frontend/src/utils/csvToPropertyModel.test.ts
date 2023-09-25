import {
  csvFileToPropertyModel,
  csvFileToString,
  dataToCsvFile,
  parseCSVString,
} from './csvToPropertyModel';

const csvString =
  'parcelId,pid,pin,status,fiscalYear,agency,agencyCode,subAgency,propertyType,localId,name,description,classification,civicAddress,city,postal,latitude,longitude,landArea,landLegalDescription,buildingFloorCount,buildingConstructionType,buildingPredominateUse,buildingTenancy,buildingRentableArea,assessed,netBook\n\
000-118-397,000-118-397,123456789,Active,2023,1,AEST,,Land,PIMS Test,The Property,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.15886178,-128.1077099,25,blahblah,0,string,string,string,0,1234560,1230\n\
120-118-397,120-118-397,225566,Active,2023,1,MAH,BCH,Land,PIMS Test,The Property 2,PIMS Testing,Core Operational,123 Test St,Abbotsford,ABC123,52.25886178,-128.1077099,25.6,testesttest test,0,string,string,string,0,1234560,1230\n\
020-118-397,020-118-397,35223333,Active,2023,1,AEST,,Land,PIMS Test,The Property 3,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.15886178,-129.1077099,20,fresh fresh fruit,0,string,string,string,0,1234560,1230\n\
000-318-397,000-318-397,7848754,Active,2023,1,AEST,,Land,PIMS Test,The Property 4,PIMS Testing,Core Operational,123 Test St,Vancouver,ABC123,52.14886178,-127.1077099,100.5,just a string,0,string,string,string,0,1234560,1230\n\
000-118-392,000-118-392,4444444,Active,2023,1,MAH,BCH,Land,PIMS Test,The Property 5,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.15786178,-128.1088885,10,"just a string, just a string",0,string,string,string,0,1234560,1230\n\
000-122-397,000-122-397,11211131,Active,2023,1,AEST,,Land,PIMS Test,The Property 6,PIMS Testing,Core Operational,123 Test St,Campbell River,ABC123,52.15986178,-128.2077099,55,"one two, three",0,string,string,string,0,1234560,1230\n\
011-118-397,011-118-397,,Active,2023,1,AEST,,Land,PIMS Test,The Property 7,PIMS Testing,Core Operational,123 Test St,Nanaimo,ABC123,52.15686178,-128.1010099,1,under the water brdiget,0,string,string,string,0,1234560,1230\n\
660-118-397,660-118-397,,Active,2023,1,AEST,,Land,PIMS Test,The Property 8,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.16886178,-128.1087099,12,fresh fresh fruit,0,string,string,string,0,1234560,1230\n\
410-118-397,410-118-397,,Active,2023,1,AEST,,Land,PIMS Test,The Property 9,PIMS Testing,Core Operational,123 Test St,Alert Bay,ABC123,52.15887178,-128.1078099,0.985,fresh fresh fruit,0,string,string,string,0,1234560,1230\n';

describe('Testing CSV to JSON Utilities', () => {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const file = new File([blob], 'test.csv', { type: 'text/csv' });

  // Happy Path Tests
  it('CSV string is parsed correctly', async () => {
    const parsedCSV = await parseCSVString(csvString);
    expect(parsedCSV).toBeDefined();
    const { parcelId, pid, description, civicAddress } = parsedCSV.at(0)!;
    expect(parcelId).toBe('000-118-397');
    expect(pid).toBe('000-118-397');
    expect(description).toBe('PIMS Testing');
    expect(civicAddress).toBe('123 Test St');
  });

  it('CSV file is parsed and returned as string of content', async () => {
    const result = await csvFileToString(file);
    expect(result).toBeDefined();
    expect(result).toBe(csvString);
  });

  it('CSV file is parsed and returned as array of objects', async () => {
    const result = await csvFileToPropertyModel(file);
    expect(result).toBeDefined();
    const { parcelId, pid, description, civicAddress } = result.at(0)!;
    expect(parcelId).toBe('000-118-397');
    expect(pid).toBe('000-118-397');
    expect(description).toBe('PIMS Testing');
    expect(civicAddress).toBe('123 Test St');
  });

  // Unhappy Path Tests
  it('CSV string cannot be parsed if not delimited', async () => {
    expect(parseCSVString('hello')).rejects.toEqual('CSV file is incomplete.');
  });

  it('Parse fails if no rows supplied in CSV', async () => {
    const csvString =
      'parcelId,pid,pin,status,fiscalYear,agency,agencyCode,subAgency,propertyType,localId,name,description,classification,civicAddress,city,postal,latitude,longitude,landArea,landLegalDescription,buildingFloorCount,buildingConstructionType,buildingPredominateUse,buildingTenancy,buildingRentableArea,assessed,netBook\n';
    await expect(parseCSVString(csvString)).rejects.toMatch(/incomplete/);
  });

  // Testing JSON to CSV
  it('JSON objects converted to CSV file string successfully', () => {
    const objs = [
      {
        name: 'Ted',
        age: 40,
      },
      {
        name: 'Mille',
        age: 1000,
      },
    ];
    const fileString = dataToCsvFile(objs);
    expect(fileString).toBeDefined();
    expect(typeof fileString).toBe('string');
    expect(fileString.includes('Ted')).toBeTruthy();
    expect(fileString.includes('1000')).toBeTruthy();
  });
});
