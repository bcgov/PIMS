import React from 'react';
import { CellProps } from 'react-table';
import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { ReactComponent as LandSvg } from 'assets/images/icon-lot.svg';
import { ReactComponent as SubdivisionSvg } from 'assets/images/project-diagram-solid.svg';

import { IProperty } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';

/**
 * Display an icon based on the property type.
 * @param {CellProps<IProperty, number>} param0
 */
export const PropertyTypeCell = ({ cell: { value } }: CellProps<IProperty, number>) => {
  switch (value) {
    case PropertyTypes.SUBDIVISION:
      return <SubdivisionSvg className="svg" />;

    case PropertyTypes.BUILDING:
      return <BuildingSvg className="svg" />;
    default:
      return <LandSvg className="svg" />;
  }
};
