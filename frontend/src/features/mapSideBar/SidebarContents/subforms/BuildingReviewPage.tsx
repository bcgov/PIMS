import './LandReviewPage.scss';

import { Box, Tab, Tabs } from '@mui/material';
import { IParcel } from 'actions/parcelsActions';
import { SelectOptions } from 'components/common/form';
import { BuildingDetails } from 'features/mapSideBar/components/tabs/BuildingDetails';
import { OccupancyValuation } from 'features/mapSideBar/components/tabs/OccupancyValuation';
import { FormikTable } from 'features/projects/common';
import { getAssociatedLandCols } from 'features/properties/components/forms/subforms/columns';
import { getIn, useFormikContext } from 'formik';
import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface IReviewProps {
  nameSpace?: string;
  classifications: any;
  predominateUses: SelectOptions;
  constructionType: SelectOptions;
  occupantTypes: SelectOptions;
  agencies: any;
  disabled: boolean;
  isPropertyAdmin: boolean;
}

export const BuildingReviewPage: React.FC<any> = (props: IReviewProps) => {
  const { nameSpace, classifications, predominateUses, constructionType, agencies, disabled } =
    props;
  const formikProps = useFormikContext();
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
    },
    [nameSpace],
  );
  const navigate: NavigateFunction = useNavigate();

  const onRowClick = (data: IParcel) => {
    navigate(`/mapview?sidebar=true&parcelId=${data.id}`);
  };
  const defaultEditValues = useMemo(
    () => ({
      identification: disabled || formikProps.isValid,
      tenancy: disabled || formikProps.isValid,
      valuation: disabled || formikProps.isValid,
    }),
    [formikProps.isValid, disabled],
  );
  const [editInfo, setEditInfo] = useState(defaultEditValues);

  const parcels = getIn(formikProps.values, withNameSpace('parcels'));

  // Tabs.
  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container className="review-section">
      <Row className="review-steps">
        <h4>Review your building info</h4>
        <p>
          Please review the information you have entered. You can edit it by clicking on the edit
          icon for each section. When you are satisfied that the information provided is correct,
          click the submit button to save this information to the PIMS inventory.
        </p>
      </Row>

      <Box>
        {/* TABS */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="building review tab">
            <Tab label="Building Details" id="building-details-tab" />
            <Tab label="Occupancy & Valuation" id="occupancy-valuation-tab" />
            <Tab label="Associated Land" id="associated-land-tab" />
          </Tabs>
        </Box>

        {/* BUILDING DETAILS TAB */}
        <Box role="tabpanel" hidden={tab !== 0} id="building-details-tabpanel">
          <BuildingDetails
            {...{
              withNameSpace,
              disabled,
              editInfo,
              setEditInfo,
              agencies,
              classifications,
              predominateUses,
              constructionType,
            }}
          />
        </Box>

        {/* OCCUPANCY & VALUATION TAB */}
        <Box role="tabpanel" hidden={tab !== 1} id="occupancy-valuation-tabpanel">
          <OccupancyValuation
            {...{ withNameSpace, disabled, editInfo, setEditInfo, classifications }}
          />
        </Box>

        {/* ASSOCIATED LAND TAB */}
        <Box role="tabpanel" hidden={tab !== 2} id="associated-land-tabpanel">
          {parcels?.length > 0 ? (
            <FormikTable
              field="data.parcels"
              name="parcels"
              columns={getAssociatedLandCols()}
              clickableTooltip="Click to view Land details"
              onRowClick={onRowClick}
            />
          ) : (
            <p
              style={{
                display: 'flex',
                margin: '1em',
                color: 'GrayText',
                fontSize: '11pt',
              }}
            >
              No associated land.
            </p>
          )}
        </Box>
      </Box>
    </Container>
  );
};
