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
import useCodeLookups from 'hooks/useLookupCodes';
import { useState } from 'react';
import { ProjectNumberLink } from './ProjectNumberLink';
import { BuildingSvg, LandSvg, SubdivisionSvg } from 'components/common/Icons';
import { Workflows } from 'constants/workflows';

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

const displayProjectStatus = (workflowCode: string) => {
  switch (workflowCode) {
    case Workflows.ERP:
      return 'Property is in Enhanced Referral Process';
    case Workflows.SPL:
      return 'Property is on the Surplus Properties List';
    case Workflows.ASSESS_EX_DISPOSAL:
      return 'Property has been approved for ERP exemption';
    case Workflows.ASSESS_EXEMPTION:
      return 'Property has been submitted to be exempt from ERP';
    case Workflows.SUBMIT_DISPOSAL:
      return 'Property is in a draft project';
    default:
      return 'Project is in Surplus Property Program';
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

  const lookupCodes = useCodeLookups();
  const [privateProject, setPrivateProject] = useState<boolean>(false);

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
                    rightSideItem={lookupCodes.getAgencyFullName(propertyInfo?.agency)}
                  />
                  <ThreeColumnItem
                    leftSideLabel={'Owning agency'}
                    rightSideItem={lookupCodes.getAgencyFullName(propertyInfo.subAgency)}
                  />
                </>
              ) : (
                <ThreeColumnItem
                  leftSideLabel={'Owning ministry'}
                  rightSideItem={lookupCodes.getAgencyFullName(propertyInfo?.agency)}
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
            <em>{displayProjectStatus(propertyInfo?.projectWorkflow)}</em>
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
