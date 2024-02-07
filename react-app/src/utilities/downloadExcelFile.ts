import { GridRowId, GridValidRowModel } from '@mui/x-data-grid';
import xlsx from 'node-xlsx';

/**
 * @interface
 * @description Properties expected for downloadExcelFile function.
 */
export interface IExcelDownloadProps {
  tableName: string;
  data: {
    id: GridRowId;
    model: GridValidRowModel;
  }[];
  filterName?: string;
  includeDate?: boolean;
}

/**
 * @description Uses exported rows from MUI DataGrid to build and download an Excel file.
 * @param {IExcelDownloadProps} props
 */
export const downloadExcelFile = (props: IExcelDownloadProps) => {
  const { tableName, data, filterName, includeDate } = props;
  // No point exporting if there are no data
  if (data.length > 0) {
    // Extract column headers
    const columnHeaders = Object.keys(data.at(0).model);
    // Build xlsx file as bit array buffer
    const bitArray = xlsx.build([
      {
        name: tableName,
        data: [columnHeaders, ...data.map((row) => Object.values(row.model))],
        options: {}, // Required even if empty
      },
    ]);
    // Combine into one string of data
    const binaryString = bitArray.reduce((acc, cur) => (acc += String.fromCharCode(cur)), '');
    // Convert data into file
    const file = window.btoa(binaryString);
    const url = `data:application/xlsx;base64,${file}`;
    // Create file name
    const fileName = `${includeDate ? new Date().toISOString().substring(0, 10) : ''}_${tableName}${
      '-' + filterName || ''
    }`;
    // Download file
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};
