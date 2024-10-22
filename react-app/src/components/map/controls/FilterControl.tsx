import MultiselectFormField from '@/components/form/MultiselectFormField';
import TextFormField from '@/components/form/TextFormField';
import { Roles } from '@/constants/roles';
import { UserContext } from '@/contexts/userContext';
import { LookupContext } from '@/contexts/lookupContext';
import useGroupedAgenciesApi from '@/hooks/api/useGroupedAgenciesApi';
import { MapFilter } from '@/hooks/api/usePropertiesApi';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import { Box, Typography, Grid, Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ProjectStatus } from '@/constants/projectStatuses';
import ToggleSwitch from '@/components/form/SwitchToggle';

interface FilterControlProps {
  setFilter: Dispatch<SetStateAction<MapFilter>>;
  filter: MapFilter;
}

/**
 * FilterControl component renders a filter control interface for filtering inventory items.
 * It includes dropdowns for selecting agencies, administrative areas, classifications, and property types.
 * Users can input PID, PIN, Address, etc. for filtering purposes.
 * The component allows users to clear the filter or apply the selected filter criteria.
 *
 * @param {FilterControlProps} props - Props for the FilterControl component.
 * @returns {JSX.Element} A React component representing the filter control interface.
 */
const FilterControl = (props: FilterControlProps) => {
  const { setFilter, filter } = props;
  const api = usePimsApi();
  const user = useContext(UserContext);
  const { data: lookupData } = useContext(LookupContext);

  // Get lists for dropdowns
  const { agencyOptions } = useGroupedAgenciesApi();
  const { data: usersAgenciesData, loadOnce: loadUsersAgencies } = useDataLoader(() =>
    api.users.getUsersAgencyIds(user.pimsUser.data?.Username),
  );

  loadUsersAgencies();

  // Initial form values
  const formMethods = useForm({
    defaultValues: {
      PID: '',
      PIN: '',
      Address: '',
      Agencies: [],
      AdministrativeAreas: [],
      Classifications: [],
      PropertyTypes: [],
      RegionalDistricts: [],
      Name: '',
      InERP: false,
    },
  });

  return (
    <Box
      sx={{
        padding: '1em',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
      }}
    >
      <FormProvider {...formMethods}>
        <Grid container gap={1}>
          <Grid
            item
            xs={12}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={'1em'}
          >
            <Typography variant="h4">Inventory Filter</Typography>
          </Grid>
          <TextFormField fullWidth name={'PID'} label={`PID`} isPid></TextFormField>
          <TextFormField fullWidth numeric name={'PIN'} label={`PIN`}></TextFormField>
          <TextFormField fullWidth name={'Address'} label={`Address`}></TextFormField>
          <TextFormField fullWidth name={'Name'} label={`Name`}></TextFormField>
          <MultiselectFormField
            name={'Agencies'}
            label={'Agencies'}
            // Only return options that should be visible based on user's agency/role
            options={
              agencyOptions?.filter(
                (option) =>
                  user.pimsUser?.hasOneOfRoles([Roles.ADMIN, Roles.AUDITOR]) ||
                  usersAgenciesData?.includes(option.value),
              ) ?? []
            }
            allowNestedIndent
          />
          <MultiselectFormField
            name={'AdministrativeAreas'}
            label="Administrative Areas"
            options={
              lookupData?.AdministrativeAreas.filter((aa) => !aa.IsDisabled).map((aa) => ({
                label: aa.Name,
                value: aa.Id,
              })) ?? []
            }
          />
          <MultiselectFormField
            name={'RegionalDistricts'}
            label="Regional Districts"
            options={
              lookupData?.RegionalDistricts.map((rd) => ({
                label: rd.Name,
                value: rd.Id,
              })) ?? []
            }
          />
          <MultiselectFormField
            name={'Classifications'}
            label="Classifications"
            options={
              lookupData?.Classifications.map((c) => ({
                label: c.Name,
                value: c.Id,
              })) ?? []
            }
          />
          <MultiselectFormField
            name={'PropertyTypes'}
            label="Property Types"
            options={
              lookupData?.PropertyTypes.map((pt) => ({
                label: pt.Name,
                value: pt.Id,
              })) ?? []
            }
          />
          <ToggleSwitch name={'InERP'} label="In ERP" />
          <Grid item xs={12} justifyContent={'space-between'} display={'inline-flex'} gap={1}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setFilter({ Polygon: filter.Polygon });
                formMethods.reset();
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                const formValues = formMethods.getValues();
                const newFilter: MapFilter = {
                  PID: !isNaN(parseInt(formValues.PID.replace(/-/g, '').trim()))
                    ? parseInt(formValues.PID.replace(/-/g, '').trim())
                    : undefined,
                  PIN: !isNaN(parseInt(formValues.PIN)) ? parseInt(formValues.PIN) : undefined,
                  Name:
                    formValues.Name && formValues.Name.trim().length
                      ? formValues.Name.trim()
                      : undefined,
                  Address:
                    formValues.Address && formValues.Address.trim().length
                      ? formValues.Address.trim()
                      : undefined,
                  AgencyIds: formValues.Agencies.map((option) => option.value),
                  ClassificationIds: formValues.Classifications.map((option) => option.value),
                  PropertyTypeIds: formValues.PropertyTypes.map((option) => option.value),
                  AdministrativeAreaIds: formValues.AdministrativeAreas.map(
                    (option) => option.value,
                  ),
                  RegionalDistrictIds: formValues.RegionalDistricts.map((option) => option.value),
                  ProjectStatusId: formValues.InERP ? ProjectStatus.APPROVED_FOR_ERP : undefined,
                };
                setFilter({
                  Polygon: filter.Polygon,
                  ...newFilter,
                });
              }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};

export default FilterControl;
