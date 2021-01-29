import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import './InfoSlideOut.scss';
import { formatMoney } from 'utils/numberFormatUtils';
import { ReactElement } from 'react';

interface IParcelAttributes {
  /** the selected parcel information */
  parcelInfo: IParcel;
  addAssociatedBuildingLink: ReactElement;
}

/**
 * Displays parcel specific information needed on the information slide out
 * @param parcelInfo the selected parcel data
 */
export const ParcelAttributes: React.FC<IParcelAttributes> = ({
  parcelInfo,
  addAssociatedBuildingLink,
}) => {
  let formatAssessed;
  if (parcelInfo?.assessed) {
    formatAssessed = formatMoney(parcelInfo?.assessed);
  } else if (parcelInfo?.evaluations?.length >= 1) {
    formatAssessed = formatMoney(parcelInfo?.evaluations[0].value);
  } else {
    formatAssessed = '$0';
  }

  const newLength = parcelInfo.buildings?.length > 3 ? 3 : parcelInfo.buildings?.length;
  const buildingsCopy = parcelInfo.buildings?.slice(0, newLength);

  return (
    <>
      <ListGroup>
        <Label className="header">Parcel attributes</Label>
        <ListGroup.Item>
          <Label>Lot size:</Label>
          {parcelInfo?.landArea + ' hectares'}
        </ListGroup.Item>
      </ListGroup>
      <ListGroup>
        <Label className="header">Legal description</Label>
        <ListGroup.Item>{parcelInfo?.landLegalDescription}</ListGroup.Item>
      </ListGroup>
      <ListGroup>
        <Label className="header">Valuation</Label>
        <ListGroup.Item>
          <Label>Assessed value:</Label>
          {formatAssessed}
        </ListGroup.Item>
      </ListGroup>
      {parcelInfo?.buildings && (
        <ListGroup>
          <Label className="header">Associated Buildings</Label>
          {buildingsCopy.map((building, buildingId) => (
            <ListGroup.Item key={buildingId}>
              <Label>{building.name}</Label>
            </ListGroup.Item>
          ))}
          {parcelInfo.buildings.length > 3 && (
            <ListGroup.Item>
              <Label>+ {parcelInfo.buildings.length - 3} more</Label>
            </ListGroup.Item>
          )}
        </ListGroup>
      )}
      <ListGroup>
        <ListGroup.Item>{addAssociatedBuildingLink}</ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default ParcelAttributes;
