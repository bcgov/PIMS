import { IParcel } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import * as React from 'react';
import { ReactElement } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';

interface IAssociatedBuildings {
  /** the selected property information */
  propertyInfo: IParcel | null;
  /** link that opens the sidebar to create a new building associated to the parcel */
  addAssociatedBuildingLink: ReactElement;
  /** whether the user has the correct agency/permissions to edit property details */
  canEditDetails: boolean;
}

/**
 * Component that displays the associated buildings of a parcel
 * as a clickable list
 * @param propertyInfo the selected parcel
 * @param addAssociatedBuildingLink link to create a new associated building
 * @param canEditDetails whether the user can edit the parcel details
 */
export const AssociatedBuildingsList: React.FC<IAssociatedBuildings> = ({
  propertyInfo,
  addAssociatedBuildingLink,
  canEditDetails,
}) => {
  const location = useLocation();
  return (
    <>
      <ListGroup>
        <Label className="header" style={{ margin: '5px 0px' }}>
          Associated Buildings
        </Label>
        <ListGroup.Item>Click a building name to view its details</ListGroup.Item>
        {propertyInfo?.buildings?.length ? (
          propertyInfo?.buildings?.map((building, buildingId) => (
            <ListGroup.Item key={buildingId}>
              <Link
                className="styled-link"
                to={{
                  pathname: `/mapview`,
                  search: queryString.stringify({
                    ...queryString.parse(location.search),
                    sidebar: true,
                    disabled: true,
                    loadDraft: false,
                    buildingId: building.id,
                  }),
                }}
              >
                {building.name}
              </Link>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>This parcel has no associated buildings</ListGroup.Item>
        )}
      </ListGroup>
      {canEditDetails && (
        <ListGroup>
          <ListGroup.Item>{addAssociatedBuildingLink}</ListGroup.Item>
        </ListGroup>
      )}
    </>
  );
};

export default AssociatedBuildingsList;
