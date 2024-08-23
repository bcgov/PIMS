import FileUploadArea from '@/components/fileHandling/FileUploadArea';
import { ImportResult } from '@/hooks/api/usePropertiesApi';
import useDataLoader from '@/hooks/useDataLoader';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import usePimsApi from '@/hooks/usePimsApi';
import { ExpandMoreOutlined, Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import xlsx from 'node-xlsx';

const ResultsPaper = (props: {
  results: ImportResult[];
  rows: Array<Record<string, unknown>>;
  columns: GridColDef[];
  onDownloadClick: () => void;
}): JSX.Element => {
  const { results, columns, rows, onDownloadClick } = props;
  if (!results?.length) {
    return <></>;
  } else {
    if (results.at(0).CompletionPercentage < 0) {
      return (
        <Paper sx={{ padding: '2rem' }}>
          <Typography variant="h4">
            The most recent upload encountered the following error:
          </Typography>
          <Typography>{results.at(0).Message ?? 'Unknown error.'}</Typography>
        </Paper>
      );
    } else if (results.at(0).CompletionPercentage < 1.0) {
      return (
        <Paper sx={{ padding: '2rem' }}>
          <Typography variant="h4">Processing spreadsheet...</Typography>
        </Paper>
      );
    } else {
      return (
        <Paper sx={{ padding: '2rem' }}>
          <Box display={'flex'} flexDirection={'column'} gap={'1rem'} height={'38rem'}>
            <Typography variant="h4">Recent upload result</Typography>
            <Typography>{`Filename: ${results.at(0).FileName}`}</Typography>
            <Typography>{`Uploaded at: ${results.at(0).CreatedOn}`}</Typography>
            <Button
              onClick={onDownloadClick}
              sx={{ width: '10rem' }}
              endIcon={<Download />}
              variant="contained"
            >
              Download
            </Button>
            <DataGrid
              getRowHeight={() => 'auto'}
              sx={{
                borderStyle: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: 'none',
                },
                '& div div div div >.MuiDataGrid-cell': {
                  borderBottom: 'none',
                  borderTop: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'transparent',
                },
                [`& .${gridClasses.cell}`]: {
                  py: 1,
                },
              }}
              getRowId={(row) => row.rowNumber}
              columns={columns}
              rows={rows}
              disableRowSelectionOnClick
            />
          </Box>
        </Paper>
      );
    }
  }
};

