import styled from 'styled-components';
import * as React from 'react';
import { Row } from 'react-bootstrap';
import { IBuilding, IParcel, PropertyTypes } from 'actions/parcelsActions';
import { useLeaflet } from 'react-leaflet';
import { MAX_ZOOM } from 'constants/strings';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';

const LinkMenu = styled(Row)`
  background-color: #f2f2f2;
  height: 35px;
  width: 322px;
  margin-left: -10px;
  font-size: 14px;
  padding: 10px;
  a {
    padding: 0px 10px;
    color: #1a5a96;
  }
`;

const VerticalBar = styled.div`
  border-left: 2px solid rgba(96, 96, 96, 0.2);
  height: 18px;
`;

interface IHeaderActions {
  /** The selected property */
  propertyInfo: IParcel | IBuilding | null;
  /** the selected property type */
  propertyTypeId: PropertyTypes | null;
  /** additional action to be taken when a link in the menu is clicked */
  onLinkClick?: () => void;
}

/**
 * Actions that can be done on the property info slide out
 * @param propertyInfo the selected property information
 * @param propertyTypeId the selected property type
 * @param onLinkClick additional action on menu item click
 */
const HeaderActions: React.FC<IHeaderActions> = ({ propertyInfo, propertyTypeId, onLinkClick }) => {
  const leaflet = useLeaflet();
  const location = useLocation();
  const keycloak = useKeycloakWrapper();
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

  const buildingId = propertyTypeId === PropertyTypes.BUILDING ? propertyInfo?.id : undefined;
  const parcelId = propertyTypeId === PropertyTypes.PARCEL ? propertyInfo?.id : undefined;
  return (
    <LinkMenu>
      Actions:
      {(keycloak.hasAgency(propertyInfo?.agencyId as number) ||
        keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) && (
        <>
          <Link
            onClick={() => {
              jumpToView();
              if (onLinkClick) onLinkClick();
            }}
            to={{
              pathname: `/mapview`,
              search: queryString.stringify({
                ...queryString.parse(location.search),
                sidebar: true,
                disabled: true,
                loadDraft: false,
                buildingId: buildingId,
                parcelId: parcelId,
              }),
            }}
          >
            View details
          </Link>
          <VerticalBar />
          <Link
            onClick={() => {
              jumpToView();
              if (onLinkClick) onLinkClick();
            }}
            to={{
              pathname: `/mapview`,
              search: queryString.stringify({
                ...queryString.parse(location.search),
                disabled: false,
                sidebar: true,
                loadDraft: false,
                buildingId: buildingId,
                parcelId: parcelId,
              }),
            }}
          >
            Update
          </Link>
          <VerticalBar />
        </>
      )}
      <Link to={{ ...location }} onClick={zoomToView}>
        Zoom map
      </Link>
    </LinkMenu>
  );
};

export default HeaderActions;
