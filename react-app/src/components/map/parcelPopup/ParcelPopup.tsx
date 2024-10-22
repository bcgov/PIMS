import { GridColumnPair } from '@/components/common/GridHelpers';
import { ParcelData } from '@/hooks/api/useParcelLayerApi';
import usePimsApi from '@/hooks/usePimsApi';
import { Box, Grid, IconButton, Typography, Tab, SxProps } from '@mui/material';
import { LatLng } from 'leaflet';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Popup, useMap, useMapEvents } from 'react-leaflet';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './parcelPopup.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import useDataLoader from '@/hooks/useDataLoader';
import { UserContext } from '@/contexts/userContext';
import { Roles } from '@/constants/roles';
import BCAssessmentDetails from '@/components/map/parcelPopup/BCAssessmentDetails';
import LtsaDetails from '@/components/map/parcelPopup/LtsaDetails';
import ParcelLayerDetails from '@/components/map/parcelPopup/ParcelLayerDeatils';
import ParcelPopupSelect from '@/components/map/parcelPopup/ParcelPopupSelect';
import { JurRollPidXref } from '@/hooks/api/useBCAssessmentApi';

interface ParcelPopupProps {
  size?: 'small' | 'large';
  scrollOnClick?: boolean;
  mapEventsDisabled?: boolean;
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
  const { size = 'large', scrollOnClick, mapEventsDisabled } = props;

  const { pimsUser } = useContext(UserContext);

  const {
    data: ltsaData,
    refreshData: refreshLtsa,
    isLoading: ltsaLoading,
  } = useDataLoader(() => api.ltsa.getLtsabyPid(parcelData?.at(parcelIndex)?.PID_NUMBER));

  const {
    data: bcAssessmentData,
    refreshData: refreshBCA,
    isLoading: bcaLoading,
  } = useDataLoader(() =>
    api.bcAssessment.getBCAssessmentByLocation(clickPosition.lng, clickPosition.lat),
  );

  const {
    data: xrefData,
    refreshData: refreshXref,
    isLoading: xrefLoading,
  } = useDataLoader(() =>
    api.bcAssessment.getJurisdictionRoleByPid(parcelData.at(parcelIndex)?.PID_NUMBER),
  );

  const map = useMap();
  const api = usePimsApi();

  // If click position changes, refresh parcelData
  useEffect(() => {
    getParcelData();
  }, [clickPosition]);

  useEffect(() => {
    if (parcelData && clickPosition) {
      refreshLtsa();
      if (pimsUser.hasOneOfRoles([Roles.ADMIN])) {
        refreshXref();
        refreshBCA();
      }
    }
  }, [parcelData, parcelIndex]);

  useMapEvents({
    click: (e) => {
      if (!mapEventsDisabled) {
        setClickPosition(e.latlng);
      }
    },
  });

  const getParcelData = useCallback(() => {
    //zoom check here since I don't think it makes sense to allow this at anything more zoomed out than this
    //can't really click on any parcel with much accurancy beyond that point
    if (!mapEventsDisabled && map.getZoom() > 10 && clickPosition) {
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

  /**
   * Gets a matching record from BC Assessment data by using the XREF table in the database to
   * match the PID with a corresponding Jurisdiction Code and Roll Number.
   */
  const getMatchingBcaRecord = useMemo(() => {
    if (!xrefData || !bcAssessmentData) {
      return undefined;
    }
    if (xrefData.status !== 200) {
      return undefined;
    }
    const xrefRecord = xrefData.parsedBody as JurRollPidXref;
    const matchingFolio = bcAssessmentData.features.find(
      (folio) =>
        folio.properties.JURISDICTION_CODE === xrefRecord.JurisdictionCode &&
        folio.properties.ROLL_NUMBER === xrefRecord.RollNumber,
    );
    return matchingFolio;
  }, [bcAssessmentData, xrefData]);

  if (!clickPosition) return <></>;

  const tabPanelStyle: SxProps = {
    padding: '1em 0 0 0',
    height: '100%',
    overflowY: 'scroll',
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

              <Box minWidth={'300px'} id="popup-right" display={'flex'} flexDirection={'column'}>
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
                    {pimsUser.hasOneOfRoles([Roles.ADMIN]) ? <Tab label="BCA" value="2" /> : <></>}
                  </TabList>

                  <TabPanel value="0" sx={tabPanelStyle}>
                    <ParcelLayerDetails parcel={parcelData.at(parcelIndex)} width={POPUP_WIDTH} />
                  </TabPanel>
                  <TabPanel value="1" sx={tabPanelStyle}>
                    <LtsaDetails ltsaData={ltsaData} isLoading={ltsaLoading} width={POPUP_WIDTH} />
                  </TabPanel>
                  <TabPanel value="2" sx={tabPanelStyle}>
                    <BCAssessmentDetails
                      data={
                        bcAssessmentData && bcAssessmentData.features.length
                          ? getMatchingBcaRecord.properties
                          : undefined
                      }
                      isLoading={bcaLoading || xrefLoading}
                      width={POPUP_WIDTH}
                    />
                  </TabPanel>
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
