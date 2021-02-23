import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IBuilding } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import './InfoSlideOut.scss';
import { formatMoney } from 'utils/numberFormatUtils';
import { compareDate, OuterRow } from './InfoContent';
import { ThreeColumnItem } from './ThreeColumnItem';

interface IBuildingAttributes {
  /** the selected building information */
  buildingInfo: IBuilding;
  /** whether the user has the correct agency/permissions to view all the details */
  canViewDetails: boolean;
}

/**
 * Displays Building specific information needed on the information slide out
 * @param buildingInfo the selected parcel data
 * @param canViewDetails user can view all property details
 */
export const BuildingAttributes: React.FC<IBuildingAttributes> = ({
  buildingInfo,
  canViewDetails,
}) => {
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
        <Label className="header">Building Attributes</Label>
        <OuterRow>
          {canViewDetails && (
            <>
              <ThreeColumnItem
                leftSideLabel={'Predominate Use'}
                rightSideItem={buildingInfo.buildingPredominateUse}
              />
              {buildingInfo.description && (
                <ThreeColumnItem
                  leftSideLabel={'Description'}
                  rightSideItem={buildingInfo.description}
                />
              )}
            </>
          )}
          <ThreeColumnItem
            leftSideLabel={'Total area'}
            rightSideItem={buildingInfo.totalArea + ' sq. metres'}
          />
          <ThreeColumnItem
            leftSideLabel={'Net usable area'}
            rightSideItem={buildingInfo.rentableArea + ' sq. metres'}
          />
          {canViewDetails && (
            <ThreeColumnItem
              leftSideLabel={'Tenancy %'}
              rightSideItem={buildingInfo.buildingTenancy}
            />
          )}
        </OuterRow>
      </ListGroup>
      {canViewDetails && (
        <ListGroup>
          <Label className="header">Valuation</Label>
          <OuterRow>
            {buildingInfo.parcels?.length < 1 ? (
              <ThreeColumnItem leftSideLabel={'Assessed value:'} rightSideItem={formatAssessed} />
            ) : (
              <ListGroup.Item>
                <Label>Please see the associated parcel(s) for assessment information</Label>
              </ListGroup.Item>
            )}
          </OuterRow>
        </ListGroup>
      )}
    </>
  );
};

export default BuildingAttributes;
