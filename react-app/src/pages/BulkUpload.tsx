import FileUploadArea from '@/components/fileHandling/FileUploadArea';
import { ImportResult } from '@/hooks/api/usePropertiesApi';
import useDataLoader from '@/hooks/useDataLoader';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import usePimsApi from '@/hooks/usePimsApi';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';

const ResultsPaper = (props: {
  results: ImportResult[];
  rows: Array<Record<string, unknown>>;
  columns: GridColDef[];
}): JSX.Element => {
  const { results, columns, rows } = props;
  if (!results?.length) {
    return <></>;
  } else {
    if (results.at(0).CompletionPercentage < 1.0) {
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
  const { submit, submitting } = useDataSubmitter(api.properties.uploadBulkSpreadsheet);
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
            {[
              'File must be .csv format.',
              'CSV file should contain the following headers: Required Headers cannot have blank values.',
              'Optional Headers may have blank values.',
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
          sx={{ width: '80%', height: '20px', borderRadius: '5px' }}
        />
        <LoadingButton
          onClick={() =>
            submit(file).then((resp) => {
              if (resp && resp.ok) {
                setFile(null);
                setFileProgress(resp.parsedBody?.CompletionPercentage ?? 0);
              }
            })
          }
          loading={submitting}
          disabled={file == undefined}
          sx={{ width: '20%' }}
          variant="contained"
        >
          Upload
        </LoadingButton>
      </Box>
      <ResultsPaper rows={resultRows} results={importResults} columns={columns} />
    </Box>
  );
};

export default BulkUpload;
