import React from 'react';
import { CheckCircle, FileUpload } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

interface IFileUploadArea {
  file?: File;
  onChange: (e: any) => void;
  onDrop: (e: any) => void;
}

const FileUploadArea = (props: IFileUploadArea) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        transition: 'all 0.25s',
        cursor: 'pointer',
        '&:hover': { 'background-color': 'lightgrey' },
      }}
      borderRadius={'5px'}
      height={'15rem'}
      onClick={() => document.getElementById('file-input')!.click()}
      onDrop={props.onDrop}
      onDragOver={(e: any) => e.preventDefault()}
    >
      <Box
        border={'dashed 4px darkgrey'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{ height: 'calc(100% - 8px)' }}
      >
        {props.file ? <CheckCircle /> : <FileUpload />}
        <Typography>
          {props.file ? props.file.name : 'Drag and drop or click to select file.'}
        </Typography>
      </Box>
      <input
        id="file-input"
        type="file"
        accept=".csv,.CSV"
        style={{ width: 0 }}
        onChange={props.onChange}
      />
    </Box>
  );
};

export default FileUploadArea;
