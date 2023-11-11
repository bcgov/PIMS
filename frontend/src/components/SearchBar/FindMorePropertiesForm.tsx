import './FindMorePropertiesForm.scss';

import { Button, Check, DisplayError, Input, Select } from 'components/common/form';
import { TypeaheadField } from 'components/common/form/Typeahead';
import * as API from 'constants/API';
import { getIn, useFormikContext } from 'formik';
import useCodeLookups from 'hooks/useLookupCodes';
import React, { ReactElement, useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { mapLookupCode } from 'utils';

/** bar separator for the inputs */
const VerticalLine = () => <span className="vertical-line" />;

/** the area where invalid feedback or ERP/SPL selection will be displayed */
interface IChildProps {
  children: ReactElement;
}
const InvalidFeedback = ({ children }: IChildProps) => (
  <div className="invalid-feedback-container">{children}</div>
);

/** This form is triggered by the FindMorePropertiesButton and contains additional filter fields for the PropertiesFilter */
const FindMorePropertiesForm = () => {
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
    <div id="find-more-properties">
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
      <Container className="form-section">
        {displayError && (
          <InvalidFeedback>
            <DisplayError errorPrompt field="inSurplusPropertyProgram" />
          </InvalidFeedback>
        )}

        <Row className="form-row form-row-centred">
          <Col md="auto">
            <Check label="ERP Properties" field="inEnhancedReferralProcess" />
          </Col>
          <Col md="auto">
            <VerticalLine />
          </Col>
          <Col md="auto">
            <Check label="SPL Properties" field="inSurplusPropertyProgram" />
          </Col>
        </Row>
      </Container>
      <Container className="form-section">
        <Row>
          <h6>Search By</h6>
        </Row>
        <Row className="form-row">
          <Col md="auto" className="location-label-col">
            <Form.Label>Location</Form.Label>
          </Col>
          <Col md="auto" className="location-col">
            <TypeaheadField
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
            <Input
              field="projectNumber"
              label="Project Number"
              placeholder="SPP #"
              className="project-number-input"
            />
          </Col>
        </Row>
      </Container>
      <Container className="form-section">
        <Row>
          <h6>Land Search Criteria</h6>
        </Row>
        <Row className="form-row">
          <Col md="auto" className="lot-size-col">
            <Input label="Lot Size" field="minLotSize" placeholder="min" className="number-input" />
          </Col>
          <Col md="auto" className="no-padding">
            <span>-</span>
          </Col>
          <Col md="auto" className="lot-size-max-col">
            <Input field="maxLotSize" placeholder="max" className="number-input" />
          </Col>
          <Col md="auto">
            <VerticalLine />
          </Col>
          <Col md="auto">
            <Check label="Land Only" field="bareLandOnly" />
          </Col>
        </Row>
      </Container>
      <Container className="form-section">
        <Row>
          <h6>Building Search Criteria</h6>
        </Row>
        <Row className="form-row">
          <Col md="auto">
            <Select
              className="building-select"
              field="predominateUseId"
              placeholder="Any"
              options={predominateUses}
              label="Predominate Use"
            />
          </Col>
          <Col md="auto">
            <VerticalLine />
          </Col>
          <Col md="auto">
            <Input label="Net Usable Area" field="rentableArea" className="number-input" />
          </Col>
        </Row>
      </Container>
      <Row>
        <Col xs={12}>
          <Button
            className="search-button"
            onClick={() => {
              handleSearch();
            }}
          >
            Search
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FindMorePropertiesForm;
