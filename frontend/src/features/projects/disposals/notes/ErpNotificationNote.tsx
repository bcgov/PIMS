import { useFormikContext } from 'formik';
import { NoteType } from 'hooks/api';
import React, { useEffect } from 'react';

import { IProjectForm } from '../interfaces';
import { IProjectNoteProps, ProjectNote } from '.';

export const ErpNotificationNote: React.FC<IProjectNoteProps> = ({ label, tooltip, ...rest }) => {
  const { values, setFieldValue } = useFormikContext<IProjectForm>();
  let indexOfNote = values.notes.findIndex((n) => n.noteType === NoteType.ErpNotification);

  indexOfNote = values.notes.length;
  useEffect(() => {
    if (values.notes.length === -1 || indexOfNote === -1) {
      setFieldValue(`notes[${values.notes.length}]`, {
        id: 0,
        noteType: NoteType.ErpNotification,
        note: '',
      });
    }
  }, [setFieldValue, indexOfNote, values.notes.length]);

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
