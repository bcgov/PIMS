import variables from '_variables.module.scss';
import { Button, Check, DisplayError, Input, Select } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import * as API from 'constants/API';
import { getIn, useFormikContext } from 'formik';
import useCodeLookups from 'hooks/useLookupCodes';
import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { mapLookupCode } from 'utils';

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
const NumberInput = styled((props) => <Input {...props} />)`
  width: 86px;
`;

/** controlling the width of the select component used in this form */
const StyledSelect = styled((props) => <Select {...props} />)`
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
const ProjectNumber = styled((props) => <Input {...props} />)`
  width: 129px;
  margin-right: 10px;
`;

/** styled container with grey background to contain form contents */
const FormSection = styled((props) => <Container {...props} />)`
  margin-top: 20px;
  background-color: ${variables.tableHeaderColor};
  border-radius: 5px;
`;

const SearchButton = styled((props) => <Button {...props} />)`
  margin-top: 10px;
`;

const StyledLocation = styled((props) => <TypeaheadField {...props} />)`
  width: 250px;
  margin-left: 60px;
`;

/** the area where invalid feedback or ERP/SPL selection will be displayed */
const InvalidFeedback = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin: 0.5rem 0;
  text-align: center;
  .invalid-feedback {
    display: block;
  }
`;

/** This form is triggered by the FindMorePropertiesButton and contains additional filter fields for the PropertiesFilter */
const FindMorePropertiesForm = (props: any) => {
  const lookupCodes = useCodeLookups();
  const { setFieldValue, handleSubmit, errors } = useFormikContext<any>();
  const [clear, setClear] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  const predominateUses = lookupCodes
    .getByType(API.PREDOMINATE_USE_CODE_SET_NAME)
    .map(mapLookupCode);
  const adminAreas = lookupCodes
    .getByType(API.AMINISTRATIVE_AREA_CODE_SET_NAME)
    .map((c) => mapLookupCode(c, null));

  /** attempt submission of search, display errors if present */
  const handleSearch = () => {
    handleSubmit();
    if (errors) {
      setDisplayError(true);
    }
  };

  useEffect(() => {
    // Track <a/> tag clicks in Snowplow Analytics.
    window.snowplow('refreshLinkClickTracking');
  }, []);

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
          <InvalidFeedback>
            <DisplayError errorPrompt field="inSurplusPropertyProgram" />
          </InvalidFeedback>
        )}

        <StyledRow style={{ marginLeft: 160, paddingTop: 20, paddingBottom: '10px' }}>
          <Col md="auto">
            <Check label="ERP Properties" field="inEnhancedReferralProcess" />
          </Col>
          <Col md="auto">
            <VerticalLine />
          </Col>
          <Col md="auto">
            <Check label="SPL Properties" field="inSurplusPropertyProgram" />
          </Col>
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 5, paddingTop: 10 }}>
          <h6>Search by</h6>
        </Row>
        <StyledRow style={{ marginLeft: 20, paddingBottom: '20px', alignItems: 'center' }}>
          <Col md={1} style={{ marginRight: '-25px' }}>
            <Form.Label style={{ marginTop: '.5rem' }}>Location</Form.Label>
          </Col>
          <Col md="auto" style={{ marginRight: '-25px' }}>
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
          </Col>
          <Col md="auto">
            <VerticalLine />
          </Col>
          <Col md="auto">
            <ProjectNumber field="projectNumber" label="Project number" placeholder="SPP #" />
          </Col>
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 5, paddingTop: 10 }}>
          <h6>Land search criteria</h6>
        </Row>
        <StyledRow style={{ marginLeft: 20, paddingBottom: '20px', alignItems: 'center' }}>
          <Col md="auto">
            <NumberInput label="Lot size" field="minLotSize" placeholder="min" />
          </Col>
          <Col md="auto">
            <span style={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>-</span>
          </Col>
          <Col md="auto">
            <NumberInput field="maxLotSize" placeholder="max" />
          </Col>
          <Col md="auto">
            <VerticalLine />
          </Col>
          <Col md="auto">
            <Check label="Land only" field="bareLandOnly" />
          </Col>
        </StyledRow>
      </FormSection>
      <FormSection>
        <Row style={{ marginLeft: 5, paddingTop: 10 }}>
          <h6>Building search criteria</h6>
        </Row>
        <StyledRow style={{ marginLeft: 20, paddingBottom: '20px', alignItems: 'center' }}>
          <Col md={7} style={{ marginRight: '-35px' }}>
            <StyledSelect
              field="predominateUseId"
              placeholder="Any"
              options={predominateUses}
              label="Predominate use"
            />
          </Col>
          <Col md="auto">
            <VerticalLine />
          </Col>
          <Col md="auto">
            <NumberInput label="Net usable area" field="rentableArea" />
          </Col>
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
