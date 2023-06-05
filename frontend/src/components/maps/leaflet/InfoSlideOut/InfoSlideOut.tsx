import variables from '_variables.module.scss';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import clsx from 'classnames';
import { BuildingSvg, LandSvg } from 'components/common/Icons';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ControlPanel } from 'components/leaflet';
import { PropertyPopUpContext } from 'components/maps/providers/PropertyPopUpProvider';
import { PropertyTypes } from 'constants/propertyTypes';
import { MAX_ZOOM } from 'constants/strings';
import { useApi } from 'hooks/useApi';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import * as L from 'leaflet';
import * as React from 'react';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaInfo, FaPlusSquare } from 'react-icons/fa';
import { useMap } from 'react-leaflet';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store';
import { storePropertyDetail } from 'store/slices/parcelSlice';
import styled from 'styled-components';

import FilterBackdrop from '../FilterBackdrop';
import { AssociatedBuildingsList } from './AssociatedBuildingsList';
import AssociatedParcelsList from './AssociatedParcelsList';
import HeaderActions from './HeaderActions';
import { InfoContent } from './InfoContent';

const InfoContainer = styled.div`
  margin-right: -10px;
  width: 341px;
  min-height: 52px;
  height: auto;
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  &.closed {
    width: 0px;
    height: 0px;
  }
`;

const InfoHeader = styled.div`
  width: 100%;
  height: 52px;
  background-color: ${variables.slideOutBlue};
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 16px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

const InfoMain = styled.div`
  width: 100%;
  padding-left: 10px;
  padding: 0px 10px 5px 10px;
  position: relative;
  &.open {
    overflow-y: scroll;
    max-height: calc(100vh - 380px);
  }
`;

const InfoIcon = styled(FaInfo)`
  font-size: 30px;
`;

const InfoButton = styled(Button)`
  width: 52px;
  height: 52px;
  position: absolute;
  left: -51px;
  background-color: #fff;
  color: ${variables.slideOutBlue};
  border-color: ${variables.slideOutBlue};
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);
  &.open {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    top: 0px;
  }
`;

const TabButton = styled(Button)`
  width: 40px;
  height: 40px;
  position: absolute;
  left: -40px;
  background-color: #fff;
  color: ${variables.slideOutBlue};
  border-color: ${variables.slideOutBlue};
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);
  &.open {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    top: 55px;
  }
  .svg {
    stroke: ${variables.slideOutBlue};
    margin-left: -8px;
    :hover {
      stroke: #fff;
    }
  }
`;

const Title = styled.p`
  font-size: 18px;
  color: #ffffff;
  text-decoration: none solid rgb(255, 255, 255);
  line-height: 18px;
  font-weight: bold;
