import { useFormikContext } from 'formik';
import { NoteType } from 'hooks/api';
import React from 'react';

import { IProjectForm } from '../interfaces';
import { IProjectNoteProps, ProjectNote } from '.';

export const ErpNotificationNote: React.FC<IProjectNoteProps> = ({ label, tooltip, ...rest }) => {
  const { values, setFieldValue } = useFormikContext<IProjectForm>();
  let indexOfNote = values.notes.findIndex(n => n.noteType === NoteType.ErpNotification);

  if (indexOfNote === -1) {
    indexOfNote = values.notes.length;
    setFieldValue(`notes[${values.notes.length}]`, {
      id: 0,
      noteType: NoteType.ErpNotification,
      note: '',
    });
  }

  return (
    <ProjectNote
      tooltip={
        tooltip ??
        'The contents of this note will be included in email notifications for this project related to the ERP process.'
      }
      label={label ?? 'Add the following text to the ERP Notification Email'}
      field={`notes[${indexOfNote}].note`}
      {...rest}
    />
  );
};
