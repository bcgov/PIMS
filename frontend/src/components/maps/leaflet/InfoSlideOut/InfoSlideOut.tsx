import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FaInfo, FaPlusSquare } from 'react-icons/fa';
import Control from 'react-leaflet-control';
import styled from 'styled-components';
import clsx from 'classnames';
import * as L from 'leaflet';
import { useEffect } from 'react';
import HeaderActions from './HeaderActions';
import { InfoContent } from './InfoContent';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { PropertyPopUpContext } from 'components/maps/providers/PropertyPopUpProvider';
import { useLeaflet } from 'react-leaflet';
import { MAX_ZOOM } from 'constants/strings';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { IParcel } from 'actions/parcelsActions';
import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { AssociatedBuildingsList } from './AssociatedBuildingsList';
import variables from '_variables.module.scss';
import { PropertyTypes } from 'constants/propertyTypes';

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

const BuildingsButton = styled(Button)`
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
  const leaflet = useLeaflet();
  const propertyInfo = popUpContext.propertyInfo;
  const location = useLocation();
  const jumpToView = () =>
    leaflet.map?.setView(
      [propertyInfo?.latitude as number, propertyInfo?.longitude as number],
      Math.max(MAX_ZOOM, leaflet.map.getZoom()),
    );
  const zoomToView = () =>
    leaflet.map?.flyTo(
      [propertyInfo?.latitude as number, propertyInfo?.longitude as number],
      Math.max(MAX_ZOOM, leaflet.map.getZoom()),
    );

  useEffect(() => {
    const elem = L.DomUtil.get('infoContainer');
    if (elem) {
      L.DomEvent.on(elem!, 'mousewheel', L.DomEvent.stopPropagation);
    }
  });

  //whether the associated buildings info is open
  const [asscBuildingsOpen, setAsscBuildingsOpen] = React.useState<boolean>(false);
  //whether the general info is open
  const [generalInfoOpen, setGeneralInfoOpen] = React.useState<boolean>(true);

  const addAssociatedBuildingLink = (
    <>
      <FaPlusSquare color="#1a5a96" className="mr-1" />
      <Link
        style={{ color: variables.slideOutBlue }}
        to={{
          pathname: `/mapview`,
          search: queryString.stringify({
            ...queryString.parse(location.search),
            sidebar: true,
            disabled: true,
            loadDraft: false,
            buildingId: 0,
            associatedParcelId: propertyInfo?.id,
            parcelId: undefined,
          }),
        }}
      >
        Add a new Building
      </Link>
    </>
  );

  const keycloak = useKeycloakWrapper();
  const canViewProperty = keycloak.canUserViewProperty(propertyInfo);
  const canEditProperty = keycloak.canUserEditProperty(propertyInfo);

  const renderContent = () => {
    if (popUpContext.propertyInfo) {
      if (generalInfoOpen || popUpContext.propertyTypeID === PropertyTypes.BUILDING) {
        return (
          <>
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
      } else if (
        asscBuildingsOpen &&
        canViewProperty &&
        popUpContext.propertyTypeID === PropertyTypes.PARCEL
      ) {
        return (
          <AssociatedBuildingsList
            propertyInfo={popUpContext.propertyInfo as IParcel}
            addAssociatedBuildingLink={addAssociatedBuildingLink}
            canEditDetails={canEditProperty}
          />
        );
      }
    } else {
      return <p>Click a pin to view the property details</p>;
    }
  };

  return (
    <Control position="topright">
      <InfoContainer id="infoContainer" className={clsx({ closed: !open })}>
        {open && (
          <InfoHeader>
            {popUpContext.propertyTypeID === PropertyTypes.BUILDING ? (
              <Title>Building Info</Title>
            ) : (
              <Title>Property Info</Title>
            )}
          </InfoHeader>
        )}
        <TooltipWrapper toolTipId="info-slideout-id" toolTip="Property Information">
          <InfoButton
            id="slideOutInfoButton"
            variant="outline-secondary"
            onClick={() => {
              if (!open) {
                setOpen(true);
                setGeneralInfoOpen(true);
                setAsscBuildingsOpen(false);
              } else if (open && !generalInfoOpen) {
                setGeneralInfoOpen(true);
                setAsscBuildingsOpen(false);
              } else {
                setOpen(false); //close the slide out
              }
            }}
            className={clsx({ open })}
          >
            <InfoIcon />
          </InfoButton>
        </TooltipWrapper>
        {open &&
          popUpContext.propertyInfo &&
          canViewProperty &&
          popUpContext.propertyTypeID === PropertyTypes.PARCEL && (
            <TooltipWrapper toolTipId="associated-buildings-id" toolTip="Associated Buildings">
              <BuildingsButton
                id="slideOutBuildings"
                variant="outline-secondary"
                className={clsx({ open })}
                onClick={() => {
                  setAsscBuildingsOpen(true);
                  setGeneralInfoOpen(false);
                }}
              >
                <BuildingSvg className="svg" />
              </BuildingsButton>
            </TooltipWrapper>
          )}
        <InfoMain className={clsx({ open })}>{renderContent()}</InfoMain>
      </InfoContainer>
    </Control>
  );
};
export default InfoControl;
