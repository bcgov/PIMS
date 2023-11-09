import './BuildingDetails.scss';

import { Box, Grid, Stack, Typography } from '@mui/material';
import {
  Check,
  FastInput,
  FastSelect,
  Input,
  SelectOptions,
  TextArea,
} from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { Label } from 'components/common/Label';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';
import { getIn, useFormikContext } from 'formik';
import React, { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';

import { HeaderDivider } from './HeaderDivider';
import { tabStyles } from './TabStyles';

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

const StyledProjectNumbers = styled.div`
  flex-direction: column;
  display: flex;
`;

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

  interface IAddress {
    administrativeArea: string;
    line1: string; // This is the street number and name.
    postal: string;
    province: string;
    provinceId: string;
  }
  const address: IAddress = getIn(formikProps.values, withNameSpace('address'));

  // Style Constants
  const { leftColumnWidth, rightColumnWidth, boldFontWeight, fontSize, headerColour } = tabStyles;
  const rightColumnStyle: CSSProperties = { display: 'flex', justifyContent: 'left' };
  const fieldFontWeight = 600;
  const fieldFontSize = 'small';

  return (
    <div className="identification">
      <Box sx={{ p: 2, background: 'white' }}>
        {/* HEADER */}
        <Stack direction={'row'} spacing={1}>
          <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
            Building Identification
          </Typography>
          {!disabled && (
            <Box sx={{ pl: 1 }}>
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
            </Box>
          )}
        </Stack>
        <HeaderDivider />

        {/* CONTENT */}
        <Grid container sx={{ textAlign: 'left' }} rowSpacing={1}>
          {/* AGENCY FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Agency:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth}>
            <ParentSelect
              field={withNameSpace('agencyId')}
              options={agencies}
              filterBy={['code', 'label', 'parent']}
              disabled={true}
            />
          </Grid>

          {/* BUILDING NAME FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Building Name:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Input
              disabled={editInfo.identification}
              field={withNameSpace('name')}
              className="building-details-name"
            />
          </Grid>

          {/* DESCRIPTION FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Description:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <TextArea disabled={editInfo.identification} field={withNameSpace('description')} />
          </Grid>

          {/* STREET ADDRESS FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Street Address:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Typography fontWeight={fieldFontWeight} fontSize={fieldFontSize}>
              {address?.line1 ?? ''}
            </Typography>
          </Grid>

          {/* LOCATION FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Location:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Typography fontWeight={fieldFontWeight} fontSize={fieldFontSize}>
              {address?.administrativeArea ?? ''}
            </Typography>
          </Grid>

          {/* PROVINCE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Province:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Typography fontWeight={fieldFontWeight} fontSize={fieldFontSize}>
              {address?.province ?? ''}
            </Typography>
          </Grid>

          {/* POSTAL CODE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Postal Code:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Typography fontWeight={fieldFontWeight} fontSize={fieldFontSize}>
              {address?.postal ?? ''}
            </Typography>
          </Grid>

          {/* LATITUDE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Latitude:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <FastInput
              className="input-medium"
              displayErrorTooltips
              formikProps={formikProps}
              disabled={true}
              type="number"
              field={withNameSpace('latitude')}
              required
            />
          </Grid>

          {/* LONGITUDE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Longitude:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <FastInput
              className="input-medium"
              displayErrorTooltips
              formikProps={formikProps}
              disabled={true}
              type="number"
              field={withNameSpace('longitude')}
              required
            />
          </Grid>

          {/* SRES CLASSIFICATION FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>SRES Classification:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <FastSelect
              formikProps={formikProps}
              disabled={editInfo.identification}
              placeholder="Must Select One"
              field={withNameSpace('classificationId')}
              type="number"
              options={classifications}
              required
            />
          </Grid>

          {/* MAIN USAGE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Main Usage:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <FastSelect
              formikProps={formikProps}
              disabled={editInfo.identification}
              placeholder="Must Select One"
              field={withNameSpace('buildingPredominateUseId')}
              type="number"
              options={predominateUses}
              required
            />
          </Grid>

          {/* TYPE OF CONSTRUCTION FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Type of Construction:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <FastSelect
              formikProps={formikProps}
              disabled={editInfo.identification}
              placeholder="Must Select One"
              field={withNameSpace('buildingConstructionTypeId')}
              type="number"
              options={constructionType}
              required
            />
          </Grid>

          {/* NUMBER OF FLOORS FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Number of Floors:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <FastInput
              displayErrorTooltips
              className="input-small"
              formikProps={formikProps}
              disabled={editInfo.identification}
              field={withNameSpace('buildingFloorCount')}
              type="number"
            />
          </Grid>
        </Grid>
      </Box>

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

      {/* Harmful if released? */}
      <Box
        sx={{
          mt: '15px',
          p: 2,
          background: 'white',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack direction="row" spacing={1}>
          <Typography sx={{ fontWeight: boldFontWeight }}>Harmful info if released?</Typography>
          <Check
            type="radio"
            field={withNameSpace('isSensitive')}
            radioLabelOne="Yes"
            radioLabelTwo="No"
            disabled={editInfo.identification}
          />
        </Stack>
      </Box>
    </div>
  );
};
