import {
  csvFileToPropertyModel,
  csvFileToString,
  dataToCsvFile,
  parseCSVString,
} from './csvToPropertyModel';

const csvString =
  'Type,Classification,Name,Ministry,Location,Latitude,Longitude,PID\n\
Land,Core Operational,Property Name 1,AEST,North Saanich,52.15886178,-128.1077099,000-001-000\n\
Land,Core Operational,Property Name 2,AEST,Kitimat,52.15886178,-128.1077099,000-001-001\n\
Land,Core Strategic,Property Name 3,AEST,Metchosin,52.15886178,-128.1077099,000-001-002\n\
Building,Core Operational,Property Name 4,AEST,Metchosin,52.15886178,-128.1077099,000-001-003\n\
Building,Core Operational,Property Name 5,AEST,Metchosin,52.15886178,-128.1077099,000-001-004\n\
Land,Core Operational,Property Name 6,CITZ,Victoria,52.15886178,-128.1077099,000-001-005\n\
Land,Core Operational,Property Name 7,CITZ,Victoria,52.15886178,-128.1077099,000-001-006\n\
Land,Core Operational,Property Name 8,AEST,Campbell River,52.15886178,-128.1077099,000-001-007\n\
Land,Core Strategic,Property Name 9,MOTI,Victoria,52.15886178,-128.1077099,000-001-008\n\
Building,Core Operational,Property Name 10,AEST,Victoria,52.15886178,-128.1077099,000-001-009\n';

describe('Testing CSV to JSON Utilities', () => {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const file = new File([blob], 'test.csv', { type: 'text/csv' });

  // Happy Path Tests
  it('CSV string is parsed correctly', async () => {
    const parsedCSV = await parseCSVString(csvString);
    expect(parsedCSV).toBeDefined();
    const property = parsedCSV.at(0)!;
    // Test explicit values
    expect(property.parcelId).toBe('000-001-000');
    expect(property.pid).toBe('000-001-000');
    expect(property.city).toBe('North Saanich');
    expect(property.agencyCode).toBe('AEST');
    expect(property.classification).toBe('Core Operational');
    expect(property.propertyType).toBe('Land');
    // See if some defaults were set
    expect(property.buildingPredominateUse).toBe('Unknown');
    expect(property.fiscalYear).toBe(`${new Date().getFullYear()}`);
    expect(property.netBook).toBe('0');
  });

  it('CSV file is parsed and returned as string of content', async () => {
    const result = await csvFileToString(file);
    expect(result).toBeDefined();
    expect(result).toBe(csvString);
  });

  it('CSV file is parsed and returned as array of objects', async () => {
    const result = await csvFileToPropertyModel(file);
    expect(result).toBeDefined();
    const property = result.at(0)!;
    // Test explicit values
    expect(property.parcelId).toBe('000-001-000');
    expect(property.pid).toBe('000-001-000');
    expect(property.city).toBe('North Saanich');
    expect(property.agencyCode).toBe('AEST');
    expect(property.classification).toBe('Core Operational');
    expect(property.propertyType).toBe('Land');
    // See if some defaults were set
    expect(property.buildingPredominateUse).toBe('Unknown');
    expect(property.fiscalYear).toBe(`${new Date().getFullYear()}`);
    expect(property.netBook).toBe('0');
  });

  // Unhappy Path Tests
  it('CSV string cannot be parsed if not delimited', async () => {
    expect(parseCSVString('hello')).rejects.toEqual('CSV file is incomplete.');
  });

  it('Parse fails if no rows supplied in CSV', async () => {
    const csvString = 'Type,Classification,Name,Ministry,Location,Latitude,Longitude,PID\n';
    await expect(parseCSVString(csvString)).rejects.toMatch(/incomplete/);
  });

  // Testing JSON to CSV
  it('JSON objects converted to CSV file string successfully', () => {
    // Converts blob to string, but only with browser. Mocked here.
    global.URL.createObjectURL = jest.fn(() => 'text');
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
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  });
});
