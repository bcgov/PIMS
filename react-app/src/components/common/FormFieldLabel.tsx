import Help from '@mui/icons-material/Help';
import { Box, Tooltip } from '@mui/material';
import React from 'react';

interface FormFieldLabelProps {
  label: string;
  tooltip?: string;
}

const FormFieldLabel = (props: FormFieldLabelProps) => {
  const { label, tooltip } = props;
  return (
    <Box display={'inline-flex'} alignItems={'center'}>
      {`${label} `}
      {tooltip && (
        <Tooltip title={tooltip}>
          <Help sx={{ ml: '4px' }} fontSize="small" />
        </Tooltip>
      )}
    </Box>
  );
};

export default FormFieldLabel;
