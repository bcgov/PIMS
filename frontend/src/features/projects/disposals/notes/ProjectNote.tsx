import { TextArea } from 'components/common/form';
import React from 'react';

import * as styled from './styled';

export interface IProjectNoteProps {
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
  /** whether or not this text box can be edited */
  disabled?: boolean;
  /** comment below label */
  comment?: string;
}

export const ProjectNote: React.FC<IProjectNoteProps> = ({ label, field, comment, ...rest }) => {
  return (
    <>
      <TextArea fast label={label ?? 'Notes'} field={field ?? 'note'} {...rest} />
      {!!comment && <styled.Comment>{comment}</styled.Comment>}
    </>
  );
};