const BulkUpload = () => {
  const [file, setFile] = useState<File>();
  const [fileProgress, setFileProgress] = useState(0);
  const api = usePimsApi();
  const { submit } = useDataSubmitter(api.properties.uploadBulkSpreadsheet);
  const { refreshData: refreshResults, data: importResults } = useDataLoader(() =>
    api.properties.getImportResults({ quantity: 1, sortKey: 'CreatedOn', sortOrder: 'DESC' }),
  );
  useEffect(() => {
    refreshResults().then((resp) => setFileProgress(resp?.at(0)?.CompletionPercentage ?? 0));
    const interval = setInterval(
      () =>
        refreshResults().then((resp) => setFileProgress(resp?.at(0)?.CompletionPercentage ?? 0)),
      2000,
    );
    return () => {
      clearInterval(interval);
    };
  }, []);
  const columns: GridColDef[] = [
    {
      field: 'rowNumber',
      headerName: 'Row No.',
    },
    {
      field: 'action',
      headerName: 'Action',
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1,
    },
  ];
  const resultRows = useMemo(() => {
    if (importResults?.length && importResults.at(0).Results != null)
      return importResults
        .at(0)
        .Results.slice()
        .sort((a, b) => a.rowNumber - b.rowNumber);
    else return [];
  }, [importResults]);

  const buildXlsxBuffer = (result: ImportResult) => {
    const rows = [];
    if (!result?.Results?.length) {
      return xlsx.build([{ name: `Results`, data: [], options: {} }]);
    }
    rows.push(['Row No.', 'Action', 'Reason']);
    for (const item of result.Results) {
      rows.push([item.rowNumber, item.action, item.reason ?? '']);
    }
    return xlsx.build([{ name: `Results`, data: rows, options: {} }]);
  };

  return (
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
      mb={'2rem'}
      flexDirection={'column'}
      width={'38rem'}
      marginX={'auto'}
    >
      <Typography mb={'2rem'} variant="h2">
        Bulk Upload Properties
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
          <Typography variant="h4">Steps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ listStyle: 'decimal', pl: 4 }}>
            {[
              'Drag and drop a file or select the file upload area to choose a file.',
              'Click the Upload button. Once you see the green submission confirmation message, you are free to navigate away from the page.',
              'Once the upload is complete, results of the submission will appear below the loading bar.',
            ].map((a, idx) => (
              <ListItem key={`steps-li-${idx}`} sx={{ display: 'list-item' }}>
                <ListItemText primary={a} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
          <Typography variant="h4">Requirements</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ listStyle: 'disc', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary={'File must be .csv format.'} />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  'CSV file should contain the following headers: Required Headers cannot have blank values.'
                }
              />
              <List sx={{ listStyle: 'disc', pl: 4 }}>
                {[
                  'PropertyType (Enter Land or Building)',
                  'PID',
                  'Classification',
                  'AgencyCode',
                  'AdministrativeArea',
                  'Latitude',
                  'Longitude',
                  'Name (Buildings only)',
                  'PredominateUse (Buildings only)',
                  'ConstructionType (Buildings only)',
                ].map((a, idx) => (
                  <ListItem key={`req-header-${idx}`} sx={{ display: 'list-item', py: '2px' }}>
                    <ListItemText primary={a} />
                  </ListItem>
                ))}
              </List>
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary={'Optional Headers may have blank values.'} />
              <List sx={{ listStyle: 'disc', pl: 4 }}>
                {[
                  'Description',
                  'Address',
                  'PIN',
                  'Assessed',
                  'AssessedYear',
                  'Netbook',
                  'FiscalYear',
                  'IsSensitive',
                  'IsVisibleToOtherAgencies',
                  'LandArea (for Land)',
                  'BuildingTenancy (for Building)',
                  'NetUsableArea (for Building)',
                  'BuildingFloorCount (for Building)',
                  'TotalArea (for Building)',
                ].map((a, idx) => (
                  <ListItem key={`req-header-${idx}`} sx={{ display: 'list-item', py: '2px' }}>
                    <ListItemText primary={a} />
                  </ListItem>
                ))}
              </List>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
          <Typography variant="h4">Notes</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 4 }}>
          <Typography>
            Buildings are matched with existing buildings using their Name and associated PID. Both
            must match an existing building in order to update that property.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <FileUploadArea
        file={file}
        onChange={(e) => {
          if (e.target.files[0]) setFile(e.target.files[0]);
        }}
        onDrop={(e) => {
          e.preventDefault();
          const files: File[] = Array.from(e.dataTransfer.files);
          if (files[0]) setFile(files[0]);
        }}
      />
      <Box alignItems={'center'} display={'flex'} gap={'1rem'}>
        <LinearProgress
          variant="determinate"
          value={fileProgress != null ? fileProgress * 100 : 0}
          sx={{
            width: '80%',
            height: '20px',
            borderRadius: '5px',
          }}
        />
        <LoadingButton
          onClick={() =>
            submit(file).then((resp) => {
              if (resp && resp.ok) {
                setFile(null);
                setFileProgress(
                  (resp.parsedBody as Record<string, any>)?.CompletionPercentage ?? 0,
                );
              }
            })
          }
          loading={
            (importResults?.at(0)?.CompletionPercentage ?? 1.0) < 1.0 &&
            (importResults?.at(0)?.CompletionPercentage ?? 1.0) >= 0
          }
          disabled={file == undefined}
          sx={{ width: '20%' }}
          variant="contained"
        >
          Upload
        </LoadingButton>
      </Box>
      <ResultsPaper
        onDownloadClick={() => {
          const buffer = buildXlsxBuffer(importResults?.at(0));
          const blob = new Blob([buffer]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = `Result_${importResults?.at(0)?.FileName}_${importResults?.at(0)?.CreatedOn}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }}
        rows={resultRows}
        results={importResults}
        columns={columns}
      />
    </Box>
  );
};

export default BulkUpload;
