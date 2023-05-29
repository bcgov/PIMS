import { BuildingSvg, LandSvg } from 'components/common/Icons';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ColumnWithProps, MoneyCell } from 'components/Table';
import { useFormikContext } from 'formik';
import { PropertyType } from 'hooks/api';
import { Classification } from 'hooks/api';
import _ from 'lodash';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { CellProps, Renderer } from 'react-table';

import { IProjectForm, IProjectPropertyForm } from '../../interfaces';

export const PropertyColumns = (
  disabled: boolean = false,
): ColumnWithProps<IProjectPropertyForm>[] => {
  const { setFieldValue } = useFormikContext<IProjectForm>();

  return [
    {
      accessor: 'id',
      align: 'left',
      clickable: false,
      maxWidth: 30,
      Cell: (cell) => (
        <TooltipWrapper toolTipId="project-property" toolTip="Remove Property from Project">
          {!disabled ? (
            <FaTrash
              data-testid="trash-icon"
              className="remove"
              size={16}
              onClick={() => {
                const results = _.difference(_.map(cell.rows, 'original'), [cell.row.original]);
                setFieldValue('properties', results);
              }}
            />
          ) : (
            <></>
          )}
        </TooltipWrapper>
      ),
    },
    {
      Header: 'Agency',
      accessor: 'agencyCode',
      align: 'left',
      clickable: false,
      maxWidth: 50,
    },
    {
      Header: 'Name',
      accessor: 'name',
      align: 'left',
      clickable: false,
      Cell: (cell) => {
        return (
          <TooltipWrapper toolTipId="project-property" toolTip={cell.value}>
            <div>{cell.value}</div>
          </TooltipWrapper>
        );
      },
    },
    {
      Header: 'Civic Address',
      accessor: 'address',
      align: 'left',
      clickable: true,
      Cell: (cell) => {
        return (
          <TooltipWrapper toolTipId="project-property" toolTip={cell.value}>
            <div>{cell.value}</div>
          </TooltipWrapper>
        );
      },
    },
    {
      Header: 'Classification',
      accessor: (row) => Classification[row.classificationId],
      align: 'left',
      clickable: false,
    },
    {
      Header: 'Zoning Code',
      accessor: 'zoning',
      align: 'left',
      clickable: false,
    },
    {
      Header: 'Other Projects',
      accessor: 'projectNumbers',
      align: 'left',
      clickable: false,
    },
    {
      Header: 'Net Book Value',
      accessor: 'netBook',
      align: 'right',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyForm, number | ''>>,
    },
    {
      Header: 'Assessed Land',
      accessor: 'assessedLand',
      align: 'right',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyForm, number | ''>>,
    },
    {
      Header: 'Assessed Year',
      accessor: 'assessedLandYear',
      clickable: false,
      maxWidth: 50,
    },
    {
      Header: 'Assessed Building',
      accessor: 'assessedImprovements',
      align: 'right',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyForm, number | ''>>,
    },
    {
      Header: 'Type',
      accessor: 'propertyTypeId',
      clickable: false,
      maxWidth: 40,
      Cell: (cell) => {
        return cell.value === PropertyType.Parcel || cell.value === PropertyType.Subdivision ? (
          <LandSvg className="svg" />
        ) : (
          <BuildingSvg className="svg" />
        );
      },
    },
  ];
};
