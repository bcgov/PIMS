import React from 'react';
import { CellProps } from 'react-table';
import { IProperty } from 'actions/parcelsActions';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { PropertyTypes } from 'constants/propertyTypes';

/**
 * A cell that provides a clickable link to view a given IProperty
 * @param {CellProps<IProperty, number>} props
 */
const ViewPropertyCell = (props: CellProps<IProperty, number>) => {
  const property = props.row.original;
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      to={{
        pathname: `/mapview`,
        search: queryString.stringify({
          sidebar: true,
          disabled: true,
          loadDraft: false,
          parcelId: [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(
            property.propertyTypeId ?? PropertyTypes.PARCEL,
          )
            ? property.id
            : undefined,
          buildingId: property.propertyTypeId === PropertyTypes.BUILDING ? property.id : undefined,
        }),
      }}
    >
      View
    </Link>
  );
};

export default ViewPropertyCell;
