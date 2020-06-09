import * as React from 'react';
import { Button } from 'react-bootstrap';

interface IEditButtonProps {
  /** whether or not the form this button belongs to is disabled */
  formDisabled?: boolean;
  /** set the form to be editable */
  setFormDisabled: Function;
  /** true if the current user is allowed to edit this form */
  canEdit?: boolean;
}

/**
 * Button that allows toggling the form state (editable/not-editable)
 * @param param0 IEditButtonPropts
 */
const EditButton: React.FunctionComponent<IEditButtonProps> = ({
  formDisabled: disabled,
  setFormDisabled: setDisabled,
  canEdit,
}: IEditButtonProps) => {
  return canEdit ? (
    <Button disabled={!disabled} className="edit" onClick={() => setDisabled(false)}>
      Edit
    </Button>
  ) : null;
};

export default EditButton;
