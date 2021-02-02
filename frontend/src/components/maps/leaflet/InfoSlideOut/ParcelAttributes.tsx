import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import './InfoSlideOut.scss';
import { formatMoney } from 'utils/numberFormatUtils';
import { ReactElement } from 'react';
import { compareDate, OuterRow } from './InfoContent';
import { ThreeColumnItem } from './ThreeColumnItem';

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
  if (parcelInfo?.assessedLand) {
    formatAssessed = formatMoney(parcelInfo?.assessedLand);
  } else if (parcelInfo?.evaluations?.length >= 1) {
    formatAssessed = formatMoney(
      parcelInfo?.evaluations.sort((a, b) => compareDate(a.date, b.date)).reverse()[0].value,
    );
  } else {
    formatAssessed = '';
  }

  const newLength = parcelInfo.buildings?.length > 3 ? 3 : parcelInfo.buildings?.length;
  const buildingsCopy = parcelInfo.buildings?.slice(0, newLength);

  return (
    <>
      <ListGroup>
        <Label className="header">Parcel attributes</Label>
        <OuterRow>
          <ThreeColumnItem
            leftSideLabel={'Lot size:'}
            rightSideItem={parcelInfo?.landArea + ' hectares'}
          />
        </OuterRow>
      </ListGroup>
      {parcelInfo?.landLegalDescription && (
        <ListGroup>
          <Label className="header">Legal description</Label>
          <OuterRow>
            <ListGroup.Item className="legal">{parcelInfo?.landLegalDescription}</ListGroup.Item>
          </OuterRow>
        </ListGroup>
      )}
      <ListGroup>
        <Label className="header">Valuation</Label>
        <OuterRow>
          <ThreeColumnItem leftSideLabel={'Assessed value:'} rightSideItem={formatAssessed} />
        </OuterRow>
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
