import { ParcelData } from '@/hooks/api/useParcelLayerApi';
import { Box, Typography, List, ListItem, useTheme } from '@mui/material';
import React from 'react';

interface ParcelPopupSelectProps {
  parcelData: ParcelData[];
  onClick?: (index: number) => void;
  currentIndex: number;
}

/**
 * Renders a list of parcels for selection in the ParcelPopup component.
 *
 * @param {ParcelPopupSelectProps} props - The props for the ParcelPopupSelect component.
 * @param {ParcelData[]} props.parcelData - The array of parcel data to be displayed.
 * @param {function} props.onClick - The function to be called when a parcel is clicked.
 * @returns {JSX.Element} The rendered ParcelPopupSelect component.
 */
const ParcelPopupSelect = (props: ParcelPopupSelectProps) => {
  const theme = useTheme();
  const { parcelData, onClick, currentIndex } = props;
  return (
    <Box minWidth={'200px'} marginRight={'2em'}>
      <Typography variant="h4">Select Parcel</Typography>
      <Typography variant="caption">(PID/PIN)</Typography>
      <List
        sx={{
          overflowY: 'scroll',
          maxHeight: '300px',
          border: `3px solid ${theme.palette.divider}`,
          borderRadius: '10px',
        }}
      >
        {parcelData.map((parcel, index) => (
          <ListItem
            key={parcel.PARCEL_FABRIC_POLY_ID}
            sx={{
              height: '2em',
              borderTop: `solid 1px ${theme.palette.divider}`,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.divider,
              },
              backgroundColor: currentIndex === index ? theme.palette.divider : undefined,
            }}
            onClick={() => {
              onClick(index);
            }}
          >
            <Typography> {parcel.PID_FORMATTED ?? parcel.PIN}</Typography>
          </ListItem>
        ))}
        <ListItem></ListItem>
      </List>
    </Box>
  );
};

export default ParcelPopupSelect;
