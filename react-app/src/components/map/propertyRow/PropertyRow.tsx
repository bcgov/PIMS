import { ClassificationIcon } from '@/components/property/ClassificationIcon';
import { useClassificationStyle } from '@/components/property/PropertyTable';
import { PropertyTypes } from '@/constants/propertyTypes';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

interface PropertyRowProps {
  id: number;
  propertyTypeId: number;
  classificationId?: number;
  title: string;
  content: string[];
}

/**
 * Renders a row for a list of properties that displays an icon, a title, and content fields.
 *
 * @param {PropertyRowProps} props - The props object used for ParcelRow component.
 * @returns {JSX.Element} The ParcelRow component.
 */
const PropertyRow = (props: PropertyRowProps) => {
  const { id, propertyTypeId, title, content, classificationId } = props;
  const theme = useTheme();
  const propertyType = propertyTypeId === PropertyTypes.BUILDING ? 'building' : 'parcel';

  // For classification colours
  const classification = useClassificationStyle();
  const classificationColour =
    classificationId != null
      ? classification[classificationId].textColor
      : theme.palette.black.main;

  return (
    <Box
      onClick={() => window.open(`/properties/${propertyType}/${id}`)}
      sx={{
        cursor: 'pointer',
        backgroundColor: theme.palette.white.main,
        '& :hover': {
          backgroundColor: theme.palette.gray.main,
        },
      }}
    >
      <Grid
        container
        width={'100%'}
        padding={'1em'}
        borderBottom={`solid 1px ${theme.palette.gray.main}`}
      >
        <Grid item xs={3} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <ClassificationIcon
            iconType={propertyType}
            textColor={theme.palette.text.primary}
            badgeColor={classificationColour}
            scale={1.2}
            badgeScale={1}
          />
        </Grid>
        <Grid item xs={9}>
          <Typography color={theme.palette.blue.main} fontSize={'0.8em'} fontWeight={'bold'}>
            {title}
          </Typography>
          {content.map((c, index) => (
            <Typography key={index} fontSize={'0.8em'}>
              {c}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyRow;
