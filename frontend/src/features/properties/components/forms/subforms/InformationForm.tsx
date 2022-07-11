import { FastSelect, Form, Input, SelectOption, TextArea } from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { useFormikContext } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { useMyAgencies } from 'hooks/useMyAgencies';
import { FunctionComponent, useMemo } from 'react';
import React from 'react';
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
  const keycloak = useKeycloakWrapper();
  const agencies = (props.agencies ?? []).map(c => mapSelectOptionWithParent(c, props.agencies));
  const userAgency = agencies.find(a => Number(a.value) === Number(keycloak.agencyId));

  const isUserAgencyAParent = useMemo(() => {
    return !!userAgency && !userAgency.parentId;
  }, [userAgency]);

  const myAgencies = useMyAgencies();

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
        <Form.Label>Agency</Form.Label>
        <ParentSelect
          field={withNameSpace('agencyId')}
          options={myAgencies.map(c => mapSelectOptionWithParent(c, myAgencies))}
          filterBy={['code', 'label', 'parent']}
          disabled={props.disabled || (!props.isPropertyAdmin && !isUserAgencyAParent)}
          convertValue={Number}
        />
      </Form.Row>
    </>
  );
};

export default InformationForm;
