import { Fragment } from 'react';
import React from 'react';
import { useFormikContext } from 'formik';
import { Form, FastCurrencyInput } from 'components/common/form';
import { ProjectNotes, NoteTypes, IProject } from 'features/projects/common';

interface CloseOutFinancialsFormProps {
  isReadOnly?: boolean;
}

const CloseOutFinancialsForm = (props: CloseOutFinancialsFormProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <Fragment>
      <h3>Financing Information</h3>
      <ProjectNotes
        field={`notes[${NoteTypes.LoanTerms}].note`}
        label="Loan Terms"
        outerClassName="col-md-12"
      />
      <ProjectNotes
        field={`notes[${NoteTypes.CloseOut}].note`}
        label="Close Out"
        outerClassName="col-md-12"
      />
      <h3>OCG</h3>
      <Form.Row className="col-md-12">
        <Form.Label column md={2}>
          OCG Gain / Loss
        </Form.Label>
        <FastCurrencyInput
          formikProps={formikProps}
          disabled={props.isReadOnly}
          outerClassName="col-md-4"
          field="ocgFinancialStatement"
        />
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutFinancialsForm;
