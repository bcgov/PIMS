import {
  Check,
  FastInput,
  FastSelect,
  Input,
  SelectOptions,
  TextArea,
} from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { BuildingSvg } from 'components/common/Icons';
import { Label } from 'components/common/Label';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { getIn, useFormikContext } from 'formik';
import { noop } from 'lodash';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';

const StyledProjectNumbers = styled.div`
  flex-direction: column;
  display: flex;
`;

interface IBuildingDetailsProps {
  withNameSpace: Function;
  disabled: boolean;
  agencies: any;
  classifications: any;
  predominateUses: SelectOptions;
  constructionType: SelectOptions;
  editInfo: {
    identification: boolean;
    tenancy: boolean;
    valuation: boolean;
  };
  setEditInfo: Dispatch<SetStateAction<object>>;
}

/**
 * @description For buildings, displays building details
 * @param {IBuildingDetailsProps} props
 * @returns React component.
 */
export const BuildingDetails: React.FC<any> = (props: IBuildingDetailsProps) => {
  const {
    withNameSpace,
    disabled,
    agencies,
    classifications,
    predominateUses,
    constructionType,
    editInfo,
    setEditInfo,
  } = props;

  const formikProps = useFormikContext();
  const projectNumbers = getIn(formikProps.values, withNameSpace('projectNumbers'));
  const agencyId = getIn(formikProps.values, withNameSpace('agencyId'));
  const [privateProject, setPrivateProject] = useState(false);

  return (
    <Col md={6} style={{ paddingRight: '10px' }}>
      <Row>
        <div className="identification">
          <Row className="section-header">
            <Col md="auto">
              <span>
                <BuildingSvg className="svg" />
                <h5>Building Identification</h5>
              </span>
            </Col>
            {!disabled && (
              <Col md="auto">
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() =>
                    setEditInfo({
                      ...editInfo,
                      identification: formikProps.isValid && !editInfo.identification,
                    })
                  }
                />
              </Col>
            )}
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Agency</Label>
            </Col>
            <Col md="auto">
              <ParentSelect
                field={withNameSpace('agencyId')}
                options={agencies}
                filterBy={['code', 'label', 'parent']}
                disabled={true}
              />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Building Name</Label>
            </Col>
            <Col md="auto">
              <Input disabled={editInfo.identification} field={withNameSpace('name')} />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Description</Label>
            </Col>
            <Col md="auto">
              <TextArea disabled={editInfo.identification} field={withNameSpace('description')} />
            </Col>
          </Row>

          <AddressForm
            onGeocoderChange={noop}
            {...formikProps}
            disabled={true}
            nameSpace={withNameSpace('address')}
            disableCheckmark
            disableStreetAddress
            buildingReviewStyles
          />
          <br></br>
          <Row className="content-item">
            <Col md="auto">
              <Label>Latitude</Label>
            </Col>
            <Col md="auto">
              <FastInput
                className="input-medium"
                displayErrorTooltips
                formikProps={formikProps}
                disabled={true}
                type="number"
                field={withNameSpace('latitude')}
                required
              />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Longitude</Label>
            </Col>
            <Col md="auto">
              <FastInput
                className="input-medium"
                displayErrorTooltips
                formikProps={formikProps}
                disabled={true}
                type="number"
                field={withNameSpace('longitude')}
                required
              />
            </Col>
          </Row>
          <br></br>
          <Row className="content-item">
            <Col md="auto">
              <Label>SRES Classification</Label>
            </Col>
            <Col md="auto">
              <span className="vl"></span>
            </Col>
            <Col md="auto">
              <FastSelect
                formikProps={formikProps}
                disabled={editInfo.identification}
                placeholder="Must Select One"
                field={withNameSpace('classificationId')}
                type="number"
                options={classifications}
                required
              />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Main Usage</Label>
            </Col>
            <Col md="auto">
              <FastSelect
                formikProps={formikProps}
                disabled={editInfo.identification}
                placeholder="Must Select One"
                field={withNameSpace('buildingPredominateUseId')}
                type="number"
                options={predominateUses}
                required
              />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Type of Construction</Label>
            </Col>
            <Col md="auto">
              <FastSelect
                formikProps={formikProps}
                disabled={editInfo.identification}
                placeholder="Must Select One"
                field={withNameSpace('buildingConstructionTypeId')}
                type="number"
                options={constructionType}
                required
              />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Number of Floors</Label>
            </Col>
            <Col md="auto">
              <FastInput
                displayErrorTooltips
                className="input-small"
                formikProps={formikProps}
                disabled={editInfo.identification}
                field={withNameSpace('buildingFloorCount')}
                type="number"
              />
            </Col>
          </Row>
          {!!projectNumbers?.length && (
            <Row style={{ marginTop: '1rem' }}>
              <Col md="auto">
                <Label>Project Number(s)</Label>
              </Col>
              <Col md="auto">
                <StyledProjectNumbers>
                  {projectNumbers.map((projectNum: string) => (
                    <ProjectNumberLink
                      projectNumber={projectNum}
                      key={projectNum}
                      agencyId={agencyId}
                      setPrivateProject={setPrivateProject}
                      privateProject={privateProject}
                    />
                  ))}
                </StyledProjectNumbers>
              </Col>
            </Row>
          )}
          <Row className="sensitive check-item">
            <Col md="auto">
              <Label>Harmful if info released?</Label>
            </Col>
            <Col md="auto">
              <Check
                type="radio"
                disabled={editInfo.identification}
                field={withNameSpace('isSensitive')}
                radioLabelOne="Yes"
                radioLabelTwo="No"
              />
            </Col>
          </Row>
        </div>
      </Row>
    </Col>
  );
};
