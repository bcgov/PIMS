import { IProperty } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CellProps, Renderer } from 'react-table';

/**
 * A cell that provides a clickable link to view a given IProperty
 * @param {CellProps<IProperty, number>} props
 */
const ViewPropertyCell: Renderer<CellProps<IProperty, number>> = (props) => {
  const location = useLocation();
  const property = props.row.original;

  const queryParams = new URLSearchParams(location.search);
  queryParams.set('sidebar', 'true');
  queryParams.set('disabled', 'true');
  queryParams.set('loadDraft', 'false');
  queryParams.set(
    'buildingId',
    `${property.propertyTypeId === PropertyTypes.BUILDING ? property.id : undefined}`,
  );
  queryParams.set(
    'parcelId',
    `${
      [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(
        property.propertyTypeId ?? PropertyTypes.PARCEL,
      )
        ? property.id
        : undefined
    }`,
  );

  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      to={{
        pathname: `/mapview`,
        search: queryParams.toString(),
      }}
    >
      View
    </Link>
  );
};

export default ViewPropertyCell;
