import { BuildingSvg, LandSvg } from 'components/common/Icons';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ColumnWithProps, MoneyCell } from 'components/Table';
import { PropertyTypeName } from 'hooks/api';
import { IProjectPropertyModel } from 'hooks/api/projects/disposals';
import React from 'react';
import { CellProps, Renderer } from 'react-table';
import { formatAddress } from 'utils';

export const PropertyColumns = (): ColumnWithProps<IProjectPropertyModel>[] => {
  return [
    {
      Header: 'Agency',
      accessor: (row) => row.building?.agency ?? row.parcel?.agency,
      align: 'left',
      clickable: false,
      maxWidth: 50,
    },
    {
      Header: 'Name',
      accessor: (row) => row.building?.name ?? row.parcel?.name,
      align: 'left',
      clickable: false,
      Cell: (cell: any) => {
        return (
          <TooltipWrapper toolTipId="project-property" toolTip={cell.value}>
            <div>{cell.value}</div>
          </TooltipWrapper>
        );
      },
    },
    {
      Header: 'Civic Address',
      accessor: (row) => {
        const address = row.building?.address ?? row.parcel?.address;
        return address ? formatAddress(address) : '';
      },
      align: 'left',
      clickable: true,
      Cell: (cell: any) => {
        return (
          <TooltipWrapper toolTipId="project-property" toolTip={cell.value}>
            <div>{cell.value}</div>
          </TooltipWrapper>
        );
      },
    },
    {
      Header: 'Classification',
      accessor: (row) => row.building?.classification ?? row.parcel?.classification,
      align: 'left',
      clickable: false,
    },
    {
      Header: 'Other Projects',
      accessor: (row) => row.building?.projectNumbers ?? row.parcel?.projectNumbers,
      align: 'left',
      clickable: false,
    },
    {
      Header: 'Net Book Value',
      accessor: () => {
        return '';
      },
      align: 'right',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyModel, string | undefined>>,
    },
    {
      Header: 'Assessed Land',
      accessor: () => {
        return '';
      },
      align: 'right',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyModel, string | undefined>>,
    },
    {
      Header: 'Assessed Year',
      accessor: () => {
        return '';
      },
      clickable: false,
      maxWidth: 50,
    },
    {
      Header: 'Assessed Building',
      accessor: () => {
        return '';
      },
      align: 'right',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyModel, string | undefined>>,
    },
    {
      Header: 'Type',
      accessor: 'propertyType',
      clickable: false,
      maxWidth: 40,
      Cell: (cell) => {
        return cell.value === PropertyTypeName.Land ||
          cell.value === PropertyTypeName.Subdivision ? (
          <LandSvg className="svg" />
        ) : (
          <BuildingSvg className="svg" />
        );
      },
    },
  ];
};
