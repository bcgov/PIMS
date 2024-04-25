import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { NavigateBackButton } from '../display/DetailViewNavigation';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import { FormProvider, useForm } from 'react-hook-form';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete, Search } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import usePimsApi from '@/hooks/usePimsApi';
import { Parcel, ParcelEvaluation } from '@/hooks/api/useParcelsApi';
import { Building, BuildingEvaluation } from '@/hooks/api/useBuildingsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Agency } from '@/hooks/api/useAgencyApi';
import { ProjectPropertyIds } from '@/hooks/api/useProjectsApi';

interface IDisposalProjectSearch {
  rows: any[];
  setRows: (a: any[]) => void;
}

type ParcelWithType = Parcel & {
  Type: string;
};

type BuildingWithType = Building & {
  Type: string;
};

const DisposalProjectSearch = (props: IDisposalProjectSearch) => {
  const { rows, setRows } = props;
  const [autoCompleteVal, setAutoCompleteVal] = useState(null);
  const [fuzzySearchOptions, setFuzzySearchOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const api = usePimsApi();
  const theme = useTheme();

  const getAutoCompleteLabel = (input: ParcelWithType | BuildingWithType | string) => {
    if (typeof input === 'string') {
      return '';
    }

    if (input.PID) {
      return `${input.Type} - PID: ${input.PID}`;
    } else if (input.PIN) {
      return `${input.Type} - PIN: ${input.PIN}`;
    } else if (input.Address1) {
      return `${input.Type} - Address: ${input.Address1}`;
    } else {
      return `${input.Type} - No identifying info.`;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'Type',
      headerName: 'Type',
      flex: 1,
      maxWidth: 75,
    },
    {
      field: 'PID_Address',
      headerName: 'PID/Address',
      flex: 1,
      renderCell: (params) => {
        return (
          <Link
            to={`/properties/${params.row.Type.toLowerCase()}/${params.row.Id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.palette.primary.main }}
          >
            {params.row.Type === 'Building' && params.row.Address1
              ? params.row.Address1
              : params.row.PID}
          </Link>
        ) as ReactNode;
      },
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      valueGetter: (value: Agency) => value?.Name ?? 'N/A',
      flex: 1,
    },
    {
      field: 'EvaluationYears',
      headerName: 'Year',
      flex: 1,
      maxWidth: 75,
      valueGetter: (evaluationYears: number[]) => {
        return evaluationYears?.sort((a, b) => b - a)?.[0] ?? 'N/A'; //Sort in reverse order to obtain most recent year.
      },
    },
    {
      field: 'Evaluations',
      headerName: 'Assessed',
      maxWidth: 120,
      valueGetter: (evaluations: ParcelEvaluation[] | BuildingEvaluation[]) => {
        return evaluations?.sort((a, b) => b.Year - a.Year)[0]?.Value ?? 'N/A';
      },
      flex: 1,
    },
    {
      field: 'Actions',
      headerName: '',
      flex: 1,
      maxWidth: 60,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              const index = rows.findIndex((x) => x.Id === params.row.Id);
              if (index != null) {
                setRows([...rows.slice(0, index), ...rows.slice(index + 1)]);
              }
            }}
          >
            <Delete />
          </IconButton>
        ) as ReactNode;
      },
    },
  ];
  return (
    <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
      <Autocomplete
        freeSolo
        loading={loadingOptions}
        clearOnBlur={true}
        blurOnSelect={true}
        options={fuzzySearchOptions}
        onChange={(event, value) => {
          const row = value;
          if (row) {
            setRows([...rows, row]);
            setAutoCompleteVal('');
            setFuzzySearchOptions([]);
          }
        }}
        getOptionLabel={(option) => getAutoCompleteLabel(option)}
        getOptionKey={(option) => option.Id + option.Type}
        onInputChange={(_event, value) => {
          setLoadingOptions(true);
          api.properties.propertiesFuzzySearch(value).then((response) => {
            setLoadingOptions(false);
            setFuzzySearchOptions([
              ...response.Parcels.map((a) => ({
                ...a,
                Type: 'Parcel',
                EvaluationYears: a.Evaluations.map((e) => e.Year),
              })),
              ...response.Buildings.map((a) => ({
                ...a,
                Type: 'Building',
                EvaluationYears: a.Evaluations.map((e) => e.Year),
              })),
            ]);
          });
        }}
        filterOptions={(options) => options.filter((x) => !rows.find((row) => row.Id === x.Id))}
        value={autoCompleteVal}
        renderInput={(params) => (
          <TextField
            {...params}
            onBlur={() => {
              setFuzzySearchOptions([]);
              setAutoCompleteVal('');
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            label={'Search by any keyword...'}
          />
        )}
      />
      <DataGrid
        getRowId={(row) => row.Id + row.Type}
        autoHeight
        hideFooter
        columns={columns}
        rows={rows}
      />
    </Box>
  );
};

const AddProject = () => {
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: {
      Name: '',
      TierLevelId: null,
      Notes: '',
      Assessed: 0,
      NetBook: 0,
      Estimated: 0,
      Appraised: 0,
      Metadata: {
        salesCost: 0,
        programCost: 0,
        exemptionRequested: false,
      },
      Approval: false,
      Tasks: {
        surplusDeclarationReadiness: false,
        tripleBottomLine: false,
      },
    },
  });

  const [showNoPropertiesError, setShowNoPropertiesError] = useState(false);
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const api = usePimsApi();
  const { data: tierData, loadOnce: loadTiers } = useDataLoader(api.lookup.getTierLevels);
  loadTiers();

  return (
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
      mb={'2rem'}
      flexDirection={'column'}
      width={'38rem'}
      marginX={'auto'}
      boxShadow={'2em'}
    >
      <Box>
        <NavigateBackButton
          navigateBackTitle={'Back to Disposal Projects'}
          onBackClick={() => {}}
        />
      </Box>
      <Typography variant={'h2'} mb={'2rem'}>
        Create disposal project
      </Typography>
      <FormProvider {...formMethods}>
        <Typography variant="h5">Project information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField required fullWidth name={'Name'} label={'Name'} />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              required
              name={'TierLevelId'}
              label={'Assign tier'}
              options={tierData?.map((tier) => ({ value: tier.Id, label: tier.Name })) ?? []}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField multiline minRows={3} fullWidth name={'Notes'} label={'Notes'} />
          </Grid>
        </Grid>
        <Typography variant="h5">Disposal properties</Typography>
        <DisposalProjectSearch rows={rows} setRows={setRows} />
        {showNoPropertiesError && (
          <Typography textAlign={'center'} color={theme.palette.error.main}>
            You must include at least one property.
          </Typography>
        )}
        <Typography variant="h5">Financial information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              numeric
              name={'Assessed'}
              label={'Assessed value'}
              rules={{
                min: {
                  value: 0.01,
                  message: 'Must be greater than 0.',
                },
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              numeric
              name={'NetBook'}
              label={'Net book value'}
              rules={{
                min: {
                  value: 0.01,
                  message: 'Must be greater than 0.',
                },
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Estimated'}
              label={'Estimated market value'}
              rules={{
                min: {
                  value: 0.01,
                  message: 'Must be greater than 0.',
                },
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Appraised'}
              label={'Appraised value'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Metadata.salesCost'}
              label={'Estimated sales cost'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              numeric
              fullWidth
              name={'Metadata.programCost'}
              label={'Estimated program recovery fees'}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">Documentation</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Tasks.surplusDeclarationReadiness'}
              label={'Surplus declaration & readiness checklist document emailed to SRES.'}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Tasks.tripleBottomLine'}
              label={'Triple bottom line document emailed to SRES or Project is in Tier 1'}
              required
            />
          </Grid>
        </Grid>
        <Typography variant="h5">ERP Exemption</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Metadata.exemptionRequested'}
              label={'Apply for enhanced referral process exemption'}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">Approval</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Approval'}
              label={
                'My ministry/agency has approval/authority to submit the disposal project to SRES for review.'
              }
              required
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Button
        onClick={async () => {
          const isValid = await formMethods.trigger();
          setShowNoPropertiesError(!rows.length);
          if (isValid && rows.length) {
            const formValues = formMethods.getValues();
            // Construct project properties arrays
            const projectProperties: ProjectPropertyIds = {
              parcels: [],
              buildings: [],
            };
            rows.forEach((row: ParcelWithType | BuildingWithType) => {
              if (row.Type === 'Parcel') {
                projectProperties.parcels.push(row.Id);
              } else if (row.Type === 'Building') {
                projectProperties.buildings.push(row.Id);
              }
            });
            // Send to API hook
            api.projects
              .postProject(
                {
                  ...formValues,
                  ReportedFiscalYear: new Date().getFullYear(), //TODO: Should we have fields for this?
                  ActualFiscalYear: new Date().getFullYear(),
                },
                projectProperties,
              )
              .then(() => navigate('/projects'));
          }
        }}
        variant="contained"
        color="primary"
        sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddProject;
