import './ParcelIdentificationForm.scss';

import { FastInput, SelectOptions, Check, TextArea, InputGroup } from 'components/common/form';
import { Label } from 'components/common/Label';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import React, { useState } from 'react';
import { useFormikContext, getIn } from 'formik';
import PidPinForm from 'features/properties/components/forms/subforms/PidPinForm';
import { sensitiveTooltip } from '../../../../../src/features/properties/components/forms/strings';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { IGeocoderResponse } from 'hooks/useApi';
import classNames from 'classnames';
import { ISteppedFormValues } from 'components/common/form/StepForm';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { noop } from 'lodash';
import { Container, Row, Col, Form, ListGroup } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import * as API from 'constants/API';
import useCodeLookups from 'hooks/useLookupCodes';
import GenericModal from 'components/common/GenericModal';
import { IParcel } from 'actions/parcelsActions';
import { mapSelectOptionWithParent } from 'utils';
import AddParentParcelsForm from './AddParentParcelsForm';
import { PropertyTypes } from 'constants/propertyTypes';
import { withNameSpace } from 'utils/formUtils';
import MovePinForm from './MovePinForm';
import LandSearchForm from './LandSearchForm';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';
import styled from 'styled-components';

interface IIdentificationProps {
  /** used for changign the agency - note that only select users will be able to edit this field */
  agencies: SelectOptions;
  /** pass the options for classifications */
  classifications: SelectOptions;
  /** used for determining nameSpace of field */
  nameSpace?: any;
  /** for list fields (eg. buildings, financials) */
  index?: any;
  /** handle the population of Geocoder information */
  handleGeocoderChanges: (data: IGeocoderResponse, nameSpace?: string) => Promise<void>;
  /** help set the cursor type when click the add marker button */
  setMovingPinNameSpace: (nameSpace?: string) => void;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string, nameSpace?: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string, nameSpace?: string) => void;
  /** Function that searches for a parcel matching a pid within the API */
  findMatchingPid?: (pid: string, nameSpace?: string | undefined) => Promise<IParcel | undefined>;
  /** whether or not this user has property admin priviledges */
  isPropertyAdmin: boolean;
  /** whether or not this form is being displayed as part of a view or update */
  isViewOrUpdate: boolean;
  /** whether or not the fields on this form can be interacted with */
  disabled?: boolean;
}

const StyledProjectNumbers = styled.div`
  flex-direction: column;
  display: flex;
`;

