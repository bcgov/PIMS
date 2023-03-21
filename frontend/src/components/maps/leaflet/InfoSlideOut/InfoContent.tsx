import './InfoSlideOut.scss';

import variables from '_variables.module.scss';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import { BuildingSvg, LandSvg, SubdivisionSvg } from 'components/common/Icons';
import { Label } from 'components/common/Label';
import { PropertyTypes } from 'constants/propertyTypes';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ListGroup, Row } from 'react-bootstrap';
import styled from 'styled-components';

import BuildingAttributes from './BuildingAttributes';
import ParcelAttributes from './ParcelAttributes';
import { ParcelPIDPIN } from './ParcelPIDPIN';
import { ProjectNumberLink } from './ProjectNumberLink';
import { ThreeColumnItem } from './ThreeColumnItem';

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

const ProjectStatus = styled.div`
  background-color: #fff1cc;
  text-align: center;
  color: ${variables.textColor};
  font-family: 'BCSans', Fallback, sans-serif;
  padding: 5px;

  p {
    margin-bottom: 0;
  }
`;

const getHeading = (propertyTypeId: PropertyTypes | null) => {
  switch (propertyTypeId) {
    case PropertyTypes.SUBDIVISION:
      return (
        <Label className="header">
          <SubdivisionSvg className="svg" style={{ height: 25, width: 25, marginRight: 5 }} />
          Potential Subdivision
        </Label>
      );
    case PropertyTypes.BUILDING:
      return (
        <Label className="header">
          <BuildingSvg className="svg" style={{ height: 25, width: 25, marginRight: 5 }} />
          Building Identification
        </Label>
      );
    default:
      return (
        <Label className="header">
          <LandSvg className="svg" style={{ height: 25, width: 25, marginRight: 5 }} />
          Parcel Identification
        </Label>
      );
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
  const isParcel =
    propertyTypeId !== null &&
    [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(propertyTypeId);

  const [privateProject, setPrivateProject] = useState<boolean>(false);

  useEffect(() => {
    // Track <a/> tag clicks in Snowplow Analytics.
    window.snowplow('refreshLinkClickTracking');
  }, []);

  return (
    <>
      <ListGroup>
        {getHeading(propertyTypeId)}
        {isParcel && <ParcelPIDPIN parcelInfo={propertyInfo as IParcel} />}
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
                    rightSideItem={propertyInfo?.agencyFullName}
                  />
                  <ThreeColumnItem
                    leftSideLabel={'Owning agency'}
                    rightSideItem={propertyInfo.subAgencyFullName}
                  />
                </>
              ) : (
                <ThreeColumnItem
                  leftSideLabel={'Owning ministry'}
                  rightSideItem={propertyInfo?.agencyFullName}
                />
              )}
            </>
          )}
          <ThreeColumnItem
            leftSideLabel={'Classification'}
            rightSideItem={propertyInfo?.classification}
          />
          {!!propertyInfo?.projectNumbers?.length && (
            <ThreeColumnItem
              leftSideLabel={`Project Number${propertyInfo.projectNumbers.length > 1 ? 's' : ''}`}
              rightSideItem={propertyInfo.projectNumbers.map((projectNum: string) => (
                <ProjectNumberLink
                  key={projectNum}
                  setPrivateProject={setPrivateProject}
                  privateProject={privateProject}
                  agencyId={propertyInfo.agencyId}
                  projectNumber={projectNum}
                  breakLine
                />
              ))}
            />
          )}
        </OuterRow>
        {(!canViewDetails || privateProject) && (
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
      {propertyInfo?.projectWorkflow && (
        <ListGroup>
          <ProjectStatus>
            {canViewDetails && (
              <p>
                Status: <strong>{propertyInfo?.projectStatus}</strong>
              </p>
            )}
          </ProjectStatus>
        </ListGroup>
      )}
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
      {isParcel && (
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
