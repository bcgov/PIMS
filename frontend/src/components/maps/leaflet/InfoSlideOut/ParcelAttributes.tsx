import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IParcel } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import './InfoSlideOut.scss';
import { formatMoney } from 'utils/numberFormatUtils';
import { OuterRow } from './InfoContent';
import { ThreeColumnItem } from './ThreeColumnItem';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { getCurrentYearEvaluation } from 'features/projects/common/projectConverter';

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
  } else if (!!getCurrentYearEvaluation(parcelInfo?.evaluations, EvaluationKeys.Assessed)) {
    formatAssessed = formatMoney(
      getCurrentYearEvaluation(parcelInfo?.evaluations, EvaluationKeys.Assessed)?.value,
    );
  } else {
    formatAssessed = '';
  }
  let improvements = '';
  if (parcelInfo?.assessedBuilding) {
    improvements = formatMoney(parcelInfo?.assessedBuilding);
  } else if (!!getCurrentYearEvaluation(parcelInfo?.evaluations, EvaluationKeys.Improvements)) {
    improvements = formatMoney(
      getCurrentYearEvaluation(parcelInfo?.evaluations, EvaluationKeys.Improvements)?.value,
    );
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
                  rightSideItem={improvements}
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
