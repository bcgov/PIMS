import { GridColumnPair } from '@/components/common/GridHelpers';
import MetresSquared from '@/components/text/MetresSquared';
import { ParcelData } from '@/hooks/api/useParcelLayerApi';
import usePimsApi from '@/hooks/usePimsApi';
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
  useTheme,
  Tab,
  SxProps,
  CircularProgress,
} from '@mui/material';
import { LatLng } from 'leaflet';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Popup, useMap, useMapEvents } from 'react-leaflet';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './parcelPopup.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { LtsaOrder } from '@/hooks/api/useLtsaApi';
import useDataLoader from '@/hooks/useDataLoader';
import { dateFormatter, formatMoney } from '@/utilities/formatters';

interface ParcelPopupProps {
  size?: 'small' | 'large';
  scrollOnClick?: boolean;
}

const POPUP_WIDTH = '500px';

/**
 * Renders a popup component that displays information about a parcel on the map.
 * The popup is triggered by a click event on the map and shows details such as parcel ID, name, class, plan number, owner type, municipality, regional district, and area.
 * If there are multiple parcels at the clicked location, a select component is displayed to allow the user to choose a specific parcel.
 *
 * @returns {JSX.Element} The ParcelPopup component.
 */
export const ParcelPopup = (props: ParcelPopupProps) => {
  const [parcelData, setParcelData] = useState<ParcelData[]>(undefined); // All parcels at that click location.
  const [clickPosition, setClickPosition] = useState<LatLng>(null);
  const [parcelIndex, setParcelIndex] = useState<number>(0); // If multiple, which parcel to show info for.
  const [tabValue, setTabValue] = useState<string>('0');
  const { size = 'large', scrollOnClick } = props;

  const {
    data: ltsaData,
    refreshData: refreshLtsa,
    isLoading: ltsaLoading,
  } = useDataLoader(() => api.ltsa.getLtsabyPid(parcelData?.at(parcelIndex)?.PID_NUMBER));

  const map = useMap();
  const api = usePimsApi();

  // If click position changes, refresh parcelData
  useEffect(() => {
    getParcelData();
  }, [clickPosition]);

  useEffect(() => {
    if (parcelData) {
      refreshLtsa();
    }
  }, [parcelData, parcelIndex]);

  useMapEvents({
    click: (e) => {
      setClickPosition(e.latlng);
    },
  });

  const getParcelData = useCallback(() => {
    //zoom check here since I don't think it makes sense to allow this at anything more zoomed out than this
    //can't really click on any parcel with much accurancy beyond that point
    if (map.getZoom() > 10) {
      api.parcelLayer.getParcelByLatLng(clickPosition).then((response) => {
        if (response.features.length) {
          setParcelData(
            response.features
              .map((feature) => feature.properties as ParcelData)
              .filter((feature) => feature.PID_FORMATTED || feature.PIN)
              .sort((a, b) => {
                if (a.PID_NUMBER && b.PID_NUMBER) return a.PID_NUMBER - b.PID_NUMBER;
                else return 1;
              }),
          );
          setParcelIndex(0);
        } else {
          setParcelData(undefined);
        }
        if (scrollOnClick) map.setView(clickPosition);
      });
    } else {
      setParcelData(undefined);
    }
  }, [clickPosition]);

  if (!clickPosition) return <></>;

  const tabPanelStyle: SxProps = {
    padding: '1em 0 0 0',
  };

  if (size === 'large')
    return parcelData ? (
      <Popup autoPan={false} position={clickPosition} className="full-size">
        <Box display={'inline-flex'} minWidth={POPUP_WIDTH} height={'375px'}>
          {
            <>
              {/* Render a list of PIDs/PINs if there's more than one parcel feature here. */}
              {parcelData.length > 1 ? (
                <ParcelPopupSelect
                  parcelData={parcelData}
                  onClick={(index: number) => {
                    setParcelIndex(index);
                  }}
                  currentIndex={parcelIndex}
                />
              ) : (
                <></>
              )}

              <Box minWidth={'300px'}>
                {parcelData.at(parcelIndex).PID_FORMATTED ? (
                  <Typography variant="h4">{`PID: ${parcelData.at(parcelIndex).PID_FORMATTED}`}</Typography>
                ) : (
                  <></>
                )}
                {parcelData.at(parcelIndex).PIN != null ? (
                  <Typography variant="h4">{`PIN: ${parcelData.at(parcelIndex).PIN}`}</Typography>
                ) : (
                  <></>
                )}
                <TabContext value={tabValue}>
                  <TabList
                    onChange={(event, value) => setTabValue(value)}
                    sx={{ marginBottom: '0.5em=' }}
                  >
                    <Tab label="Parcel Layer" value="0" />
                    <Tab label="LTSA" value="1" />
                    {/* <Tab label="BCA" value="2" /> */}
                  </TabList>

                  <TabPanel value="0" sx={tabPanelStyle}>
                    <ParcelLayerDetails parcel={parcelData.at(parcelIndex)} />
                  </TabPanel>
                  <TabPanel value="1" sx={tabPanelStyle}>
                    <LtsaDetails ltsaData={ltsaData} isLoading={ltsaLoading} />
                  </TabPanel>
                  {/* <TabPanel value="2" sx={tabPanelStyle}> TODO: BCA Data Goes Here </TabPanel> */}
                </TabContext>
              </Box>
            </>
          }
        </Box>
      </Popup>
    ) : (
      <></>
    );

  return parcelData ? (
    <Popup autoPan={false} position={clickPosition} className="full-size">
      <Box display={'inline-flex'} width={150}>
        <Grid container>
          {parcelData.at(parcelIndex)?.PID_FORMATTED != null ||
          parcelData.at(parcelIndex)?.PIN != null ? (
            <GridColumnPair
              leftValue={parcelData.at(parcelIndex)?.PID_FORMATTED ? 'PID' : 'PIN'}
              rightValue={
                parcelData.at(parcelIndex)?.PID_FORMATTED ?? parcelData.at(parcelIndex)?.PIN
              }
            />
          ) : (
            <>No PID/PIN.</>
          )}
          {parcelData?.length > 1 ? (
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <IconButton size="small" onClick={() => setParcelIndex(Math.max(0, parcelIndex - 1))}>
                <KeyboardDoubleArrowLeftIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption">
                {parcelIndex + 1} of {parcelData.length}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setParcelIndex(Math.min(parcelData.length - 1, parcelIndex + 1))}
              >
                <KeyboardDoubleArrowRightIcon fontSize="small" />
              </IconButton>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Box>
    </Popup>
  ) : (
    <></>
  );
};

interface ParcelLayerDetailsProps {
  parcel: ParcelData;
}

/**
 * Renders the details of a parcel layer.
 *
 * @param {ParcelLayerDetailsProps} props - The props for the component.
 * @param {ParcelData} props.parcel - The parcel data to display.
 * @returns {JSX.Element} The rendered component.
 */
const ParcelLayerDetails = (props: ParcelLayerDetailsProps) => {
  const { parcel } = props;
  return (
    <Box minWidth={POPUP_WIDTH}>
      <Grid container gap={1}>
        {parcel ? (
          <>
            <GridColumnPair leftValue={'Class'} rightValue={parcel.PARCEL_CLASS} />
            <GridColumnPair leftValue={'Plan Number'} rightValue={parcel.PLAN_NUMBER} />
            <GridColumnPair leftValue={'Owner Type'} rightValue={parcel.OWNER_TYPE} />
            <GridColumnPair
              leftValue={'Municipality'}
              rightValue={parcel.MUNICIPALITY}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Regional District'}
              rightValue={parcel.REGIONAL_DISTRICT}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Area'}
              rightValue={
                <>
                  <span>{`${parcel.FEATURE_AREA_SQM}`}</span>
                  <MetresSquared />
                </>
              }
            />
          </>
        ) : (
          <Typography variant="body2">No parcel data available.</Typography>
        )}
      </Grid>
    </Box>
  );
};

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

interface LtsaDetailsProps {
  ltsaData: LtsaOrder;
  isLoading: boolean;
}

const LtsaDetails = (props: LtsaDetailsProps) => {
  const { ltsaData, isLoading } = props;

  if (isLoading)
    return (
      <Box display="flex" justifyContent={'center'} paddingTop={'2em'} minWidth={POPUP_WIDTH}>
        <CircularProgress />
      </Box>
    );

  const GridSubtitle = (props: PropsWithChildren) => (
    <>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          sx={{
            margin: 0,
          }}
        >
          {props.children}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ borderTop: 'solid 1px gray' }} />
    </>
  );

  return (
    <Box minWidth={POPUP_WIDTH} height={'300px'} overflow={'scroll'}>
      <Grid container gap={1}>
        {ltsaData && ltsaData.order ? (
          <>
            {/* TITLE DETAILS */}
            <GridSubtitle>Title Details</GridSubtitle>
            <GridColumnPair
              leftValue={'Title Number'}
              rightValue={ltsaData?.order.productOrderParameters.titleNumber}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Legal Description'}
              rightValue={
                ltsaData?.order.orderedProduct.fieldedData.descriptionsOfLand.at(0)
                  .fullLegalDescription
              }
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Title Status'}
              rightValue={ltsaData?.order.status}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Sales History'}
              rightValue={formatMoney(
                parseInt(ltsaData?.order.orderedProduct.fieldedData.tombstone.marketValueAmount),
              )}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Application Received'}
              rightValue={dateFormatter(
                ltsaData?.order.orderedProduct.fieldedData.tombstone.applicationReceivedDate,
              )}
              alignment="start"
            />
            <GridColumnPair
              leftValue={'Entered On'}
              rightValue={dateFormatter(
                ltsaData?.order.orderedProduct.fieldedData.tombstone.enteredDate,
              )}
              alignment="start"
            />
            {/* OWNERSHIP */}
            <GridSubtitle>Ownership by Interest</GridSubtitle>
            <Grid container item xs={12}>
              <Grid item xs={2}>
                %
              </Grid>
              <Grid container item xs={10}>
                <Grid item xs={9}>
                  {'Owner(s)'}
                </Grid>
                <Grid item xs={3}>
                  {'Incorporation #'}
                </Grid>
              </Grid>
            </Grid>

            {ltsaData.order.orderedProduct.fieldedData.ownershipGroups.map((group, index) => (
              <Grid item container xs={12} key={index}>
                <Grid item xs={2}>
                  <Typography variant="smallTable">
                    {`${((parseFloat(group.interestFractionNumerator) / parseFloat(group.interestFractionDenominator)) * 100).toFixed(2)}%`}{' '}
                  </Typography>
                </Grid>
                <Grid item xs={10} container>
                  {ltsaData.order.orderedProduct.fieldedData.ownershipGroups
                    .at(index)
                    .titleOwners.map((owner, subindex) => (
                      <Grid item container xs={12} key={subindex}>
                        <Grid item xs={9}>
                          <Typography variant="smallTable">
                            {`${owner.lastNameOrCorpName1}${owner.givenName ? `, ${owner.givenName}` : ''}`}{' '}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="smallTable">{owner.incorporationNumber}</Typography>
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            ))}

            {/* CHARGES */}
            <GridSubtitle>Charge Details</GridSubtitle>
            {ltsaData.order.orderedProduct.fieldedData.chargesOnTitle ? (
              <>
                <Grid container item xs={12}>
                  <Grid item xs={2}>
                    #
                  </Grid>
                  <Grid item xs={2}>
                    Status
                  </Grid>
                  <Grid item xs={2}>
                    Received
                  </Grid>
                  <Grid item xs={3}>
                    Transaction Type
                  </Grid>
                  <Grid item xs={3}>
                    Remarks
                  </Grid>
                </Grid>
                {ltsaData.order.orderedProduct.fieldedData.chargesOnTitle.map(
                  (chargeOnTitle, index) => (
                    <Grid key={index} item container xs={12}>
                      <Grid item xs={2}>
                        <Typography variant="smallTable">{chargeOnTitle.chargeNumber}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="smallTable">{chargeOnTitle.status}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="smallTable">
                          {dateFormatter(chargeOnTitle.charge.applicationReceivedDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="smallTable">
                          {chargeOnTitle.charge.transactionType}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="smallTable">{chargeOnTitle.chargeRemarks}</Typography>
                      </Grid>
                    </Grid>
                  ),
                )}
              </>
            ) : (
              <Typography variant="caption">No charge information available.</Typography>
            )}
          </>
        ) : (
          <Typography variant="body2">No LTSA information available.</Typography>
        )}
      </Grid>
    </Box>
  );
};
