import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IBuilding, IParcel, PropertyTypes } from 'actions/parcelsActions';
import { Label } from 'components/common/Label';
import { ParcelPIDPIN } from './ParcelPIDPIN';
import ParcelAttributes from './ParcelAttributes';
import './InfoSlideOut.scss';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';
import BuildingAttributes from './BuildingAttributes';
import { ReactElement } from 'react';

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
  /** ReactElement used to display a link for adding an associated building */
  addAssociatedBuildingLink: ReactElement;
}

/**
 * Component that displays the appropriate information about the selected property
 * in the property info slideout
 * @param {IInfoContent} propertyInfo the selected property
 * @param {IInfoContent} propertyTypeId the property type [Parcel, Building]
 */
export const InfoContent: React.FC<IInfoContent> = ({
  propertyInfo,
  propertyTypeId,
  addAssociatedBuildingLink,
}) => {
  const keycloak = useKeycloakWrapper();
  return (
    <>
      <ListGroup>
        {propertyTypeId === PropertyTypes.PARCEL ? (
          <Label className="header">Parcel Identification</Label>
        ) : (
          <Label className="header">Building Identification</Label>
        )}
        {propertyTypeId === PropertyTypes.PARCEL && (
          <ParcelPIDPIN parcelInfo={propertyInfo as IParcel} />
        )}
        {(keycloak.hasAgency(propertyInfo?.agencyId as number) ||
          keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) && (
          <>
            {propertyInfo?.name && (
              <ListGroup.Item>
                <Label>Name:</Label>
                {propertyInfo?.name}
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <Label>Owning Agency:</Label>
              {propertyInfo?.agency}
            </ListGroup.Item>
            {propertyInfo?.subAgency && (
              <ListGroup.Item>
                <Label>Sub-agency:</Label>
                {propertyInfo.subAgency}
              </ListGroup.Item>
            )}
          </>
        )}
        <ListGroup.Item>
          <Label>Classification:</Label>
          {propertyInfo?.classification}
        </ListGroup.Item>
      </ListGroup>
      <ListGroup>
        <Label className="header">Location data</Label>
        <ListGroup.Item>
          <Label>Civic Address:</Label>
          {propertyInfo?.address?.line1}
        </ListGroup.Item>
        <ListGroup.Item>
          <Label>Location:</Label>
          {propertyInfo?.address?.administrativeArea}
        </ListGroup.Item>
        <ListGroup.Item>
          <Label>Latitude:</Label>
          {propertyInfo?.latitude}
        </ListGroup.Item>
        <ListGroup.Item>
          <Label>Longitude:</Label>
          {propertyInfo?.longitude}
        </ListGroup.Item>
      </ListGroup>
      {(keycloak.hasAgency(propertyInfo?.agencyId as number) ||
        keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) && (
        <>
          {propertyTypeId === PropertyTypes.PARCEL && (
            <ParcelAttributes
              addAssociatedBuildingLink={addAssociatedBuildingLink}
              parcelInfo={propertyInfo as IParcel}
            />
          )}
          {propertyTypeId === PropertyTypes.BUILDING && (
            <BuildingAttributes buildingInfo={propertyInfo as IBuilding} />
          )}
        </>
      )}
    </>
  );
};

export default InfoContent;