`;

export type InfoControlProps = {
  /** whether the slide out is open or closed */
  open: boolean;
  /** set the slide out as open or closed*/
  setOpen: (state: boolean) => void;
  /** additional action for when a link is clicked */
  onHeaderActionClick?: () => void;
};

/**
 * Component to display the popup information of a parcel/building
 * @param open open/closed state of the slideout
 * @param setOpen function to set the slideout as open or closed
 * @param onHeaderActionClick action to be taken when a menu item is clicked
 */
const InfoControl: React.FC<InfoControlProps> = ({ open, setOpen, onHeaderActionClick }) => {
  const popUpContext = React.useContext(PropertyPopUpContext);
  const { getParcel, getBuilding } = useApi();
  const mapInstance = useMap();
  const { propertyInfo } = popUpContext;
  const location = useLocation();
  const jumpToView = () =>
    mapInstance?.setView(
      [propertyInfo?.latitude as number, propertyInfo?.longitude as number],
      Math.max(MAX_ZOOM, mapInstance.getZoom()),
    );
  const zoomToView = () =>
    mapInstance?.flyTo(
      [propertyInfo?.latitude as number, propertyInfo?.longitude as number],
      Math.max(MAX_ZOOM, mapInstance.getZoom()),
      { animate: false },
    );

  useEffect(() => {
    const elem = L.DomUtil.get('infoContainer');
    if (elem) {
      L.DomEvent.on(elem!, 'mousewheel', L.DomEvent.stopPropagation);
    }
  });

  useEffect(() => {
    // Send data to Snowplow.
    if (propertyInfo) {
      window.snowplow('trackSelfDescribingEvent', {
        schema: 'iglu:ca.bc.gov.pims/listing_click/jsonschema/1-0-0',
        data: {
          view: 'map',
          property_name: propertyInfo.name ?? '',
          agency: propertyInfo.agency ?? '',
          pid: propertyInfo.pid ?? '',
          classification: propertyInfo.classification ?? '',
        },
      });
    }
  }, [propertyInfo]);

  //whether the general info is open
  const [generalInfoOpen, setGeneralInfoOpen] = React.useState<boolean>(true);

  const isBuilding = popUpContext.propertyTypeID === PropertyTypes.BUILDING;

  // Building link query params
  const buildingQueryParams = new URLSearchParams(location.search);
  buildingQueryParams.set('sidebar', 'true');
  buildingQueryParams.set('disabled', 'true');
  buildingQueryParams.set('loadDraft', 'false');
  buildingQueryParams.set('buildingId', '0');
  buildingQueryParams.set('associatedParcelId', `${propertyInfo?.id}`);
  buildingQueryParams.set('parcelId', 'undefined');

  const addAssociatedBuildingLink = (
    <>
      <FaPlusSquare color="#1a5a96" className="mr-1" />
      <Link
        style={{ color: variables.slideOutBlue }}
        to={{
          pathname: `/mapview`,
          search: buildingQueryParams.toString(),
        }}
      >
        Add a new Building
      </Link>
    </>
  );

  const keycloak = useKeycloakWrapper();
  const dispatch = useAppDispatch();
  const canViewProperty = keycloak.canUserViewProperty(propertyInfo);
  const canEditProperty = keycloak.canUserEditProperty(propertyInfo);

  const renderContent = () => {
    if (popUpContext.propertyInfo) {
      if (generalInfoOpen) {
        return (
          <>
            <FilterBackdrop show={open && popUpContext.loading}></FilterBackdrop>
            <HeaderActions
              propertyInfo={popUpContext.propertyInfo}
              propertyTypeId={popUpContext.propertyTypeID}
              onLinkClick={onHeaderActionClick}
              jumpToView={jumpToView}
              zoomToView={zoomToView}
              canViewDetails={canViewProperty}
              canEditDetails={canEditProperty}
            />
            <InfoContent
              propertyInfo={popUpContext.propertyInfo}
              propertyTypeId={popUpContext.propertyTypeID}
              canViewDetails={canViewProperty}
            />
          </>
        );
      } else if (canViewProperty) {
        if (isBuilding) {
          return (
            <AssociatedParcelsList parcels={(popUpContext.propertyInfo as IBuilding).parcels} />
          );
        } else {
          return (
            <AssociatedBuildingsList
              propertyInfo={popUpContext.propertyInfo as IParcel}
              addAssociatedBuildingLink={addAssociatedBuildingLink}
              canEditDetails={canEditProperty}
            />
          );
        }
      }
    } else {
      return <p>Click a pin to view the property details</p>;
    }
  };

  return (
    <ControlPanel position="topright">
      <InfoContainer id="infoContainer" className={clsx({ closed: !open })}>
        {open && (
          <InfoHeader>
            {isBuilding ? <Title>Building Info</Title> : <Title>Property Info</Title>}
          </InfoHeader>
        )}
        <TooltipWrapper toolTipId="info-slideout-id" toolTip="Property Information">
          <InfoButton
            id="slideOutInfoButton"
            variant="outline-secondary"
            onClick={() => {
              const propertyTypeId = popUpContext.propertyTypeID;
              const id = popUpContext.propertyInfo?.id;
              if (typeof propertyTypeId === 'number' && propertyTypeId >= 0 && !!id && !open) {
                popUpContext.setLoading(true);
                if ([PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(propertyTypeId)) {
                  getParcel(id as number)
                    .then((parcel: IParcel) => {
                      popUpContext.setPropertyInfo(parcel);
                    })
                    .catch(() => {
                      toast.error(
                        'Unable to load property details, refresh the page and try again.',
                      );
                    })
                    .finally(() => {
                      popUpContext.setLoading(false);
                    });
                } else if (propertyTypeId === PropertyTypes.BUILDING) {
                  getBuilding(id as number)
                    .then((building: IBuilding) => {
                      popUpContext.setPropertyInfo(building);
                      if (!!building.parcels.length) {
                        dispatch(
                          storePropertyDetail({
                            propertyTypeId: 1,
                            parcelDetail: building,
                          }),
                        );
                      }
                    })
                    .catch(() => {
                      toast.error(
                        'Unable to load property details, refresh the page and try again.',
                      );
                    })
                    .finally(() => {
                      popUpContext.setLoading(false);
                    });
                }
              }
              if (!open) {
                setOpen(true);
                setGeneralInfoOpen(true);
              } else if (open && !generalInfoOpen) {
                setGeneralInfoOpen(true);
              } else {
                setOpen(false); //close the slide out
              }
            }}
            className={clsx({ open })}
          >
            <InfoIcon />
          </InfoButton>
        </TooltipWrapper>
        {open && popUpContext.propertyInfo && canViewProperty && (
          <TooltipWrapper
            toolTipId="associated-items-id"
            toolTip={isBuilding ? 'Associated Land' : 'Associated Buildings'}
          >
            <TabButton
              id="slideOutTab"
              variant="outline-secondary"
              className={clsx({ open })}
              onClick={() => {
                setGeneralInfoOpen(false);
              }}
            >
              {isBuilding ? <LandSvg className="svg" /> : <BuildingSvg className="svg" />}
            </TabButton>
          </TooltipWrapper>
        )}
        {open && <InfoMain className={clsx({ open })}>{renderContent()}</InfoMain>}
      </InfoContainer>
    </ControlPanel>
  );
};
export default InfoControl;
