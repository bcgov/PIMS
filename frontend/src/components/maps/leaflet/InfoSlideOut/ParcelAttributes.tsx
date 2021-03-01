import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IBuilding, IEvaluation, IParcel } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import './InfoSlideOut.scss';
import { formatMoney } from 'utils/numberFormatUtils';
import { compareDate, OuterRow } from './InfoContent';
import { ThreeColumnItem } from './ThreeColumnItem';

interface IParcelAttributes {
  /** the selected parcel information */
  parcelInfo: IParcel;
  /** whether the user has the correct agency/permissions to view all the details */
  canViewDetails: boolean;
}

/**
 * Displays parcel specific information needed on the information slide out
 * @param parcelInfo the selected parcel data
 * @param canViewDetails user can view all property details
 */
export const ParcelAttributes: React.FC<IParcelAttributes> = ({ parcelInfo, canViewDetails }) => {
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

  let improvements = 0;
  if (parcelInfo?.assessedBuilding) {
    improvements = parcelInfo?.assessedBuilding;
  } else if (parcelInfo?.buildings?.length >= 1) {
    parcelInfo.buildings.forEach((building: IBuilding) => {
      if (building.evaluations?.length >= 1) {
        improvements += +building.evaluations
          .sort((a: IEvaluation, b: IEvaluation) => compareDate(a.date, b.date))
          .reverse()[0].value;
      }
    });
  }

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
      {canViewDetails && (
        <>
          {parcelInfo?.landLegalDescription && (
            <ListGroup>
              <Label className="header">Legal description</Label>
              <OuterRow>
                <ListGroup.Item className="legal">
                  {parcelInfo?.landLegalDescription}
                </ListGroup.Item>
              </OuterRow>
            </ListGroup>
          )}
          <ListGroup>
            <Label className="header">Valuation</Label>
            <OuterRow>
              <ThreeColumnItem leftSideLabel={'Assessed Land:'} rightSideItem={formatAssessed} />
              {!!improvements && (
                <ThreeColumnItem
                  leftSideLabel={'Assessed Building(s):'}
                  rightSideItem={formatMoney(improvements)}
                />
              )}
            </OuterRow>
          </ListGroup>
        </>
      )}
    </>
  );
};

export default ParcelAttributes;
