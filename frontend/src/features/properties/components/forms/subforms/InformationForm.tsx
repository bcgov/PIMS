import { FunctionComponent } from 'react';
import React from 'react';
import { Input, Form, TextArea, FastSelect, SelectOption } from 'components/common/form';
import { getIn, useFormikContext } from 'formik';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { mapSelectOptionWithParent } from 'utils';

interface InformationFormProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: SelectOption[];
  agencies: SelectOption[];
  isPropertyAdmin: boolean;
  wizard?: boolean;
}
interface IInformationForm {
  name: string;
  description: string;
  landLegalDescription: string;
  classificationId: number | '';
  agencyId: number | '';
  isSensitive: boolean | '';
}

export const defaultInformationFormValues: IInformationForm = {
  name: '',
  description: '',
  landLegalDescription: '',
  classificationId: '',
  agencyId: '',
  isSensitive: '',
};
const InformationForm: FunctionComponent<InformationFormProps> = (props: InformationFormProps) => {
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  const formikProps = useFormikContext();
  const agencies = (props.agencies ?? []).map(c => mapSelectOptionWithParent(c, props.agencies));
  const agency = getIn(formikProps.values, withNameSpace('agencyId'));

  return (
    <>
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
          />
        </Form.Row>
      )}
      <Form.Row>
        <Form.Label>{agency?.parent ? 'Sub Agency' : 'Agency'}</Form.Label>
        <ParentSelect
          field={withNameSpace('agencyId')}
          options={agencies}
          filterBy={['code', 'label', 'parent']}
          disabled={!props.isPropertyAdmin || props.disabled}
        />
        {agency?.parent && (
          <Form.Row>
            <Form.Label>Agency</Form.Label>
            <Input field="parent" disabled value={agency.parent} style={{ marginLeft: '5px' }} />
          </Form.Row>
        )}
      </Form.Row>
    </>
  );
};

export default InformationForm;
