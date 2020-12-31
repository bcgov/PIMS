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
import { getIn, useFormikContext } from 'formik';
import TooltipIcon from 'components/common/TooltipIcon';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { IProperty } from 'actions/parcelsActions';
import { Link } from 'react-router-dom';
import { classificationTip, sensitiveTooltip } from '../strings';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import Claims from 'constants/claims';
import { Classifications } from 'constants/classifications';

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
  const { values } = useFormikContext<IProperty>();
  const projectNumber = getIn(values, withNameSpace('projectNumber'));
  const keycloak = useKeycloakWrapper();

  /** only SRES can change to Disposed  */
  const classifications = keycloak.hasClaim(Claims.ADMIN_PROPERTIES)
    ? props.classifications
    : props.classifications.filter(x => Number(x.value) !== Classifications.Disposed);

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
      <Form.Row>
        <Form.Label>Classification</Form.Label>
        <FastSelect
          required
          formikProps={formikProps}
          disabled={props.disabled}
          type="number"
          placeholder="Must Select One"
          field={withNameSpace('classificationId')}
          options={classifications}
          tooltip={classificationTip}
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
            Would this information be harmful if released?&nbsp;
            <br />
            <TooltipIcon toolTipId="sensitive-harmful" toolTip={sensitiveTooltip} />
            <a target="_blank" rel="noopener noreferrer" href={HARMFUL_DISCLOSURE_URL}>
              Policy
            </a>
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
