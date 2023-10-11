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
  Location: string;
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
  Sensitive: string; // Stringified boolean
  Status?: string;
  Tenancy?: string;
  'Transfer Lease on Sale'?: string; // Stringified boolean
  Type: string;
  'Updated By'?: string;
  Zoning?: string;
  // Added these fields that were missing from export but are used in import
  'Local ID'?: string;
  'Building Floor Count'?: string;
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

    // Transform raw objects into model that API expects
    const transformedData: IPropertyModel[] = parsedCSV.data.map(
      (property: IExportedPropertyModel) => ({
        parcelId: property.PID,
        pid: property.PID,
        pin: property.PIN ?? '',
        status: property.Status ?? '',
        // This cannot be nothing. It messes up the Date parsing in the API.
        fiscalYear:
          (property.Type === 'Building'
            ? property['Building Assessment Year']
            : property['Land Assessment Year']) ?? `${new Date().getFullYear()}`, // Default current year
        agency: '', // Not used in API. Leave blank.
        agencyCode: property.Ministry, // Names are misleading here.
        subAgency: property.Agency ?? '',
        propertyType: property.Type,
        localId: property['Local ID'] ?? '',
        name: property.Name,
        description: property.Description ?? '',
        classification: property.Classification,
        civicAddress: property.Address ?? '',
        city: property.Location,
        postal: property.Postal ?? '',
        latitude: property.Latitude,
        longitude: property.Longitude,
        landArea: property['Land Area'] ?? '0',
        landLegalDescription: property['Legal Description'] ?? '',
        buildingFloorCount: property['Building Floor Count'] ?? '1',
        buildingConstructionType: property['Construction Type'] ?? '',
        buildingPredominateUse: property['Predominate Use'] ?? '',
        buildingTenancy: property.Tenancy ?? '',
        buildingRentableArea: property['Rentable Area'] ?? '',
        assessed:
          property.Type === 'Building'
            ? property['Assessed Building Value'] ?? '0'
            : property['Assessed Land Value'] ?? '0',
        netBook: property['Netbook Value'] ?? '0',
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
        const csvData = event.target.result as string;
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
  return encodeURI(`data:text/csv;charset=utf-8,${csvString}`);
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
