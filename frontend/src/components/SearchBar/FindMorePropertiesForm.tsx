import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { mapLookupCode } from 'utils';
import * as API from 'constants/API';
import styled from 'styled-components';
import { Container, Form, Row } from 'react-bootstrap';
import { Button, Check, Input, Select } from 'components/common/form';
import _ from 'lodash';
import { getIn, useFormikContext } from 'formik';
import { TypeaheadField } from 'components/common/form/Typeahead';
import variables from '_variables.module.scss';

const StyledRow = styled(Row)`
  .form-group {
    display: flex;
    .form-label {
      margin-top: 0.5rem;
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
  border-left: 10px solid rgba(96, 96, 96, 0.2);
  height: 40px;
  margin-left: 20px;
  border-width: 2px;
`;

/** styled component used for project number */
const ProjectNumber = styled(props => <Input {...props} />)`
  width: 129px;
  margin-right: 10px;
`;

/** styled container with grey background to contain form contents */
const FormSection = styled(props => <Container {...props} />)`
  margin-top: 20px;
  background-color: ${variables.tableHeaderColor};
  border-radius: 5px;
`;

const SearchButton = styled(props => <Button {...props} />)`
  margin-top: 10px;
  margin-left: 665px;
`;

const ErrorMessage = styled.p`
  color: ${variables.dangerColor};
`;

const StyledLocation = styled(props => <TypeaheadField {...props} />)`
  width: 250px;
  margin-left: 60px;
`;
/** This form is triggered by the FindMorePropertiesButton and contains additional filter fields for the PropertiesFilter */
const FindMorePropertiesForm = <T extends any>(props: any) => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );

  const { setFieldValue, handleSubmit, errors } = useFormikContext<any>();
  const [clear, setClear] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  const predominateUses = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PREDOMINATE_USE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const administrativeAreas = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME;
  });
  const adminAreas = (administrativeAreas ?? []).map(c => mapLookupCode(c, null));
  const handleSearch = () => {
    if (errors.inEnhancedReferralProcess || errors.inSurplusPropertyProgram) {
      setDisplayError(true);
    } else {
      handleSubmit();
    }
  };

  return (
    <>
      <p>
        Search for properties within the Enhanced Referral Process (ERP) or Surplus Property List
        (SPL)
      </p>
      <p>
        <strong>Note: </strong> The search results will
        <strong>
          &nbsp;only include properties in projects that have been identified as Tier 2, 3, or 4
        </strong>
        <br></br> in the disposal process. For properties included in Tier 1, please contact
        <em> Strategic Real Estate Services</em> at<br></br>
        <a href="mailto:RealPropertyDivision.Disposals@gov.bc.ca">
          RealPropertyDivision.Disposals@gov.bc.ca
        </a>
      </p>
      <FormSection>
        {displayError && (
          <ErrorMessage>
            {errors.inSurplusPropertyProgram
              ? errors.inSurplusPropertyProgram
              : errors.inEnhancedReferralProcess}
          </ErrorMessage>
        )}
        <StyledRow style={{ marginLeft: 140, paddingTop: 10 }}>
          <Check label="ERP Properties" field="inEnhancedReferralProcess" />
          <VerticalLine />
          <Check label="SPL Properties" field="inSurplusPropertyProgram" />
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 5, paddingTop: 10 }}>
          <h6>Search by</h6>
        </Row>
        <StyledRow style={{ marginLeft: 35 }}>
          <Form.Label style={{ marginTop: '.5rem' }}>Location</Form.Label>
          <StyledLocation
            name="administrativeArea"
            placeholder="Enter a location"
            paginate={false}
            hideValidation={true}
            options={adminAreas.map((x: any) => x.label)}
            onChange={(vals: any) => {
              setFieldValue('administrativeArea', getIn(vals[0], 'name') ?? vals[0]);
            }}
            clearSelected={clear}
            setClear={setClear}
          />
          <VerticalLine />
          <ProjectNumber field="projectNumber" label="Project number" placeholder="SPP #" />
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 5, paddingTop: 10 }}>
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
      <FormSection>
        <Row style={{ marginLeft: 5, paddingTop: 10 }}>
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
          <NumberInput label="Net usable area" field="rentableArea" />
        </StyledRow>
      </FormSection>
      <Row>
        <SearchButton
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </SearchButton>
      </Row>
    </>
  );
};

export default FindMorePropertiesForm;
