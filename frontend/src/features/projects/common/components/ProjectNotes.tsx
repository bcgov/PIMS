import * as React from 'react';
import { Form } from 'react-bootstrap';
import { TextArea } from 'components/common/form';
import './ProjectNotes.scss';
import { NoteTypes } from 'constants/noteTypes';
import styled from 'styled-components';

export interface IProjectNotesProps {
  /** The formik field name by default this is notes */
  field?: string;
  /** provide a className for the wrapped project note textarea */
  className?: string;
  /** override the default note outerClassName */
  outerClassName?: string;
  /** the label of the notes field */
  label?: string;
  /** the tooltip to be included with the label */
  tooltip?: string;
  /** whether or not this text box can be interaced with */
  disabled?: boolean;
  /** comment below label */
  comment?: string;
}

const Comment = styled.div`
  font-size: 12px;
  margin-top: -100px;
  max-width: 16.7%;
`;

/**
 * Simple notes component intended for use with formik - ensures consistent cross step styling.
 * @param param0
 */
export default function ProjectNotes({
  label,
  tooltip,
  field,
  className,
  outerClassName,
  disabled,
  comment,
}: IProjectNotesProps) {
  return (
    <Form.Row className="ProjectNotes">
      <TextArea
        fast
        disabled={disabled}
        tooltip={tooltip}
        label={label ?? 'Notes'}
        field={field ?? 'note'}
        className={className ?? 'col-md-5'}
        outerClassName={outerClassName ?? 'col-md-10'}
      />
      {!!comment && <Comment>{comment}</Comment>}
    </Form.Row>
  );
}

export const PrivateNotes = ({
  label,
  tooltip,
  field,
  className,
  outerClassName,
  disabled,
}: IProjectNotesProps) => {
  return (
    <ProjectNotes
      disabled={disabled}
      tooltip={tooltip ?? 'Visible to SRES only'}
      label={label ?? 'Private Notes'}
      field={field ?? 'privateNote'}
      className={className}
      outerClassName={outerClassName}
    />
  );
};

export const PublicNotes = ({
  label,
  tooltip,
  field,
  className,
  outerClassName,
  disabled,
}: IProjectNotesProps) => {
  return (
    <ProjectNotes
      disabled={disabled}
      tooltip={tooltip ?? 'Visible to SRES and project agency'}
      label={label ?? 'Shared Notes'}
      field={field ?? 'publicNote'}
      className={className}
      outerClassName={outerClassName}
    />
  );
};

export const ErpNotificationNotes = ({
  label,
  tooltip,
  field,
  className,
  outerClassName,
  disabled,
}: IProjectNotesProps) => {
  return (
    <ProjectNotes
      disabled={disabled}
      tooltip={
        tooltip ??
        'The contents of this note will be included in email notifications for this project related to the ERP process.'
      }
      label={label ?? 'Add the following text to the ERP Notification Email'}
      field={`notes[${NoteTypes.ErpNotification}].note`}
      className={className}
      outerClassName={outerClassName}
    />
  );
};
