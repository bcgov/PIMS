import { BuildingSvg, LandSvg } from 'components/common/Icons';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ColumnWithProps, MoneyCell } from 'components/Table';
import { PropertyType } from 'hooks/api';
import { ISearchPropertyModel } from 'hooks/api/properties/search';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CellProps, Renderer } from 'react-table';

interface IAddPropertyColumnsProps {
  onAddProperty?: (property: ISearchPropertyModel) => void;
}

export const AddPropertyColumns = (
  props?: IAddPropertyColumnsProps,
): ColumnWithProps<ISearchPropertyModel>[] => {
  return [
    {
      accessor: 'id',
      clickable: false,
      maxWidth: 30,
      Cell: (cell) => {
        return (
          <TooltipWrapper toolTipId="add-property" toolTip="Add Property to Project">
            <FaPlus
              className="add"
              onClick={() => (props?.onAddProperty ? props.onAddProperty(cell.row.original) : {})}
            />
          </TooltipWrapper>
        );
      },
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
      Cell: (row) => {
        return (
          <TooltipWrapper toolTipId="add-property" toolTip={row.value}>
            <div>{row.value}</div>
          </TooltipWrapper>
        );
      },
    },
    {
      Header: 'Civic Address',
      accessor: 'address',
      align: 'left',
      clickable: true,
      Cell: (row) => {
        return (
          <TooltipWrapper toolTipId="add-property" toolTip={row.value}>
            <div>{row.value}</div>
          </TooltipWrapper>
        );
      },
    },
    {
      Header: 'Classification',
      accessor: (row) => row.classification,
      align: 'left',
      clickable: false,
    },
    {
      Header: 'Other Projects',
      accessor: 'projectNumbers',
      align: 'left',
      clickable: false,
      Cell: (cell) => {
        const projectNumbers = _.filter(cell.value, (p: string) => !p.includes('DRAFT'));
        return (
          <div>
            {projectNumbers?.map((projectNumber: string) => (
              <React.Fragment key={projectNumber}>
                <Link to={`/projects?projectNumber=${projectNumber}`}>{projectNumber}</Link>
              </React.Fragment>
            ))}
          </div>
        );
      },
    },
    {
      Header: 'Net Book Value',
      accessor: 'netBook',
      align: 'left',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<ISearchPropertyModel, number | undefined>>,
    },
    {
      Header: 'Assessed Land',
      accessor: 'assessedLand',
      align: 'left',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<ISearchPropertyModel, number | undefined>>,
    },
    {
      Header: 'Assessed Year',
      accessor: (row) =>
        row.assessedLandDate ?? row.assessedBuildingDate
          ? moment(row.assessedLandDate ?? row.assessedBuildingDate).year()
          : '',
      clickable: false,
      maxWidth: 50,
    },
    {
      Header: 'Assessed Building',
      accessor: 'assessedBuilding',
      align: 'left',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<ISearchPropertyModel, number | undefined>>,
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
