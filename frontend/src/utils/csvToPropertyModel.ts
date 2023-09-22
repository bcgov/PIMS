import Papa from 'papaparse';

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
    if (parsedCSV.data.length < 2) {
      reject('CSV file is incomplete.');
    }

    resolve(parsedCSV.data);
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
