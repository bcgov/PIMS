import { useFormikContext } from 'formik';
import { NoteType } from 'hooks/api';
import React from 'react';
import { IProjectNoteProps, ProjectNote } from '.';
import { IProjectForm } from '../interfaces';

export const ErpNotificationNote: React.FC<IProjectNoteProps> = ({ label, tooltip, ...rest }) => {
  const { values } = useFormikContext<IProjectForm>();
  const indexOfNote = values.notes.findIndex(n => n.noteType === NoteType.ErpNotification);

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
