import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';

interface IParcelPIDPIN {
  /** the selected parcel information */
  parcelInfo: IParcel;
}

/**
 * Displays PID/PIN information in property popout for selected parcel
 * @param parcelInfo parcel data
 */
export const ParcelPIDPIN: React.FC<IParcelPIDPIN> = ({ parcelInfo }) => {
  return (
    <ListGroup>
      {parcelInfo?.pid && (
        <ListGroup.Item>
          <Label>PID:</Label>
          {parcelInfo?.pid}
        </ListGroup.Item>
      )}
      {parcelInfo?.pin && (
        <ListGroup.Item>
          <Label>PIN:</Label>
          {parcelInfo?.pin}
        </ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default ParcelPIDPIN;
