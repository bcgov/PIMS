import { Box, Grid, Stack, Typography } from '@mui/material';
import { ILookupCode } from 'actions/ILookupCode';
import { Check, FastInput, Input, InputGroup, Select, TextArea } from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';
import * as API from 'constants/API';
import { HeaderDivider } from 'features/mapSideBar/components/tabs/HeaderDivider';
import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { getIn, useFormikContext } from 'formik';
import _ from 'lodash';
import React, { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useAppSelector } from 'store';
import styled from 'styled-components';
import { mapLookupCode } from 'utils';

interface IParcelDetailsProps {
  withNameSpace: Function;
  disabled?: boolean;
  agencies: any;
  editInfo: {
    identification: boolean;
    usage: boolean;
    valuation: boolean;
  };
  setEditInfo: Dispatch<SetStateAction<object>>;
}

export const ParcelDetails: React.FC<any> = (props: IParcelDetailsProps) => {
  const { withNameSpace, disabled, agencies, editInfo, setEditInfo } = props;
  const formikProps = useFormikContext();

  const projectNumbers = getIn(formikProps.values, withNameSpace('projectNumbers'));
  const agencyId = getIn(formikProps.values, withNameSpace('agencyId'));
  const [privateProject, setPrivateProject] = useState(false);

  // Style Constants
  const leftColumnWidth = 3;
  const rightColumnWidth = 12 - leftColumnWidth;
  const boldFontWeight = 700;
  const fontSize = 14;
  const rightColumnStyle: CSSProperties = { display: 'flex', justifyContent: 'left' };
  const StyledProjectNumbers = styled.div`
    flex-direction: column;
    display: flex;
  `;
  const headerColour = '#1a57c7';

  // Address form:
  const lookupCodes = useAppSelector((store) => store.lookupCode.lookupCodes);
  const provinces = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROVINCE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const administrativeAreas = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME;
  }).map(mapLookupCode);

  /**
   * postalCodeFormatter takes the specified postal code and formats it with a space in the middle
   * @param {string} postal The target postal to be formatted
   */
  const postalCodeFormatter = (postal: string) => {
    const regex = /([a-zA-z][0-9][a-zA-z])[\s-]?([0-9][a-zA-z][0-9])/;
    const format = postal.match(regex);
    if (format !== null && format.length === 3) {
      postal = `${format[1]} ${format[2]}`;
    }
    return postal.toUpperCase();
  };

  return (
    <div className="identification">
      <Box sx={{ p: 2, background: 'white' }}>
        {/* HEADER */}
        <Stack direction="row" spacing={1}>
          <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
            Parcel Identification
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
        <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
          {/* AGENCY FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Agency:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth}>
            <ParentSelect
              required
              field={withNameSpace('agencyId')}
              options={agencies}
              filterBy={['code', 'label', 'parent']}
              disabled={true}
            />
          </Grid>

          {/* NAME FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Name:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Input
              style={{ width: '100%' }}
              disabled={editInfo.identification}
              field={withNameSpace('name')}
            />
          </Grid>

          {/* PID PIN FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={14}>PID/PIN:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Stack direction="row" spacing={1}>
              {getIn(formikProps.values, withNameSpace('pid')) ? (
                <Input
                  customRowStyle={{ width: '33%' }}
                  displayErrorTooltips
                  className="input-small"
                  disabled={true}
                  required={true}
                  field={withNameSpace('pid')}
                />
              ) : (
                <Typography
                  sx={{
                    fontWeight: boldFontWeight,
                    fontSize: fontSize - 1,
                    alignSelf: 'center',
                    width: '33%',
                  }}
                >
                  none
                </Typography>
              )}
              <Typography
                sx={{ fontWeight: boldFontWeight, alignSelf: 'center', textAlign: 'center' }}
              >
                &nbsp;/&nbsp;
              </Typography>
              {getIn(formikProps.values, withNameSpace('pin')) ? (
                <Input
                  customRowStyle={{ width: '33%' }}
                  style={{ textAlign: 'center' }}
                  displayErrorTooltips
                  className="input-small"
                  disabled={true}
                  required={true}
                  field={withNameSpace('pin')}
                />
              ) : (
                <Typography
                  sx={{
                    fontWeight: boldFontWeight,
                    fontSize: fontSize - 1,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}
                >
                  none
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* DESCRIPTION FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Description:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <TextArea
              style={{ width: '30em', height: '6em' }}
              disabled={editInfo.identification}
              field={withNameSpace('description')}
            />
          </Grid>

          {/* LOT SIZE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Lot Size:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <InputGroup
              displayErrorTooltips
              fast={true}
              disabled={true}
              type="number"
              field={withNameSpace('landArea')}
              formikProps={formikProps}
              postText="Hectares"
            />
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
            />
          </Grid>

          {/* STREET ADDRESS FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Street Address:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <GeocoderAutoComplete
              tooltip={undefined}
              value={getIn(formikProps.values, withNameSpace('address.line1'))}
              disabled={true}
              field={withNameSpace('line1')}
              onSelectionChanged={() => {}}
              onTextChange={(value) =>
                formikProps.setFieldValue(withNameSpace('address.line1'), value)
              }
              error={getIn(formikProps.errors, withNameSpace('address.line1'))}
              touch={getIn(formikProps.touched, withNameSpace('address.line1'))}
              displayErrorTooltips
              required={true}
            />
          </Grid>

          {/* LOCATION FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Location:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <TypeaheadField
              options={administrativeAreas.map((x) => x.label)}
              name={withNameSpace('address.administrativeArea')}
              disabled={true}
              hideValidation={true}
              paginate={false}
              required
              displayErrorTooltips
            />
          </Grid>

          {/* PROVINCE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Province:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <Select
              disabled={true}
              placeholder="Must Select One"
              field={withNameSpace('address.provinceId')}
              options={provinces}
            />
          </Grid>

          {/* POSTAL CODE FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Postal Code:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <FastInput
              className="input-small"
              formikProps={formikProps}
              disabled={true}
              onBlurFormatter={(postal: string) =>
                postal.replace(postal, postalCodeFormatter(postal))
              }
              field={withNameSpace('address.postal')}
              displayErrorTooltips
            />
          </Grid>

          {/* LEGAL DESCRIPTION FIELD */}
          <Grid item xs={leftColumnWidth}>
            <Typography fontSize={fontSize}>Legal Description:</Typography>
          </Grid>
          <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
            <TextArea
              style={{ width: '30em', height: '6em' }}
              disabled={true}
              field={withNameSpace('landLegalDescription')}
            />
          </Grid>

          {/* PROJECT NUMBERS */}
          {!!projectNumbers?.length && (
            <>
              <Grid item xs={leftColumnWidth}>
                <Typography fontSize={fontSize}>Project Number(s):</Typography>
              </Grid>
              <Grid item xs={rightColumnWidth} sx={rightColumnStyle}>
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
              </Grid>
            </>
          )}
        </Grid>
      </Box>

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
