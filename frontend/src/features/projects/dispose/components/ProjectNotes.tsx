import * as React from 'react';
import { Form } from 'react-bootstrap';
import { TextArea } from 'components/common/form';
import classNames from 'classnames';

export interface IProjectNotesProps {
  /** The formik field name by default this is notes */
  field?: string;
  /** provide a className for the wrapped project note textarea */
  className?: string;
  /** override the default note outerClassName */
  outerClassName?: string;
}

/**
 * Simple notes component intended for use with formik - ensures consistent cross step styling.
 * @param param0
 */
export default function ProjectNotes({ field, className, outerClassName }: IProjectNotesProps) {
  return (
    <Form.Row className="notes">
      <Form.Label className="col-md-12">Notes:</Form.Label>
      <TextArea
        field={field ?? 'note'}
        className={classNames(className)}
        outerClassName={outerClassName ?? 'col-md-8'}
      />
    </Form.Row>
  );
}
