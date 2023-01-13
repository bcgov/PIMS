import { IProperty } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';
import queryString from 'query-string';
import React from 'react';
import { Link } from 'react-router-dom';
import { CellProps, Renderer } from 'react-table';

/**
 * A cell that provides a clickable link to view a given IProperty
 * @param {CellProps<IProperty, number>} props
 */
const ViewPropertyCell: Renderer<CellProps<IProperty, number>> = props => {
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
