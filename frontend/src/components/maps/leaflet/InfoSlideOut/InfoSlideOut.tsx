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
import Claims from 'constants/claims';

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
  background-color: #1a5a96;
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
  color: #1a5a96;
  border-color: #1a5a96;
  box-shadow: -2px 1px 4px rgba(0, 0, 0, 0.2);
  &.open {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    top: 0px;
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
  /** set the slide out as open or closed */
  setOpen: () => void;
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
      MAX_ZOOM,
    );
  const zoomToView = () =>
    leaflet.map?.flyTo(
      [propertyInfo?.latitude as number, propertyInfo?.longitude as number],
      MAX_ZOOM,
    );

  useEffect(() => {
    const elem = L.DomUtil.get('infoContainer');
    if (elem) {
      L.DomEvent.on(elem!, 'mousewheel', L.DomEvent.stopPropagation);
    }
  });
  const addAssociatedBuildingLink = (
    <>
      <FaPlusSquare color="#1a5a96" className="mr-1" />
      <Link
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
        Add a Building
      </Link>
    </>
  );

  const keycloak = useKeycloakWrapper();
  const canViewProperty =
    (keycloak.hasAgency(propertyInfo?.agencyId as number) &&
      keycloak.hasClaim(Claims.PROPERTY_VIEW)) ||
    keycloak.hasClaim(Claims.ADMIN_PROPERTIES);
  const canEditProperty =
    (keycloak.hasAgency(propertyInfo?.agencyId as number) &&
      keycloak.hasClaim(Claims.PROPERTY_EDIT)) ||
    keycloak.hasClaim(Claims.ADMIN_PROPERTIES);
  return (
    <Control position="topright">
      <InfoContainer id="infoContainer" className={clsx({ closed: !open })}>
        {open && (
          <InfoHeader>
            <Title>Property Info</Title>
          </InfoHeader>
        )}
        <TooltipWrapper toolTipId="info-slideout-id" toolTip="Property Information">
          <InfoButton
            id="slideOutInfoButton"
            variant="outline-secondary"
            onClick={setOpen}
            className={clsx({ open })}
          >
            <InfoIcon />
          </InfoButton>
        </TooltipWrapper>
        <InfoMain className={clsx({ open })}>
          {popUpContext.propertyInfo ? (
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
                addAssociatedBuildingLink={addAssociatedBuildingLink}
                canViewDetails={canViewProperty}
                canEditDetails={canEditProperty}
              />
            </>
          ) : (
            <p>Click a pin to view the property details</p>
          )}
        </InfoMain>
      </InfoContainer>
    </Control>
  );
};
export default InfoControl;
