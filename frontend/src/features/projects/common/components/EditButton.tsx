import * as React from 'react';
import { Button } from 'react-bootstrap';

interface IEditButtonProps {
  /** whether or not the form this button belongs to is disabled */
  formDisabled?: boolean;
  /** set the form to be editable */
  setFormDisabled?: Function;
  /** true if the current user is allowed to edit this form */
  canEdit?: boolean;
}

/**
 * Button that allows toggling the form state (editable/not-editable)
 * @param param0 IEditButtonPropts
 */
const EditButton: React.FunctionComponent<IEditButtonProps> = ({
  formDisabled,
  setFormDisabled,
}: IEditButtonProps) => {
  return setFormDisabled ? (
    <Button disabled={!formDisabled} className="edit" onClick={() => setFormDisabled(false)}>
      Edit
    </Button>
  ) : null;
};

export default EditButton;
