import FileUploadArea from '@/components/fileHandling/FileUploadArea';
import { ImportResult } from '@/hooks/api/usePropertiesApi';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import usePimsApi from '@/hooks/usePimsApi';
import { dateFormatter } from '@/utilities/formatters';
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
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';

const BulkUpload = () => {
  const [file, setFile] = useState<File>();
  const api = usePimsApi();
  const { submit, submitting } = useDataSubmitter(api.properties.uploadBulkSpreadsheet);
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
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
  ];
  const exampleData: ImportResult[] = [
    {
      CompletionPercentage: 100,
      Results: [
        {
          action: 'inserted',
          rowNumber: 0,
        },
        {
          action: 'updated',
          rowNumber: 1,
        },
        {
          action: 'error',
          rowNumber: 2,
          reason:
            'duplicate key value violates unique constraint duplicate key value violates unique constraint',
        },
        {
          action: 'ignored',
          rowNumber: 3,
          reason: 'duplicate key value violates unique constraint',
        },
      ],
      FileName: 'TestFile.csv',
      Id: 0,
      CreatedById: '',
      CreatedOn: new Date(),
    },
  ];
  const resultRows = useMemo(
    () => exampleData.at(0).Results.sort((a, b) => a.rowNumber - b.rowNumber),
    [exampleData],
  );
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
              'Click the Upload button.',
              'Wait for the upload to complete. Results will be displayed below the progress bar.',
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
          value={50}
          sx={{ width: '80%', height: '20px', borderRadius: '5px' }}
        />
        <LoadingButton
          onClick={() =>
            submit(file).then((resp) => {
              if (resp && resp.ok) {
                setFile(null);
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
      <Paper sx={{ padding: '2rem' }}>
        <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
          <Typography variant="h4">Recent upload result</Typography>
          <Typography>{`Filename: ${exampleData.at(0).FileName}`}</Typography>
          <Typography>{`Uploaded at: ${dateFormatter(exampleData.at(0).CreatedOn)}`}</Typography>
          <DataGrid
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
            }}
            getRowId={(row) => row.rowNumber}
            columns={columns}
            rows={resultRows}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default BulkUpload;
