import { ParcelData } from '@/components/map/ParcelMap';
import { PropertyTypes } from '@/constants/propertyTypes';
import { Building } from '@/hooks/api/useBuildingsApi';
import { Parcel } from '@/hooks/api/useParcelsApi';
import usePimsApi from '@/hooks/usePimsApi';
import { pidFormatter } from '@/utilities/formatters';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import L, { LatLng } from 'leaflet';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface SelectedPropertyIdentifier {
  id: number;
  type: PropertyTypes;
}

export interface MapPropertyDetailsProps {
  property: SelectedPropertyIdentifier;
}

const MapPropertyDetails = (props: MapPropertyDetailsProps) => {
  const { property } = props;
  const [propertyData, setPropertyData] = useState(undefined);
  const [parcelLayerData, setParcelLayerData] = useState<ParcelData>(undefined);
  const [open, setOpen] = React.useState(false);

  const api = usePimsApi();
  const navigate = useNavigate();
  const theme = useTheme();

  const getPropertyData = async () => {
    setPropertyData(undefined);
    setOpen(true);
    let returnedProperty: Parcel | Building;
    if (property.type === PropertyTypes.BUILDING) {
      returnedProperty = await api.buildings.getBuildingById(property.id);
    } else {
      returnedProperty = await api.parcels.getParcelById(property.id);
    }
    setPropertyData(returnedProperty);
    const latlng: LatLng = L.latLng(returnedProperty.Location.y, returnedProperty.Location.x);
    api.parcelLayer.getParcelByLatLng(latlng).then((response) => {
      if (response.features.length) {
        setParcelLayerData(response.features.at(0).properties as ParcelData);
      } else {
        setParcelLayerData(undefined);
      }
    });
  };

  useEffect(() => {
    if (property.id != null && property.type != null) getPropertyData();
  }, [property]);

  const handleClose = () => {
    setPropertyData(undefined);
    setOpen(false);
  };

  const typographyStyle = (theme) => ({ ...theme.typography.body2 });
  const LeftGridColumn = (props: PropsWithChildren) => (
    <Grid
      item
      xs={4}
      typography={typographyStyle}
      sx={{
        fontWeight: 'bold',
      }}
    >
      {props.children}
    </Grid>
  );
  const RightGridColumn = (props: PropsWithChildren) => (
    <Grid item xs={7} typography={typographyStyle}>
      {props.children}
    </Grid>
  );
  const DividerGrid = () => (
    <Grid item xs={12}>
      <Divider
        variant="fullWidth"
        orientation="horizontal"
        sx={{
          borderWidth: '1px',
          borderColor: theme.palette.divider,
        }}
      />
    </Grid>
  );

  return (
    <Drawer
      anchor={'right'}
      open={open}
      onClose={handleClose}
      sx={{}}
      ModalProps={{
        sx: {
          marginTop: '10em',
          marginLeft: 'auto',
          right: '0',
          padding: '1em',
        },
      }}
      PaperProps={{
        sx: {
          position: 'absolute',
          maxWidth: '400px',
          height: 'fit-content',
          maxHeight: '600px',
          overflowX: 'clip',
          borderRadius: '10px 0px 0px 10px',
        },
      }}
    >
      <Box
        sx={{
          padding: '1em',
        }}
      >
        {propertyData ? (
          <Grid container gap={1}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/properties/parcel/${property.id}`);
                }}
                sx={{
                  width: '100%',
                }}
              >
                View Full Details
              </Button>
            </Grid>
            <DividerGrid />

            {/* PARCEL INFO SECTION */}
            <Grid item xs={12}>
              <Typography variant="h4">{`Property Info`}</Typography>
            </Grid>
            {propertyData?.PID ? (
              <>
                <LeftGridColumn>PID</LeftGridColumn>
                <RightGridColumn>{pidFormatter(propertyData?.PID)}</RightGridColumn>
              </>
            ) : (
              <>
                <LeftGridColumn>PIN</LeftGridColumn>
                <RightGridColumn>{propertyData?.PIN}</RightGridColumn>
              </>
            )}
            <LeftGridColumn>Name</LeftGridColumn>
            <RightGridColumn>{propertyData?.Name}</RightGridColumn>
            <LeftGridColumn>Ministry</LeftGridColumn>
            <RightGridColumn>
              {propertyData?.Agency?.Parent?.Name ?? propertyData?.Agency?.Name}
            </RightGridColumn>
            <LeftGridColumn>Agency</LeftGridColumn>
            <RightGridColumn>{propertyData?.Agency?.Name}</RightGridColumn>
            <LeftGridColumn>Classification</LeftGridColumn>
            <RightGridColumn>{propertyData?.Classification?.Name}</RightGridColumn>

            {/* LOCATION SECTION */}
            <DividerGrid />
            <Grid item xs={12}>
              <Typography variant="h4">{`Location`}</Typography>
            </Grid>
            <LeftGridColumn>Address</LeftGridColumn>
            <RightGridColumn>{propertyData?.Address1}</RightGridColumn>
            <LeftGridColumn>City</LeftGridColumn>
            <RightGridColumn>{propertyData?.AdministrativeArea?.Name}</RightGridColumn>
            <LeftGridColumn>Postal</LeftGridColumn>
            <RightGridColumn>{propertyData?.Postal}</RightGridColumn>
            <LeftGridColumn>Regional Dist.</LeftGridColumn>
            <RightGridColumn>
              {propertyData?.AdministrativeArea?.RegionalDistrict?.Name}
            </RightGridColumn>

            {/* PARCEL LAYER DATA */}
            {parcelLayerData ? (
              <>
                <DividerGrid />
                <Grid item xs={12}>
                  <Typography variant="h4">{`Parcel Layer`}</Typography>
                </Grid>
                <LeftGridColumn>Lot Size</LeftGridColumn>
                <RightGridColumn>{`${(parcelLayerData?.FEATURE_AREA_SQM / 10000).toFixed(2)} hectares`}</RightGridColumn>
              </>
            ) : (
              <></>
            )}
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Drawer>
  );
};

export default MapPropertyDetails;
