import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IBuilding } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import './InfoSlideOut.scss';
import { formatMoney } from 'utils/numberFormatUtils';
import { compareDate } from './InfoContent';

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
  if (buildingInfo?.assessedBuilding) {
    formatAssessed = formatMoney(buildingInfo?.assessedBuilding);
  } else if (buildingInfo?.evaluations?.length >= 1) {
    formatAssessed = formatMoney(
      buildingInfo?.evaluations.sort((a, b) => compareDate(a.date, b.date)).reverse()[0].value,
    );
  } else {
    formatAssessed = '';
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
