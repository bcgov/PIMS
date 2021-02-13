import styled from 'styled-components';
import * as React from 'react';
import { Row } from 'react-bootstrap';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import variables from '_variables.module.scss';
import { PropertyTypes } from 'constants/propertyTypes';

const LinkMenu = styled(Row)`
  background-color: ${variables.filterBackgroundColor};
  height: 35px;
  width: 322px;
  margin: 0px 0px 5px -10px;
  font-size: 14px;
  padding: 10px;
  a {
    padding: 0px 10px;
    color: ${variables.slideOutBlue};
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
  jumpToView: () => void;
  zoomToView: () => void;
  /** additional action to be taken when a link in the menu is clicked */
  onLinkClick?: () => void;
  /** whether the user has the correct agency/permissions to view all the details */
  canViewDetails: boolean;
  /** whether the user has the correct agency/permissions to edit property details */
  canEditDetails: boolean;
}

/**
 * Actions that can be done on the property info slide out
 * @param propertyInfo the selected property information
 * @param propertyTypeId the selected property type
 * @param onLinkClick additional action on menu item click
 * @param canViewDetails user can view all property details
 * @param canEditDetails user can edit property details
 */
const HeaderActions: React.FC<IHeaderActions> = ({
  propertyInfo,
  propertyTypeId,
  onLinkClick,
  jumpToView,
  zoomToView,
  canViewDetails,
  canEditDetails,
}) => {
  const location = useLocation();

  const buildingId = propertyTypeId === PropertyTypes.BUILDING ? propertyInfo?.id : undefined;
  const parcelId = [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(
    propertyTypeId as PropertyTypes,
  )
    ? propertyInfo?.id
    : undefined;
  return (
    <LinkMenu>
      Actions:
      {canViewDetails && (
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

          {canEditDetails && (
            <>
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
            </>
          )}
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
