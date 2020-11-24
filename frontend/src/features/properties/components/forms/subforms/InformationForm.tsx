import { FunctionComponent } from 'react';
import React from 'react';
import {
  Input,
  Form,
  TextArea,
  FastSelect,
  SelectOption,
  AutoCompleteText,
} from 'components/common/form';
import { getIn, useFormikContext } from 'formik';
import { IProperty } from 'actions/parcelsActions';
import { Link } from 'react-router-dom';
import { classificationTip } from '../strings';

interface InformationFormProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: SelectOption[];
  agencies: SelectOption[];
  isAdmin: boolean;
  wizard?: boolean;
}
export const defaultInformationFormValues = {
  name: '',
  description: '',
  classificationId: '',
  agencyId: '',
  isSensitive: false,
};
const InformationForm: FunctionComponent<InformationFormProps> = (props: InformationFormProps) => {
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  const formikProps = useFormikContext();
  const { values } = useFormikContext<IProperty>();
  const projectNumber = getIn(values, withNameSpace('projectNumber'));

  return (
    <>
      {projectNumber ? (
        <Form.Row>
          <Form.Label>Project No.</Form.Label>
          <Form.Group>
            <Link to={`/projects/summary?projectNumber=${projectNumber}`}>{projectNumber}</Link>
          </Form.Group>
        </Form.Row>
      ) : null}
      <Form.Row>
        <Form.Label>Name</Form.Label>
        <Input disabled={props.disabled} field={withNameSpace('name')} />
      </Form.Row>
      <Form.Row>
        <Form.Label>Description</Form.Label>
        <TextArea disabled={props.disabled} field={withNameSpace('description')} />
      </Form.Row>
      {!props.wizard && (
        <Form.Row>
          <Form.Label>Classification</Form.Label>
          <FastSelect
            formikProps={formikProps}
            disabled={props.disabled}
            type="number"
            placeholder="Must Select One"
            field={withNameSpace('classificationId')}
            options={props.classifications}
            tooltip={classificationTip}
          />
        </Form.Row>
      )}
      <Form.Row>
        <Form.Label>Agency</Form.Label>
        <AutoCompleteText
          disabled={props.wizard}
          options={props.agencies}
          field={withNameSpace('agencyId')}
        />
      </Form.Row>
    </>
  );
};

export default InformationForm;
