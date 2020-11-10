import * as React from 'react';
import styled from 'styled-components';
import LastUpdatedBy from './LastUpdatedBy';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { Button, Spinner } from 'react-bootstrap';
import DebouncedValidation from './forms/subforms/DebouncedValidation';
import { Persist } from 'components/common/FormikPersist';
import { initialValues } from 'features/projects/common';
import { PARCEL_STORAGE_NAME } from 'utils/storageUtils';
import Claims from 'constants/claims';
import { FaTrash } from 'react-icons/fa';
import { IKeycloak } from 'hooks/useKeycloakWrapper';
import { useFormikContext } from 'formik';
import { IParcel, IProperty } from 'actions/parcelsActions';
import GenericModal from 'components/common/GenericModal';
import { valuesToApiFormat, IFormParcel } from '../containers/ParcelDetailFormContainer';
import useDraftMarkerSynchronizer from '../hooks/useDraftMarkerSynchronizer';
import { ParcelDetailTabs } from '../containers/ParcelDetailContainer';

interface IParcelFormControlsProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  keycloak: IKeycloak;
  onDelete: (parcel: IParcel) => void;
  setEditing: (editing: boolean) => void;
  editing: boolean;
  persistCallback: (data: IParcel) => void;
  properties: IProperty[];
  currentTab: ParcelDetailTabs;
  disabled?: boolean;
  loadDraft?: boolean;
}

const FormControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  button {
    margin-left: 10px;
  }
`;

/**
 * Parcel Delete Button.
 */
const DeleteButton = ({
  cachedParcelDetail,
  keycloak,
  setShowDeleteDialog,
  disabled,
  editing,
}: any) => {
  return (keycloak.hasAgency(cachedParcelDetail?.agencyId) ||
    keycloak.hasClaim(Claims.ADMIN_PROPERTIES) ||
    keycloak.hasClaim(Claims.PROPERTY_DELETE)) &&
    !!cachedParcelDetail?.id ? (
    <Button
      data-testid="delete"
      className="delete-btn"
      onClick={(e: any) => {
        e.preventDefault();
        setShowDeleteDialog(true);
      }}
      disabled={disabled && !editing}
    >
      <TooltipWrapper toolTipId="delete-button-tooltip" toolTip="Delete Parcel">
        <FaTrash size={20} />
      </TooltipWrapper>
    </Button>
  ) : null;
};

const SubmitButton = ({ disabled, formikProps, setEditing, editing }: any) => {
  return !disabled || editing ? (
    <TooltipWrapper toolTipId="submit-button-tooltip" toolTip="Add Property to Inventory">
      <Button
        disabled={disabled && !editing}
        type="submit"
        onClick={async (e: any) => {
          e.preventDefault();
          formikProps.setSubmitting(true);
          await formikProps.submitForm();
          setEditing(false);
        }}
      >
        {editing ? 'Save' : 'Submit'}
        {formikProps.isSubmitting && (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            as="span"
            style={{ marginLeft: '.5rem' }}
          />
        )}
      </Button>
    </TooltipWrapper>
  ) : null;
};

const EditButton = ({ disabled, setEditing, editing }: any) => {
  return disabled && !editing ? (
    <TooltipWrapper toolTipId="edit-button-tooltip" toolTip="Edit this property">
      <Button
        variant="secondary"
        onClick={(e: any) => {
          e.preventDefault();
          setEditing(true);
        }}
      >
        Edit
      </Button>
    </TooltipWrapper>
  ) : null;
};

const CancelButton = ({ disabled, setEditing, editing }: any) => {
  return disabled && editing ? (
    <TooltipWrapper toolTipId="cancel-button-tooltip" toolTip="Cancel eediting this property">
      <Button
        variant="secondary"
        onClick={(e: any) => {
          e.preventDefault();
          setEditing(false);
        }}
      >
        Cancel
      </Button>
    </TooltipWrapper>
  ) : null;
};

/**
 * Confirmation dialog displayed when the delete button is clicked.
 */
const DeleteModal = ({ showDeleteDialog, setShowDeleteDialog, onDelete }: any) => (
  <GenericModal
    message="Are you sure you want to permanently delete the property?"
    cancelButtonText="Cancel"
    okButtonText="Delete"
    display={showDeleteDialog}
    handleOk={onDelete}
    handleCancel={() => {
      setShowDeleteDialog(false);
    }}
  />
);

/**
 * Parcel Form controls displayed at the top of the parcel detail form. These buttons allow the user to control what is displayed in the Parcel Detail Form, and to modify the current parcel based on their permissions.
 * @param param0
 */
const ParcelFormControls: React.FunctionComponent<IParcelFormControlsProps> = ({
  loadDraft,
  disabled,
  setShowDeleteDialog,
  showDeleteDialog,
  keycloak,
  onDelete,
  setEditing,
  editing,
  persistCallback,
  properties,
  currentTab,
}) => {
  const formikProps = useFormikContext<IFormParcel>();
  useDraftMarkerSynchronizer({ properties });
  return (
    <>
      <FormControls className="form-controls">
        {formikProps.values.id && <LastUpdatedBy {...(formikProps.values as any)} />}
        <EditButton {...{ formikProps, disabled, setEditing, editing }} />
        <CancelButton {...{ formikProps, disabled, setEditing, editing }} />
        <SubmitButton {...{ formikProps, disabled, setEditing, editing }} />
      </FormControls>

      {currentTab === ParcelDetailTabs.parcel && (
        <DeleteButton
          cachedParcelDetail={formikProps.values}
          keycloak={keycloak}
          setShowDeleteDialog={setShowDeleteDialog}
          disabled={disabled}
          editing={editing}
        />
      )}
      <DeleteModal
        {...{
          showDeleteDialog,
          setShowDeleteDialog,
          onDelete: () => onDelete(valuesToApiFormat({ ...formikProps.values })),
        }}
      />
      <DebouncedValidation formikProps={formikProps} />
      {!disabled && (
        <Persist
          initialValues={initialValues}
          secret={keycloak.obj.subject}
          loadDraft={loadDraft}
          name={PARCEL_STORAGE_NAME}
          persistCallback={persistCallback}
        />
      )}
    </>
  );
};

export default ParcelFormControls;
