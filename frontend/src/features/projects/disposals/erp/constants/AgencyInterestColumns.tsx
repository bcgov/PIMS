import {
  getEditableDatePickerCell,
  getEditableSelectCell,
  getEditableTextAreaCell,
} from 'features/projects/common/components/columns';
import { AgencyResponses } from 'features/projects/constants';
import { useFormikContext } from 'formik';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { formatDate } from 'utils';

import { IProjectForm } from '../../interfaces';

/**
 * Returns an array of columns to display within a table.
 */
export const AgencyInterestColumns = ({ disabled = false }) => {
  const formikProps = useFormikContext<IProjectForm>();
  const namespace = 'projectAgencyResponses';

  const removeResponse = (index: number) => {
    const responses = [...formikProps.values.projectAgencyResponses];
    responses.splice(index, 1);
    formikProps.setFieldValue(namespace, responses);
  };

  return [
    {
      Header: 'Agency',
      accessor: 'agencyCode', // accessor is the "key" in the data
      align: 'left',
      Cell: (cellInfo: any) => {
        return (
          <>
            <FaTrash
              style={{ marginRight: 10, cursor: 'pointer' }}
              onClick={() => removeResponse(cellInfo.row.id)}
              title="Delete Response"
            />
            {cellInfo.value}
          </>
        );
      },
    },
    {
      Header: 'Business Case Received Date',
      accessor: 'receivedOn',
      maxWidth: 60,
      align: 'left',
      Cell: disabled
        ? (cellInfo: any) => formatDate(cellInfo.value) ?? null
        : getEditableDatePickerCell(namespace),
    },
    {
      Header: 'Note',
      accessor: 'note',
      align: 'left',
      Cell: disabled
        ? (cellInfo: any) => cellInfo.value ?? null
        : getEditableTextAreaCell(namespace),
    },
    {
      Header: 'Response',
      accessor: 'response',
      maxWidth: 80,
      align: 'left',
      Cell: disabled
        ? (cellInfo: any) =>
            (cellInfo.value === AgencyResponses.Unsubscribe
              ? 'Not Interested'
              : cellInfo.value === AgencyResponses.Watch
                ? 'Interested'
                : 'Send Notifications') ?? null
        : getEditableSelectCell(namespace),
    },
  ];
};
