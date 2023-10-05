import './LandReviewPage.scss';

import { Box, Tab, Tabs } from '@mui/material';
import { IBuilding } from 'actions/parcelsActions';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { ParcelDetails } from 'features/mapSideBar/components/tabs/ParcelDetails';
import { TitleOwnership } from 'features/mapSideBar/components/tabs/TitleOwnership';
import { UsageValuation } from 'features/mapSideBar/components/tabs/UsageValuation';
import { FormikTable } from 'features/projects/common';
import { getAssociatedBuildingsCols } from 'features/properties/components/forms/subforms/columns';
import { getIn, useFormikContext } from 'formik';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface IReviewProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
  agencies: any;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string) => void;
  isPropertyAdmin: boolean;
}

export const LandReviewPage: React.FC<any> = (props: IReviewProps) => {
  const { agencies, disabled, classifications, nameSpace } = props;
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
    },
    [nameSpace],
  );
  const formikProps = useFormikContext();
  const navigate: NavigateFunction = useNavigate();

  const onRowClick = (data: IBuilding) => {
    navigate(`/mapview?sidebar=true&buildingId=${data.id}`);
  };

  const defaultEditValues = useMemo(
    () => ({
      identification: disabled || formikProps.isValid,
      usage: disabled || formikProps.isValid,
      valuation: disabled || formikProps.isValid,
    }),
    [formikProps.isValid, disabled],
  );
  const [editInfo, setEditInfo] = useState(defaultEditValues);

  // Tabs.
  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const buildings = getIn(formikProps.values, withNameSpace('buildings'));

  // Get LTSA Info and store in state
  const [ltsa, setLTSA] = useState<ILTSAOrderModel | undefined>(undefined);

  useEffect(() => {
    getLTSAInfo();
  }, [formikProps]);

  // Pulls information from formik state (set when sidebar is opened)
  const getLTSAInfo = useCallback(async () => {
    const ltsaInfo: ILTSAOrderModel | undefined = await getIn(
      formikProps.values,
      withNameSpace('ltsa'),
    );
    if (ltsaInfo) {
      setLTSA(ltsaInfo);
    }
  }, [formikProps]);

  return (
    <Container className="review-section">
      <Row className="review-steps">
        <h4>Review your land info</h4>
        <p>
          You can edit some information by clicking on the edit icon for each section. When you are
          satisfied that the information provided is correct, click the submit button to save to the
          PIMS inventory.
        </p>
      </Row>

      <Box>
        {/* TABS */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="property review tabs">
            <Tab label="Parcel Details" id="parcel-details-tab" />
            <Tab label="Usage & Valuation" id="usage-valuation-tab" />
            <Tab label="Title & Ownership Details" id="title-ownership-tab" />
            <Tab label="Associated Buildings" id="associated-buildings-tab" />
          </Tabs>
        </Box>

        {/* PARCEL DETAILS TAB */}
        <Box role="tabpanel" hidden={tab !== 0} id="parcel-details-tabpanel">
          <ParcelDetails {...{ withNameSpace, editInfo, setEditInfo, agencies, disabled }} />
        </Box>

        {/* USAGE & VALUATION TAB */}
        <Box role="tabpanel" hidden={tab !== 1} id="usage-valuation-tabpanel">
          <UsageValuation
            {...{ withNameSpace, editInfo, setEditInfo, disabled, classifications }}
          />
        </Box>

        {/* TITLE & OWNERSHIP TAB */}
        <Box role="tabpanel" hidden={tab !== 2} id="title-ownership-tabpanel">
          <TitleOwnership {...{ ltsa }} />
        </Box>

        {/* ASSOCIATED BUILDINGS TAB */}
        <Box role="tabpanel" hidden={tab !== 3} id="associated-buildings-tabpanel">
          {buildings?.length > 0 ? (
            <FormikTable
              field="data.buildings"
              name="buildings"
              columns={getAssociatedBuildingsCols()}
              clickableTooltip="Click to view building details"
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
              No associated buildings.
            </p>
          )}
        </Box>
      </Box>
    </Container>
  );
};
