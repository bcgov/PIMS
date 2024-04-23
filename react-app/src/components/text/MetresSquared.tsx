import { Typography } from '@mui/material';
import React from 'react';

/**
 * Renders a component that displays the unit for square meters.
 *
 * @returns The component that renders the unit for square meters.
 */
const MetresSquared = () => (
  <Typography
    sx={{
      display: 'inline',
      marginLeft: '0.5em',
    }}
  >
    m
    <span
      style={{
        verticalAlign: 'super',
        fontSize: 'small',
      }}
    >
      2
    </span>
  </Typography>
);

export default MetresSquared;
