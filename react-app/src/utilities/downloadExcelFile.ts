import { GridRowId, GridValidRowModel } from '@mui/x-data-grid';
import sheetjs from 'xlsx';

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
    // Create file name
    const fileName = `${includeDate ? new Date().toLocaleDateString('iso') : ''}_${tableName}${
      filterName ? '-' + filterName : ''
    }.xlsx`;
    // Build xlsx file
    const worksheet = sheetjs.utils.aoa_to_sheet(
      [columnHeaders, ...data.map((row) => Object.values(row.model))],
      { cellDates: true },
    );
    const workbook = sheetjs.utils.book_new();
    sheetjs.utils.book_append_sheet(workbook, worksheet, tableName);
    // Download the file
    sheetjs.writeFile(workbook, fileName);
  }
};
