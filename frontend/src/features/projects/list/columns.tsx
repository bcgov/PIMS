import { ColumnWithProps } from 'components/Table';
import { Workflows } from 'constants/workflows';
import { useConfiguration } from 'hooks/useConfiguration';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { CellProps } from 'react-table';
import { formatDate, formatMoney } from 'utils';

import { IProject } from '.';
// NOTE - There numbers below match the total number of columns ATM (13)
// If additional columns are added or deleted, these numbers need tp be updated...
const howManyColumns = 13;
const totalWidthPercent = 100; // how wide the table should be; e.g. 100%

// Setup a few sample widths: x/2, 1x, 2x (percentage-based)
const unit = Math.floor(totalWidthPercent / howManyColumns);
const spacing = {
  xxsmall: 1,
  xsmall: unit / 4,
  small: unit / 2,
  medium: unit,
  large: unit * 2,
  xlarge: unit * 4,
  xxlarge: unit * 8,
};

export const Columns = (
  onDelete?: (id: string) => void,
  isAdmin?: boolean,
  projectEditClaim?: boolean,
  user?: string,
): ColumnWithProps<IProject>[] => {
  const { isProduction } = useConfiguration();
  return [
    {
      Header: 'Project No.',
      accessor: 'projectNumber', // accessor is the "key" in the data
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.small,
      minWidth: 65,
      Cell: (props: CellProps<IProject>) => {
        /**
         * @description This function dictates whether or not to display the Trash Icon in the View Disposal Projects table.
         *              If the current environment is not production, the app will allow the user to delete a project that has been approved,
         *              granted that they have the correct permissions. The deletion of approved projects in non-production environments is helpful when testing.
         *
         * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
         * @returns {boolean} - Whether or not to display the delete disposal project trash icon
         *
         * @example
         * return showTrashIcon() ? <TrashIcon /> : "";
         */

        const isTrashIconVisible = (): boolean => {
          /* 
            If the current environment is production, only show the icon if one of the following is true:
            - The project is owned by the user
            - The user is an admin
            - The user has the projcetEditClaim
             AND IF the project is in review
          */
          if (isProduction) {
            return (
              !!onDelete &&
              props.row.original.workflowCode === Workflows.SUBMIT_DISPOSAL &&
              (projectEditClaim || isAdmin || user === props.row.original.createdBy)
            );
          }
          // Otherwise show the delete icon as long as the user has the correct permissions
          return (
            /* props.row.original.workflowCode === Workflows.SUBMIT_DISPOSAL &&*/
            projectEditClaim || isAdmin || user === props.row.original.createdBy
          );
        };
        return (
          <div>
            {isTrashIconVisible() ? (
              <FaTrash
                data-testid={`trash-icon-${props.row.original.projectNumber}`}
                style={{ marginRight: 10, cursor: 'pointer' }}
                onClick={(e: any) => {
                  e.stopPropagation();
                  onDelete?.(props.row.original.projectNumber);
                }}
              />
            ) : (
              ''
            )}
            <span>{props.row.original.projectNumber}</span>
          </div>
        );
      },
    },
    {
      Header: 'Name',
      accessor: 'name',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 200,
    },
    {
      Header: 'Status',
      accessor: 'status',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.large,
      minWidth: 50,
    },
    {
      Header: 'Agency',
      accessor: (item) => (item.subAgency ? `${item.subAgency} (${item.agency})` : item.agency),
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 80,
    },
    {
      Header: 'Zoning',
      accessor: 'zoning',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.small,
      minWidth: 80,
    },
    {
      Header: 'Zoning Potential',
      accessor: 'zoningPotential',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.small,
      minWidth: 80,
    },
    {
      Header: 'Net Book Value',
      accessor: 'netBook',
      align: 'left',
      clickable: true,
      responsive: true,
      width: spacing.small,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return <span>{formatMoney(props.row.original.netBook)}</span>;
      },
    },
    {
      Header: 'Market Value',
      accessor: 'market',
      align: 'left',
      clickable: true,
      responsive: true,
      width: spacing.small,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return <span>{formatMoney(props.row.original.market)}</span>;
      },
    },
    {
      Header: 'Updated On',
      accessor: 'updatedOn',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return (
          <span>{formatDate(props.row.original.updatedOn || props.row.original.createdOn)}</span>
        );
      },
    },
    {
      Header: 'Updated By',
      accessor: 'updatedById',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return <span>{props.row.original.updatedBy || props.row.original.createdBy}</span>;
      },
    },
  ];
};
