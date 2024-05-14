import { ParcelData } from '@/hooks/api/useParcelLayerApi';
import { SelectedMarkerContext } from '@/components/map/ParcelMap';
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
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export interface SelectedPropertyIdentifier {
  id: number;
  type: PropertyTypes;
}

export interface MapPropertyDetailsProps {
  property: SelectedPropertyIdentifier;
}

const typographyStyle = (theme) => ({ ...theme.typography.body2 });
export const LeftGridColumn = (props: PropsWithChildren & { alignment?: string }) => (
  <Grid
    item
    xs={4}
    typography={typographyStyle}
    sx={{
      fontWeight: 'bold',
      display: 'flex',
      alignItems: props.alignment ?? 'center',
    }}
  >
    {props.children}
  </Grid>
);
export const RightGridColumn = (props: PropsWithChildren & { alignment?: string }) => (
  <Grid
    item
    xs={7}
    typography={typographyStyle}
    sx={{
      display: 'flex',
      alignItems: props.alignment ?? 'center',
    }}
  >
    {props.children ?? ''}
  </Grid>
);

export interface GridColumnPairProps {
  leftValue: any;
  rightValue: any;
  alignment?: string;
}

/**
 * Renders a pair of grid columns with a left value and a right value.
 *
 * @param {GridColumnPairProps} props - The props for the GridColumnPair component.
 * @param {any} props.leftValue - The value to be displayed in the left column.
 * @param {any} props.rightValue - The value to be displayed in the right column.
 * @param {string} [props.alignment] - The alignment of the columns. Defaults to 'center'.
 * @returns {JSX.Element} The rendered GridColumnPair component.
 */
export const GridColumnPair = (props: GridColumnPairProps) => {
  return (
    <>
      <LeftGridColumn alignment={props.alignment}>{props.leftValue}</LeftGridColumn>
      <RightGridColumn alignment={props.alignment}>{props.rightValue}</RightGridColumn>
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

/**
 * Renders a drawer component that displays property details.
 *
 * @param {MapPropertyDetailsProps} props - The properties passed to the component.
 * @param {SelectedPropertyIdentifier} props.property - The selected property identifier.
 * @returns {JSX.Element} The rendered component.
 */
const MapPropertyDetails = (props: MapPropertyDetailsProps) => {
  const { property } = props;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedMarker } = useContext(SelectedMarkerContext);

  const handleClose = () => {
    setOpen(false);
    setSelectedMarker(undefined);
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
              to={`/properties/${property?.type === PropertyTypes.BUILDING ? 'building' : 'parcel'}/${property?.id}`}
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
              onClick={handleClose}
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
          <GridColumnPair
            leftValue={'Total Area'}
            rightValue={
              <>
                <span>{`${(propertyData as Building)?.TotalArea}`}</span>
                <MetresSquared />
              </>
            }
          />
          <GridColumnPair
            leftValue={'Rentable Area'}
            rightValue={
              <>
                <span>{`${(propertyData as Building)?.RentableArea}`}</span>
                <MetresSquared />
              </>
            }
          />
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