export const ParcelIdentificationForm: React.FC<IIdentificationProps> = ({
  nameSpace,
  index,
  handleGeocoderChanges,
  setMovingPinNameSpace,
  handlePidChange,
  handlePinChange,
  findMatchingPid,
  isPropertyAdmin,
  isViewOrUpdate,
  disabled,
  ...props
}) => {
  const [overrideData, setOverrideData] = useState<IParcel>();

  const agencies = (props.agencies ?? []).map(c => mapSelectOptionWithParent(c, props.agencies));
  const formikProps = useFormikContext<ISteppedFormValues<IParcel>>();
  const agency = getIn(formikProps.values, withNameSpace(nameSpace, 'agencyId'));
  const { lookupCodes } = useCodeLookups();
  const { propertyTypeId, latitude, longitude } = getIn(formikProps.values, nameSpace);
  const projectNumbers = getIn(formikProps.values, 'data.projectNumbers');
  const agencyId = getIn(formikProps.values, `data.agencyId`);
  const [privateProject, setPrivateProject] = useState(false);

  return (
    <Container>
      {propertyTypeId === PropertyTypes.SUBDIVISION && (
        <Row noGutters className="section">
          <AddParentParcelsForm
            nameSpace={nameSpace}
            findMatchingPid={findMatchingPid}
            disabled={disabled}
          />
        </Row>
      )}
      <Row>
        <h4>Parcel Identification</h4>
      </Row>
      {!disabled && (
        <>
          {isViewOrUpdate || propertyTypeId === PropertyTypes.SUBDIVISION ? (
            <MovePinForm {...{ setMovingPinNameSpace, nameSpace }} />
          ) : (
            <LandSearchForm
              {...{
                setMovingPinNameSpace,
                nameSpace,
                handleGeocoderChanges,
                handlePidChange,
                handlePinChange,
              }}
            />
          )}
        </>
      )}
      <Row
        noGutters
        className={classNames('section', latitude === '' && longitude === '' ? 'disabled' : '')}
      >
        <Col md={12}>
          <h5>Parcel Details</h5>
        </Col>
        <Col md={6}>
          {propertyTypeId !== PropertyTypes.SUBDIVISION && (
            <PidPinForm
              nameSpace={nameSpace}
              handlePidChange={noop}
              handlePinChange={noop}
              disabled={disabled}
            />
          )}
          <AddressForm
            onGeocoderChange={(selection: IGeocoderResponse) => {
              const administrativeArea = selection.administrativeArea
                ? lookupCodes.find(code => {
                    return (
                      code.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME &&
                      code.name === selection.administrativeArea
                    );
                  })
                : undefined;
              if (administrativeArea) {
                selection.administrativeArea = administrativeArea.name;
              }
              const updatedPropertyDetail = {
                ...getIn(formikProps.values, withNameSpace(nameSpace, '')),
                latitude: selection.latitude,
                longitude: selection.longitude,
                address: {
                  ...getIn(formikProps.values, withNameSpace(nameSpace, 'address')),
                  line1: selection.address1,
                  administrativeArea: selection.administrativeArea,
                },
              };
              if (!getIn(formikProps.values, withNameSpace(nameSpace, 'latitude'))) {
                formikProps.setFieldValue(withNameSpace(nameSpace, ''), updatedPropertyDetail);
              } else {
                setOverrideData(updatedPropertyDetail);
              }
            }}
            {...formikProps}
            disabled={disabled}
            nameSpace={withNameSpace(nameSpace, 'address')}
          />
          <Form.Row>
            <Form.Label>{agency?.parent ? 'Sub Agency' : 'Agency'}</Form.Label>
            <ParentSelect
              required
              field={withNameSpace(nameSpace, 'agencyId')}
              options={agencies}
              filterBy={['code', 'label', 'parent']}
              disabled={!isPropertyAdmin || disabled}
            />
            {agency?.parent && (
              <Form.Row>
                <Form.Label>Agency</Form.Label>
                <FastInput
                  formikProps={formikProps}
                  field="parent"
                  disabled
                  value={agency.parent}
                  style={{ marginLeft: '5px' }}
                />
              </Form.Row>
            )}
          </Form.Row>
        </Col>
        <Col md={6} className="form-container">
          <Form.Row>
            <Label>Name</Label>
            <FastInput
              disabled={disabled}
              field={withNameSpace(nameSpace, 'name')}
              formikProps={formikProps}
            />
          </Form.Row>
          <Form.Row>
            <Label>Description</Label>
            <TextArea disabled={disabled} field={withNameSpace(nameSpace, 'description')} />
          </Form.Row>
          <Form.Row>
            <Label>Legal Description</Label>
            <TextArea
              disabled={disabled}
              field={withNameSpace(nameSpace, 'landLegalDescription')}
              displayErrorTooltips
            />
          </Form.Row>
          <Form.Row>
            <Label>Lot Size</Label>

            <InputGroup
              displayErrorTooltips
              fast={true}
              disabled={disabled}
              type="number"
              field={withNameSpace(nameSpace, 'landArea')}
              formikProps={formikProps}
              postText="Hectares"
              required
            />
          </Form.Row>
          {!!projectNumbers?.length && (
            <Form.Row>
              <Label style={{ marginTop: '1rem' }}>Project Number(s)</Label>
              <StyledProjectNumbers>
                {projectNumbers.map((projectNum: string) => (
                  <ProjectNumberLink
                    key={projectNum}
                    projectNumber={projectNum}
                    agencyId={agencyId}
                    setPrivateProject={setPrivateProject}
                    privateProject={privateProject}
                  />
                ))}
              </StyledProjectNumbers>
            </Form.Row>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="input-medium harmful">
            <p>
              Would this information be harmful if released?&nbsp;
              <TooltipWrapper toolTipId="sensitive-harmful" toolTip={sensitiveTooltip}>
                <a target="_blank" rel="noopener noreferrer" href={HARMFUL_DISCLOSURE_URL}>
                  Policy
                </a>
              </TooltipWrapper>
            </p>
            <Check
              type="radio"
              field={withNameSpace(nameSpace, 'isSensitive')}
              radioLabelOne="Yes"
              radioLabelTwo="No"
              disabled={disabled}
            />
          </div>
        </Col>
      </Row>
      <GenericModal
        display={!!overrideData}
        title="Update Form Details"
        okButtonText="Update"
        cancelButtonText="Cancel"
        handleOk={() => {
          formikProps.setFieldValue(withNameSpace(nameSpace, ''), overrideData);
          setOverrideData(undefined);
        }}
        handleCancel={() => {
          setOverrideData(undefined);
        }}
        message={
          <>
            <p>
              Would you like to update this form using the Geocoder data for the updated address?
            </p>
            <h5>New Values:</h5>
            <ListGroup>
              <ListGroup.Item>Latitude: {overrideData?.latitude}</ListGroup.Item>
              <ListGroup.Item>Longitude: {overrideData?.longitude}</ListGroup.Item>
              <ListGroup.Item>Address: {overrideData?.address?.line1}</ListGroup.Item>
              <ListGroup.Item>Location: {overrideData?.address?.administrativeArea}</ListGroup.Item>
            </ListGroup>
          </>
        }
      />
    </Container>
  );
};
