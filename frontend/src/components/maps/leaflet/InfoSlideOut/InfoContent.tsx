import * as React from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import { ParcelPIDPIN } from './ParcelPIDPIN';
import ParcelAttributes from './ParcelAttributes';
import './InfoSlideOut.scss';
import BuildingAttributes from './BuildingAttributes';
import styled from 'styled-components';
import { ThreeColumnItem } from './ThreeColumnItem';
import variables from '_variables.module.scss';
import { PropertyTypes } from 'constants/propertyTypes';

/**
 * Compare two dates to evaluation which is earlier.
 * This should handle 'undefined' values by treating them as earlier.
 * @param a First date to compare.
 * @param b Second date to compare.
 * @returns A negative number indicating ealier, 0 as equal, positive number as later.
 */
export const compareDate = (a: Date | string | undefined, b: Date | string | undefined): number => {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined && b !== undefined) return -1;
  if (a !== undefined && b === undefined) return 1;
  const aDate = typeof a === 'string' ? new Date(a) : (a as Date);
  const bDate = typeof b === 'string' ? new Date(b) : (b as Date);
  return aDate.valueOf() - bDate.valueOf();
};

interface IInfoContent {
  /** the selected property information */
  propertyInfo: IParcel | IBuilding | null;
  /** The property type [Parcel, Building] */
  propertyTypeId: PropertyTypes | null;
  /** whether the user has the correct agency/permissions to view all the details */
  canViewDetails: boolean;
}

export const OuterRow = styled(Row)`
  margin: 0px 0px 10px 0px;
`;

const ContactSres = styled(Row)`
  background-color: #deefff;
  padding: 5px 15px;
  margin: 0px 1px 5px 1px;

  em {
    color: ${variables.darkVariantColor};
  }

  a {
    color: ${variables.slideOutBlue};
  }
`;

const getHeading = (propertyTypeId: PropertyTypes | null) => {
  switch (propertyTypeId) {
    case PropertyTypes.SUBDIVISION:
      return 'Potential Subdivision';
    case PropertyTypes.BUILDING:
      return 'Building Identification';
    default:
      return 'Parcel Identification';
  }
};

/**
 * Component that displays the appropriate information about the selected property
 * in the property info slideout
 * @param {IInfoContent} propertyInfo the selected property
 * @param {IInfoContent} propertyTypeId the property type [Parcel, Building]
 * @param canViewDetails user can view all property details
 */
export const InfoContent: React.FC<IInfoContent> = ({
  propertyInfo,
  propertyTypeId,
  canViewDetails,
}) => {
  return (
    <>
      <ListGroup>
        <Label className="header">{getHeading(propertyTypeId)}</Label>
        {propertyTypeId === PropertyTypes.PARCEL && (
          <ParcelPIDPIN parcelInfo={propertyInfo as IParcel} />
        )}
        <OuterRow>
          {canViewDetails && (
            <>
              {propertyInfo?.name && (
                <ThreeColumnItem leftSideLabel={'Name'} rightSideItem={propertyInfo?.name} />
              )}
              {propertyInfo?.subAgency ? (
                <>
                  <ThreeColumnItem
                    leftSideLabel={'Ministry'}
                    rightSideItem={propertyInfo?.agency}
                  />
                  <ThreeColumnItem
                    leftSideLabel={'Owning agency'}
                    rightSideItem={propertyInfo.subAgency}
                  />
                </>
              ) : (
                <ThreeColumnItem
                  leftSideLabel={'Owning ministry'}
                  rightSideItem={propertyInfo?.agency}
                />
              )}
            </>
          )}
          <ThreeColumnItem
            leftSideLabel={'Classification'}
            rightSideItem={propertyInfo?.classification}
          />
        </OuterRow>
        {!canViewDetails && (
          <ContactSres>
            <em>
              For more information on this property, contact{' '}
              <a href="mailto:RealPropertyDivision.Disposals@gov.bc.ca">
                Strategic Real Estate Services (SRES)
              </a>
            </em>
          </ContactSres>
        )}
      </ListGroup>
      <ListGroup>
        <Label className="header">Location data</Label>
        <OuterRow>
          <ThreeColumnItem
            leftSideLabel={'Civic address'}
            rightSideItem={propertyInfo?.address?.line1}
          />
          <ThreeColumnItem
            leftSideLabel={'Location'}
            rightSideItem={propertyInfo?.address?.administrativeArea}
          />
        </OuterRow>
        <OuterRow>
          <ThreeColumnItem leftSideLabel={'Latitude'} rightSideItem={propertyInfo?.latitude} />
          <ThreeColumnItem leftSideLabel={'Longitude'} rightSideItem={propertyInfo?.longitude} />
        </OuterRow>
      </ListGroup>
      {propertyTypeId === PropertyTypes.PARCEL && (
        <ParcelAttributes parcelInfo={propertyInfo as IParcel} canViewDetails={canViewDetails} />
      )}
      {propertyTypeId === PropertyTypes.BUILDING && (
        <BuildingAttributes
          buildingInfo={propertyInfo as IBuilding}
          canViewDetails={canViewDetails}
        />
      )}
    </>
  );
};

export default InfoContent;
