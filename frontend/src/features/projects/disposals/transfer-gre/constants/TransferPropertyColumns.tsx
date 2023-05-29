import { FastSelect } from 'components/common/form';
import { BuildingSvg, LandSvg } from 'components/common/Icons';
import { ColumnWithProps, MoneyCell } from 'components/Table';
import { useFormikContext } from 'formik';
import { PropertyType } from 'hooks/api';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { CellProps, Renderer } from 'react-table';
import { LookupType, useLookups } from 'store/hooks';
import { mapLookupCode } from 'utils';

import { IProjectForm, IProjectPropertyForm } from '../../interfaces';

/**
 * Returns an array of columns to display within a table.
 */
export const TransferPropertyColumns = (): ColumnWithProps<IProjectPropertyForm>[] => {
  const formik = useFormikContext<IProjectForm>();
  const { controller } = useLookups();

  const classifications = controller
    .getType(LookupType.PropertyClassification, true)
    .filter((o) => Number(o.id) <= 1)
    .map((o) => mapLookupCode(o));

  return [
    {
      Header: 'Name',
      accessor: 'name',
      align: 'left',
      clickable: false,
      Cell: (row) => {
        return <div>{row.value}</div>;
      },
    },
    {
      Header: 'Civic Address',
      accessor: 'address',
      align: 'left',
      clickable: true,
      Cell: (cell) => {
        return <div>{cell.value}</div>;
      },
    },
    {
      Header: 'Classification',
      accessor: 'classificationId',
      align: 'left',
      clickable: false,
      minWidth: 200,
      Cell: (cell) => {
        return (
          <FastSelect
            placeholder="Must select one"
            formikProps={formik}
            options={classifications}
            field={`properties.${cell.row.id}.${cell.column.id}`}
          />
        );
      },
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
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyForm, number | ''>>,
    },
    {
      Header: 'Assessed Land',
      accessor: 'assessedLand',
      align: 'left',
      clickable: false,
      Cell: MoneyCell as Renderer<CellProps<IProjectPropertyForm, number | ''>>,
    },
    {
      Header: 'Assessed Year',
      accessor: (row) => (row.assessedLandYear ? moment(row.assessedLandYear).year() : ''),
      clickable: false,
      maxWidth: 50,
    },
    {
      Header: 'Assessed Building',
      accessor: 'assessedImprovements',
      align: 'left',
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
