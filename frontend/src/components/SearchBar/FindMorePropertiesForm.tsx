import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { mapLookupCode } from 'utils';
import * as API from 'constants/API';
import styled from 'styled-components';
import { Container, Row } from 'react-bootstrap';
import { Button, Check, Input, Select } from 'components/common/form';
import _ from 'lodash';
import { useFormikContext } from 'formik';

const StyledRow = styled(Row)`
  .form-group {
    display: flex;
    .form-label {
      margin-top: 5px;
      margin-right: 10px;
      width: 150px;
      text-align: right;
    }
  }
`;

/** input used to display small number values in this form */
const NumberInput = styled(props => <Input {...props} />)`
  width: 86px;
`;

/** controlling the width of the select component used in this form */
const StyledSelect = styled(props => <Select {...props} />)`
  width: 250px;
`;

/** bar seperator for the inputs */
const VerticalLine = styled.span`
  border-left: 10px solid #666666;
  height: 40px;
  margin-left: 20px;
  border-width: 1px;
`;

/** styled component used for project number */
const ProjectNumber = styled(props => <Input {...props} />)`
  width: 129px;
  margin-right: 10px;
`;

/** styled container with grey background to contain form contents */
const FormSection = styled(props => <Container {...props} />)`
  margin-top: 20px;
  background-color: #e9ecef;
  border-radius: 5px;
`;

const SearchButton = styled(props => <Button {...props} />)`
  margin-top: 10px;
  margin-left: 665px;
`;

/** This form is triggered by the FindMorePropertiesButton and contains additional filter fields for the PropertiesFilter */
const FindMorePropertiesForm = <T extends any>(props: any) => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );

  const constructionType = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.CONSTRUCTION_CODE_SET_NAME;
  }).map(mapLookupCode);
  const predominateUses = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PREDOMINATE_USE_CODE_SET_NAME;
  }).map(mapLookupCode);

  const { handleSubmit } = useFormikContext();

  return (
    <>
      <p>
        Search for properties within the Enhanced Referral Process (ERP) or Surplus Property Program
        (SPP)
      </p>
      <FormSection>
        <StyledRow style={{ marginLeft: 140, paddingTop: 10 }}>
          <Check label="ERP Properties" field="inEnhancedReferralProcess" />
          <VerticalLine />
          <Check label="SPP Properties" field="inSurplusPropertyProgram" />
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 10 }}>
          <h6>Search by</h6>
        </Row>
        <StyledRow style={{ marginLeft: 35 }}>
          <Input field="administrativeArea" label="Location" />
          <VerticalLine />
          <ProjectNumber field="projectNumber" label="Project number" placeholder="SPP #" />
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 10 }}>
          <h6>Building search criteria</h6>
        </Row>
        <StyledRow>
          <StyledSelect
            field="predominateUseId"
            placeholder="Any"
            options={predominateUses}
            label="Predominate use"
          />
          <VerticalLine />
          <NumberInput label="Number of floors" field="floorCount" />
        </StyledRow>
        <StyledRow>
          <StyledSelect
            field="constructionTypeId"
            placeholder="Any"
            options={constructionType}
            label="Construction type"
          />
          <VerticalLine />
          <NumberInput label="Net usable area" field="rentableArea" />
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 10 }}>
          <h6>Land search criteria</h6>
        </Row>
        <StyledRow style={{ marginLeft: -13 }}>
          <NumberInput label="Lot size" field="minLotSize" placeholder="min" />
          <span style={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>-</span>
          <NumberInput field="maxLotSize" placeholder="max" />
          <VerticalLine />
          <Check label="Bare land only" field="bareLandOnly" />
        </StyledRow>
      </FormSection>
      <Row>
        <SearchButton onClick={handleSubmit}>Search</SearchButton>
      </Row>
    </>
  );
};

export default FindMorePropertiesForm;
