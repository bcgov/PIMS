import FileUploadArea from '@/components/fileHandling/FileUploadArea';
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
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const BulkUpload = () => {
  const [file, setFile] = useState<File>();
  const api = usePimsApi();
  const { submit, submitting } = useDataSubmitter(api.properties.uploadBulkSpreadsheet);
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
              'Select the Start Upload button.',
              'Stay on the results page until the upload is complete.',
              '(Optional) Select Download Results to receive a CSV file with each PID and its success status.',
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
          onClick={() => submit(file)}
          loading={submitting}
          disabled={file == undefined}
          sx={{ width: '20%' }}
          variant="contained"
        >
          Upload
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default BulkUpload;
