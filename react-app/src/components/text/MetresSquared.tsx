import { Typography } from '@mui/material';
import React from 'react';

/**
 * Renders a component that displays the unit for square meters.
 *
 * @returns The component that renders the unit for square meters.
 */
const MetresSquared = () => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'self-start',
      marginLeft: '0.5em',
    }}
  >
    <Typography variant="body2">
      m
      <span
        style={{
          verticalAlign: 'super',
          fontSize: '8pt',
        }}
      >
        2
      </span>
    </Typography>
  </div>
);

export default MetresSquared;
