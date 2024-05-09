import { ParcelData } from '@/components/map/ParcelMap';
import MetresSquared from '@/components/text/MetresSquared';
import { PropertyTypes } from '@/constants/propertyTypes';
import { Building } from '@/hooks/api/useBuildingsApi';
import { Parcel } from '@/hooks/api/useParcelsApi';
import usePimsApi from '@/hooks/usePimsApi';
import { pidFormatter } from '@/utilities/formatters';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import L, { LatLng } from 'leaflet';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export interface SelectedPropertyIdentifier {
  id: number;
  type: PropertyTypes;
}

export interface MapPropertyDetailsProps {
  property: SelectedPropertyIdentifier;
}

const typographyStyle = (theme) => ({ ...theme.typography.body2 });
const LeftGridColumn = (props: PropsWithChildren) => (
  <Grid
    item
    xs={4}
    typography={typographyStyle}
    sx={{
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
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

const GridColumnPair = ({ leftValue, rightValue }) => {
  return (
    <>
      <LeftGridColumn>{leftValue}</LeftGridColumn>
      <RightGridColumn>{rightValue}</RightGridColumn>
    </>
  );
};
const DividerGrid = () => {
  const theme = useTheme();
  return (
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
};

const MapPropertyDetails = (props: MapPropertyDetailsProps) => {
  const { property } = props;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      anchor={'right'}
      variant="persistent"
      open={open}
      onClose={handleClose}
      ModalProps={{
        sx: {
          marginLeft: 'auto',
          right: '0',
          padding: '1em',
        },
      }}
      PaperProps={{
        sx: {
          marginTop: '10em',
          position: 'absolute',
          maxWidth: '400px',
          height: 'fit-content',
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
        <Grid container gap={1}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={`/properties/${property.type === PropertyTypes.BUILDING ? 'building' : 'parcel'}/${property.id}`}
              style={{
                width: '100%',
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: '100%',
                }}
              >
                View Full Details
              </Button>
            </Link>
            <IconButton
              sx={{
                marginLeft: '0.5em',
              }}
              onClick={() => setOpen(false)}
            >
              <Close />
            </IconButton>
          </Grid>
          <DividerGrid />
          {isLoading ? (
            <CircularProgress />
          ) : (
            <DrawerContents
              property={property}
              afterPropertyLoad={() => {
                setOpen(true);
                setIsLoading(false);
              }}
            />
          )}
        </Grid>
      </Box>
    </Drawer>
  );
};

export interface ContentsProps extends MapPropertyDetailsProps {
  afterPropertyLoad: () => void;
}

const DrawerContents = (props: ContentsProps) => {
  const { property, afterPropertyLoad } = props;
  const [propertyData, setPropertyData] = useState(undefined);
  const [parcelLayerData, setParcelLayerData] = useState<ParcelData>(undefined);
  const api = usePimsApi();

  useEffect(() => {
    if (property?.id != null && property?.type != null) getPropertyData();
  }, [property]);

  const getPropertyData = async () => {
    let returnedProperty: Parcel | Building;
    if (property?.type === PropertyTypes.BUILDING) {
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
    afterPropertyLoad();
  };

  return (
    <>
      {/* PARCEL INFO SECTION */}
      <Grid item xs={12}>
        <Typography variant="h4">{`Property Info`}</Typography>
      </Grid>
      {propertyData?.PID ? (
        <GridColumnPair leftValue={'PID'} rightValue={pidFormatter(propertyData?.PID)} />
      ) : (
        <GridColumnPair leftValue={'PIN'} rightValue={propertyData?.PIN} />
      )}
      <GridColumnPair leftValue={'Name'} rightValue={propertyData?.Name} />
      <GridColumnPair
        leftValue={'Ministry'}
        rightValue={propertyData?.Agency?.Parent?.Name ?? propertyData?.Agency?.Name}
      />
      <GridColumnPair leftValue={'Agency'} rightValue={propertyData?.Agency?.Name} />
      <GridColumnPair
        leftValue={'Classification'}
        rightValue={propertyData?.Classification?.Name}
      />

      {/* LOCATION SECTION */}
      <DividerGrid />
      <Grid item xs={12}>
        <Typography variant="h4">{`Location`}</Typography>
      </Grid>
      <GridColumnPair leftValue={'Address'} rightValue={propertyData?.Address1} />
      <GridColumnPair leftValue={'City'} rightValue={propertyData?.AdministrativeArea?.Name} />
      <GridColumnPair leftValue={'Postal'} rightValue={propertyData?.Postal} />
      <GridColumnPair
        leftValue={'Regional Dist.'}
        rightValue={propertyData?.AdministrativeArea?.RegionalDistrict?.Name}
      />

      {/* PARCEL LAYER DATA */}
      {property?.type !== PropertyTypes.BUILDING && parcelLayerData ? (
        <>
          <DividerGrid />
          <Grid item xs={12}>
            <Typography variant="h4">{`Parcel Layer`}</Typography>
          </Grid>
          <GridColumnPair
            leftValue={'Lot Size'}
            rightValue={`${(parcelLayerData?.FEATURE_AREA_SQM / 10000).toFixed(2)} hectares`}
          />
        </>
      ) : (
        <></>
      )}

      {/* BUILDING INFO */}
      {property?.type === PropertyTypes.BUILDING ? (
        <>
          <DividerGrid />
          <Grid item xs={12}>
            <Typography variant="h4">{`Building Info`}</Typography>
          </Grid>
          <GridColumnPair
            leftValue={'Predominate Use'}
            rightValue={(propertyData as Building)?.BuildingPredominateUse?.Name}
          />
          <GridColumnPair
            leftValue={'Description'}
            rightValue={(propertyData as Building)?.Description}
          />
          <LeftGridColumn>Total Area</LeftGridColumn>
          <RightGridColumn>
            {(propertyData as Building)?.TotalArea}
            <MetresSquared />
          </RightGridColumn>
          <LeftGridColumn>Rentable Area</LeftGridColumn>
          <RightGridColumn>
            {(propertyData as Building)?.RentableArea}
            <MetresSquared />
          </RightGridColumn>
          <GridColumnPair
            leftValue={'Tenancy'}
            rightValue={
              isNaN(+(propertyData as Building)?.BuildingTenancy)
                ? (propertyData as Building)?.BuildingTenancy
                : `${(propertyData as Building)?.BuildingTenancy} %`
            }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default MapPropertyDetails;
