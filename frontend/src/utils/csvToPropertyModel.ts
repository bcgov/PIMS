import Papa from 'papaparse';

// This is the ideal model that the API expects to receive.
export interface IPropertyModel {
  parcelId: string;
  pid: string;
  pin: string;
  status: string;
  fiscalYear: string;
  agency: string;
  agencyCode: string;
  subAgency: string;
  propertyType: string;
  localId: string;
  name: string;
  description: string;
  classification: string;
  civicAddress: string;
  city: string;
  postal: string;
  latitude: string;
  longitude: string;
  landArea: string;
  landLegalDescription: string;
  buildingFloorCount: string;
  buildingConstructionType: string;
  buildingPredominateUse: string;
  buildingTenancy: string;
  buildingRentableArea: string;
  assessed: string;
  netBook: string;
  regionalDistrict: string;
  added?: boolean; // Only when received from API
  updated?: boolean;
  error?: string; // Error message
}

// This is the model that is created from CSV files exported from PIMS.
// Note that keys are often string phrases. Access them with bracket notation: obj["Key Name"]
export interface IExportedPropertyModel {
  Address?: string;
  Agency?: string;
  'Assessed Building Value'?: string;
  'Assessed Land Value'?: string;
  'Building Assessment Year'?: string;
  Classification: string;
  'Construction Type'?: string;
  Description?: string;
  'Land Area'?: string;
  'Land Assessment Year'?: string;
  'Last Updated On'?: string;
  Latitude: string;
  'Lease Expiry'?: string;
  'Legal Description'?: string;
  Location?: string;
  Longitude: string;
  Ministry: string;
  Name: string;
  'Netbook Date'?: string;
  'Netbook Value'?: string;
  Occupant?: string;
  'Occupant Type'?: string;
  PID: string;
  PIN?: string;
  Postal?: string;
  'Predominate Use'?: string;
  'Project Number': string;
  'Rentable Area'?: string;
  Sensitive?: string; // Stringified boolean
  Status?: string;
  Tenancy?: string;
  'Transfer Lease on Sale'?: string; // Stringified boolean
  Type: string;
  'Updated By'?: string;
  Zoning?: string;
  // Added these fields that were missing from export but are used in import
  'Local ID'?: string;
  'Building Floor Count'?: string;
  'Regional District'?: string;
}

/**
 * @description Takes a string representing CSV content of a file and converts it to a 2D array.
 * @param {string} csvContent Content of CSV file
 * @returns {Promise<IPropertyModel[]>} Promise of 2D array of Property Models
 */
export const parseCSVString = async (csvContent: string): Promise<IPropertyModel[]> => {
  return new Promise<IPropertyModel[]>((resolve, reject) => {
    const parsedCSV: Papa.ParseResult<any> = Papa.parse(csvContent, {
      header: true,
      delimiter: ',',
      newline: '\n',
      quoteChar: '"',
      skipEmptyLines: true,
    });

    if (parsedCSV.errors.length > 0) {
      reject({
        message: 'Error parsing CSV file',
        errors: parsedCSV.errors,
      });
    }
    if (parsedCSV.data.length < 1) {
      reject('CSV file is incomplete.');
    }

    const getFiscalYear = (property: IExportedPropertyModel) => {
      const yearFromFields =
        property.Type === 'Building'
          ? property['Building Assessment Year']
          : property['Land Assessment Year'];
      return !yearFromFields || yearFromFields === ''
        ? `${new Date().getFullYear()}`
        : yearFromFields; // Default to current year if no year
    };

    const getAssessedValue = (property: IExportedPropertyModel) => {
      const assessedFromFields =
        property.Type === 'Building'
          ? property['Assessed Building Value']
          : property['Assessed Land Value'];
      return !assessedFromFields || assessedFromFields === '' ? '0' : assessedFromFields;
    };

    const getValueOrDefault = (incomingValue: string | undefined, defaultValue: string) =>
      !incomingValue || incomingValue === '' ? `${defaultValue}` : incomingValue;
    // Transform raw objects into model that API expects
    const transformedData: IPropertyModel[] = parsedCSV.data.map(
      (property: IExportedPropertyModel) => ({
        parcelId: property.PID,
        pid: property.PID,
        pin: property.PIN ?? '',
        status: getValueOrDefault(property.Status, 'Active'), // Assume active if not specified
        fiscalYear: getFiscalYear(property),
        agency: '', // Not used in API. Leave blank.
        agencyCode: property.Ministry, // Names are misleading here.
        subAgency: property.Agency ?? '',
        propertyType: property.Type,
        localId: property['Local ID'] ?? '',
        name: property.Name,
        description: property.Description ?? '',
        classification: property.Classification,
        civicAddress: property.Address ?? '',
        city: getValueOrDefault(property.Location, '<blank>'), // Done to ensure something is passed to backend, empty string not enough
        postal: property.Postal ?? '',
        latitude: property.Latitude,
        longitude: property.Longitude,
        landArea: getValueOrDefault(property['Land Area'], '0'),
        landLegalDescription: property['Legal Description'] ?? '',
        buildingFloorCount: getValueOrDefault(property['Building Floor Count'], '1'),
        buildingConstructionType: getValueOrDefault(property['Construction Type'], 'Unknown'),
        buildingPredominateUse: getValueOrDefault(property['Predominate Use'], 'Unknown'),
        buildingTenancy: property.Tenancy ?? '',
        buildingRentableArea: getValueOrDefault(property['Rentable Area'], '0'),
        assessed: getAssessedValue(property),
        netBook: getValueOrDefault(property['Netbook Value'], '0'),
        regionalDistrict: getValueOrDefault(property['Regional District'], ''),
      }),
    );
    resolve(transformedData);
  });
};

/**
 * @description Takes a CSV file and converts it into a string for processing.
 * @param {File} file The incoming CSV file.
 * @returns {Promise<string>} A promise of the converted string.
 */
export const csvFileToString = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const csvData = (event.target.result as string)
          .replace(/\r\n/g, '\n')
          .replace(/^,+$/gm, '');
        resolve(csvData);
      } else {
        reject(new Error('Failed to read file.'));
      }
    };

    reader.onerror = (event) => {
      reject(new Error('Error reading file: ' + (event.target?.error?.message || 'Unknown error')));
    };

    reader.readAsText(file);
  });
};

/**
 * @description Converts a list of JS/JSON objects into a CSV file.
 * @param {object[]} incomingJSON The list of objects
 * @returns A CSV file encoded as a URI.
 */
export const dataToCsvFile: (incomingJSON: object[]) => string = (incomingJSON: object[]) => {
  const csvString = Papa.unparse(incomingJSON, {
    header: true,
  });
  const blob = new Blob([csvString], { type: 'text/csv' });
  const file = URL.createObjectURL(blob);
  return file;
};

/**
 * @description Combines each step in CSV utils to convert from CSV to Property Model.
 * @param {File} file The incoming CSV file.
 * @returns {IPropertyModel[]} An array of Property Model objects.
 */
export const csvFileToPropertyModel = async (file: File) => {
  const string = await csvFileToString(file);
  const objects: IPropertyModel[] = await parseCSVString(string);
  return objects;
};
