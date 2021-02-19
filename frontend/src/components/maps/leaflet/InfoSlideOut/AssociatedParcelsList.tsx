import { IBuilding } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';

interface IAssociatedParcels {
  /** the selected property information */
  propertyInfo: IBuilding | null;
}

/**
 * Component that displays the associated parcels of a building
 * as a clickable list
 * @param propertyInfo the selected building
 */
export const AssociatedParcelsList: React.FC<IAssociatedParcels> = ({ propertyInfo }) => {
  const location = useLocation();
  return (
    <>
      <ListGroup>
        <Label className="header" style={{ margin: '5px 0px' }}>
          Associated Land
        </Label>
        <ListGroup.Item>Click a parcel's PID/PIN to view its details</ListGroup.Item>
        {propertyInfo?.parcels?.map((parcel, parcelId) => (
          <ListGroup.Item key={parcelId}>
            <Link
              className="styled-link"
              to={{
                pathname: `/mapview`,
                search: queryString.stringify({
                  ...queryString.parse(location.search),
                  sidebar: true,
                  disabled: true,
                  loadDraft: false,
                  parcelId: parcel.id,
                }),
              }}
            >
              {parcel.pid ? parcel.pid : parcel.pin}
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default AssociatedParcelsList;
