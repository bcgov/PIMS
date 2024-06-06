import { ClassificationIcon } from '@/components/property/ClassificationIcon';
import { PropertyTypes } from '@/constants/propertyTypes';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface PropertyRowProps {
  id: number;
  propertyTypeId: number;
  title: string;
  content1: string;
  content2: string;
}

/**
 * Renders a row for a list of properties that displays an icon, a title, and two text fields.
 *
 * @param {PropertyRowProps} props - The props object used for ParcelRow component.
 * @returns {JSX.Element} The ParcelRow component.
 */
const PropertyRow = (props: PropertyRowProps) => {
  const { id, propertyTypeId, title, content1, content2 } = props;
  const theme = useTheme();
  const propertyType = propertyTypeId === PropertyTypes.BUILDING ? 'building' : 'parcel';
  return (
    <Grid
      container
      width={'100%'}
      padding={'1em 0'}
      borderBottom={`solid 1px ${theme.palette.gray.main}`}
    >
      <Grid item xs={3} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Link to={`/properties/${propertyType}/${id}`} target="_blank" rel="noopener noreferrer">
          <ClassificationIcon
            iconType={propertyType}
            textColor={theme.palette.text.primary}
            badgeColor={'red'}
            scale={1.2}
            badgeScale={1}
          />
        </Link>
      </Grid>
      <Grid item xs={9}>
        <Link
          to={`/properties/${propertyType}/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            width: 'fit-content',
            display: 'flex',
          }}
        >
          <Typography color={theme.palette.blue.main} fontSize={'0.8em'} fontWeight={'bold'}>
            {title}
          </Typography>
        </Link>
        <Typography fontSize={'0.8em'}>{content1}</Typography>
        <Typography fontSize={'0.8em'}>{content2}</Typography>
      </Grid>
    </Grid>
  );
};

export default PropertyRow;
