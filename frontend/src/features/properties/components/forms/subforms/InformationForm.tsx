import { FunctionComponent } from 'react';
import React from 'react';
import {
  Input,
  Form,
  TextArea,
  FastSelect,
  SelectOption,
  AutoCompleteText,
  Check,
} from 'components/common/form';
import { useFormikContext } from 'formik';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { senstiveTooltip as sensitiveTooltip } from '../strings';

interface InformationFormProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: SelectOption[];
  agencies: SelectOption[];
  isAdmin: boolean;
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
      <Form.Row>
        <Form.Label className="required">Classification</Form.Label>
        <FastSelect
          formikProps={formikProps}
          disabled={props.disabled}
          type="number"
          placeholder="Must Select One"
          field={withNameSpace('classificationId')}
          options={props.classifications}
        />
      </Form.Row>
      <Form.Row>
        <Form.Label>Agency</Form.Label>
        <AutoCompleteText
          field={withNameSpace('agencyId')}
          options={props.agencies}
          disabled={!props.isAdmin || props.disabled}
          getValueDisplay={(val: SelectOption) => val.code!}
          agencyType="parent"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label>Sub-Agency</Form.Label>
        <AutoCompleteText
          field={withNameSpace('agencyId')}
          options={props.agencies}
          disabled={!props.isAdmin || props.disabled}
          getValueDisplay={(val: SelectOption) => val.code!}
          agencyType="child"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label></Form.Label>
        <div className="input-medium">
          <p>
            Harmful if Released?&nbsp;
            <TooltipWrapper toolTipId="sensitive-harmful" toolTip={sensitiveTooltip}>
              <a target="_blank" rel="noopener noreferrer" href={HARMFUL_DISCLOSURE_URL}>
                Policy
              </a>
            </TooltipWrapper>
          </p>
          <Check
            type="radio"
            disabled={props.disabled}
            field={withNameSpace('isSensitive')}
            radioLabelOne="Yes"
            radioLabelTwo="No"
          />
        </div>
      </Form.Row>
    </>
  );
};

export default InformationForm;
