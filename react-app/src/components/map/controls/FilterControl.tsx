import MultiselectFormField from '@/components/form/MultiselectFormField';
import TextFormField from '@/components/form/TextFormField';
import useGroupedAgenciesApi from '@/hooks/api/useGroupedAgenciesApi';
import { MapFilter } from '@/hooks/api/usePropertiesApi';
// import useDataLoader from '@/hooks/useDataLoader';
// import usePimsApi from '@/hooks/usePimsApi';
import { Close, FilterAlt } from '@mui/icons-material';
import { Box, Paper, SxProps, Typography, useTheme, Grid, IconButton, Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FilterControlProps {
  setFilter: Dispatch<SetStateAction<{}>>;
}

const FilterControl = (props: FilterControlProps) => {
  const {setFilter} = props;
  const [open, setOpen] = useState<boolean>(false);
  const [fading, setFading] = useState<boolean>(false);
  const theme = useTheme();
  // const api = usePimsApi();

  // Get lists for dropdowns
  const agencyOptions = useGroupedAgenciesApi().agencyOptions;

  // const {data, loadOnce} = useDataLoader(api)

  const closedStyle: SxProps = {
    height: '25px',
    width: '25px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.gray.main,
    },
  };
  const openStyle: SxProps = {
    height: '500px',
    width: '300px',
  };
  const style = open ? openStyle : closedStyle;

  const formMethods = useForm({
    defaultValues: {
      PID: '',
      PIN: '',
      Address: '',
      Agencies: [],
      AdministrativeAreas: [],
      Classifications: [],
      PropertyTypes: [],
      Name: '',
    },
  });

  return (
    <Box
      component={Paper}
      sx={{
        padding: '1em',
        transition: 'all 0.1s ease-in-out',
        ...style,
      }}
      onClick={(e) => {
        // Handles a delayed fade in if opening the filter
        if (!open) {
          setFading(true);
          setOpen(true);
          setTimeout(() => {
            setFading(false);
          }, 100);
        }
      }}
    >
      {open ? (
        <Box
          sx={{
            opacity: fading ? 0 : 1,
            transition: 'all 0.3s ease-in',
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
                <IconButton
                  onClick={(e) => {
                    setOpen(false);
                  }}
                >
                  <Close />
                </IconButton>
              </Grid>
              <TextFormField fullWidth name={'PID'} label={`PID`}></TextFormField>
              <TextFormField fullWidth numeric name={'PIN'} label={`PIN`}></TextFormField>
              <TextFormField fullWidth name={'Address'} label={`Address`}></TextFormField>
              <TextFormField fullWidth name={'Name'} label={`Name`}></TextFormField>
              <MultiselectFormField
                name={'Agencies'}
                label={'Agencies'}
                options={agencyOptions}
                allowNestedIndent
                {...{
                  limitTags: 2,
                }}
              />

              <Grid item xs={12} justifyContent={'space-between'} display={'inline-flex'} gap={1}>
                <Button variant="outlined" fullWidth onClick={() => {
                  setFilter({});
                  formMethods.reset();
                }}>
                  Clear
                </Button>
                <Button variant="contained" fullWidth onClick={() => {
                  const formValues = formMethods.getValues();
                  console.log(formValues)
                  const newFilter: MapFilter = {
                    PID: !isNaN(parseInt(formValues.PID.replace(/-/g,'').trim())) ? parseInt(formValues.PID.replace(/-/g,'').trim()) :  undefined,
                    PIN: !isNaN(parseInt(formValues.PIN)) ? parseInt(formValues.PIN) : undefined,
                    Name: formValues.Name && formValues.Name.trim().length ? formValues.Name.trim() : undefined,
                    Address: formValues.Address && formValues.Address.trim().length ? formValues.Address.trim() : undefined,
                    AgencyIds: formValues.Agencies.map(a => a.value),
                  }
                  console.log(newFilter)
                  setFilter(newFilter);
                }}>
                  Filter
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      ) : (
        <FilterAlt />
      )}
    </Box>
  );
};

export default FilterControl;
