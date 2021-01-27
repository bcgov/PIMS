import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IBuilding } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import './InfoSlideOut.scss';
import { formatMoney } from 'utils/numberFormatUtils';

interface IBuildingAttributes {
  /** the selected building information */
  buildingInfo: IBuilding;
}

/**
 * Displays Building specific information needed on the information slide out
 * @param buildingInfo the selected parcel data
 */
export const BuildingAttributes: React.FC<IBuildingAttributes> = ({ buildingInfo }) => {
  let formatAssessed;
  if (buildingInfo?.assessed) {
    formatAssessed = formatMoney(buildingInfo?.assessed);
  } else if (buildingInfo?.evaluations[0].value) {
    formatAssessed = formatMoney(buildingInfo?.evaluations[0].value);
  } else {
    formatAssessed = '$0';
  }

  return (
    <>
      <ListGroup>
        <Label className="header">Valuation</Label>
        <ListGroup.Item>
          <Label>Assessed value:</Label>
          {formatAssessed}
        </ListGroup.Item>
      </ListGroup>
      {buildingInfo?.pid && (
        <ListGroup>
          <Label className="header">Associated Land</Label>
          <ListGroup.Item>
            <Label>{buildingInfo.pid}</Label>
          </ListGroup.Item>
        </ListGroup>
      )}
    </>
  );
};

export default BuildingAttributes;
