import { parse } from 'csv-parse';

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
    const results: IPropertyModel[] = [];
    let headerMap: Record<string, number> = {};
    let lineCounter = 0;

    parse(csvContent, {
      delimiter: ',',
    })
      .on('data', (row: string[]) => {
        if (lineCounter !== 0) {
          results.push({
            parcelId: row[headerMap['parcelId']],
            pid: row[headerMap['pid']],
            pin: row[headerMap['pin']],
            status: row[headerMap['status']],
            fiscalYear: row[headerMap['fiscalYear']],
            agency: row[headerMap['agency']],
            agencyCode: row[headerMap['agencyCode']],
            subAgency: row[headerMap['subAgency']],
            propertyType: row[headerMap['propertyType']],
            localId: row[headerMap['localId']],
            name: row[headerMap['name']],
            description: row[headerMap['description']],
            classification: row[headerMap['classification']],
            civicAddress: row[headerMap['civicAddress']],
            city: row[headerMap['city']],
            postal: row[headerMap['postal']],
            latitude: row[headerMap['latitude']],
            longitude: row[headerMap['longitude']],
            landArea: row[headerMap['landArea']],
            landLegalDescription: row[headerMap['landLegalDescription']],
            buildingFloorCount: row[headerMap['buildingFloorCount']],
            buildingConstructionType: row[headerMap['buildingConstructionType']],
            buildingPredominateUse: row[headerMap['buildingPredominateUse']],
            buildingTenancy: row[headerMap['buildingTenancy']],
            buildingRentableArea: row[headerMap['buildingRentableArea']],
            assessed: row[headerMap['assessed']],
            netBook: row[headerMap['netBook']],
          });
        } else {
          headerMap = populateHeaderMap(row);
        }
        lineCounter++;
      })
      .on('end', () => {
        if (lineCounter < 2) {
          reject('CSV file is incomplete.');
        } else {
          resolve(results);
        }
      })
      .on('error', (error: Error) => reject(error));
  });
};

/**
 * @description Takes a comma delimited header row from CSV and determines where each field's index is
 * @param {string | string[]} headerRow The incoming header
 * @returns {Record<string, number>[]}An object with keys matching headers and an index indicating their order.
 */
export const populateHeaderMap = (headerRow: string | string[]) => {
  let headerList;
  if (headerRow && typeof headerRow === typeof 'string') {
    headerList = (headerRow as string).split(',');
  } else if (headerRow && Array.isArray(headerRow)) {
    headerList = headerRow;
  } else {
    throw new Error(
      `populateHeaderMap only accepts string or string[] types as its argument. Type ${typeof headerRow} is not accepted.`,
    );
  }

  if (headerList.length < 2) {
    throw new Error('populateHeaderMap requires a list of at least 2 headers. Check the input.');
  }

  return {
    parcelId: headerList.indexOf('parcelId'),
    pid: headerList.indexOf('pid'),
    pin: headerList.indexOf('pin'),
    status: headerList.indexOf('status'),
    fiscalYear: headerList.indexOf('fiscalYear'),
    agency: headerList.indexOf('agency'),
    agencyCode: headerList.indexOf('agencyCode'),
    subAgency: headerList.indexOf('subAgency'),
    propertyType: headerList.indexOf('propertyType'),
    localId: headerList.indexOf('localId'),
    name: headerList.indexOf('name'),
    description: headerList.indexOf('description'),
    classification: headerList.indexOf('classification'),
    civicAddress: headerList.indexOf('civicAddress'),
    city: headerList.indexOf('city'),
    postal: headerList.indexOf('postal'),
    latitude: headerList.indexOf('latitude'),
    longitude: headerList.indexOf('longitude'),
    landArea: headerList.indexOf('landArea'),
    landLegalDescription: headerList.indexOf('landLegalDescription'),
    buildingFloorCount: headerList.indexOf('buildingFloorCount'),
    buildingConstructionType: headerList.indexOf('buildingConstructionType'),
    buildingPredominateUse: headerList.indexOf('buildingPredominateUse'),
    buildingTenancy: headerList.indexOf('buildingTenancy'),
    buildingRentableArea: headerList.indexOf('buildingRentableArea'),
    assessed: headerList.indexOf('assessed'),
    netBook: headerList.indexOf('netBook'),
  };
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
 * @description Combines each step in CSV utils to convert from CSV to Property Model.
 * @param {File} file The incoming CSV file.
 * @returns {IPropertyModel[]} An array of Property Model objects.
 */
export const csvFileToPropertyModel = async (file: File) => {
  const string = await csvFileToString(file);
  const objects = await parseCSVString(string);
  return objects;
};
