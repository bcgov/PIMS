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
 * @returns 2D array of file contents
 */
export async function parseCSV(csvContent: string): Promise<IPropertyModel[]> {
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
      .on('end', () => resolve(results))
      .on('error', (error: Error) => reject(error));
  });
}

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

// export const csvToJson = (csvFile: File) => {
//   const reader = new FileReader();

//   reader.onload = async () => {
//     try {
//       const fileData = reader.result as string;
//       console.log(fileData);
//       const parsedData = await parseCSV(fileData);
//       console.log('parsedData', parsedData);
//       return parsedData;
//     } catch (error) {
//       console.error('Error parsing CSV:', error);
//     }
//   };

//   reader.readAsText(csvFile);
// };
