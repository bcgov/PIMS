/// <reference types="vite-plugin-svgr/client" />

import { IProperty } from 'actions/parcelsActions';
import BuildingSvg from 'assets/images/icon-business.svg?react';
import LandSvg from 'assets/images/icon-lot.svg?react';
import SubdivisionSvg from 'assets/images/project-diagram-solid.svg?react';
import { PropertyTypes } from 'constants/propertyTypes';
import React from 'react';
import { CellProps, Renderer } from 'react-table';

/**
 * Display an icon based on the property type.
 * @param {CellProps<IProperty, number>} param0
 */
export const PropertyTypeCell: Renderer<CellProps<IProperty, number>> = ({ cell: { value } }) => {
  switch (value) {
    case PropertyTypes.SUBDIVISION:
      return <SubdivisionSvg className="svg" />;

    case PropertyTypes.BUILDING:
      return <BuildingSvg className="svg" />;
    default:
      return <LandSvg className="svg" />;
  }
};
