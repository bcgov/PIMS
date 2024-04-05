import {
  Autocomplete,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { NavigateBackButton } from '../display/DetailViewNavigation';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import { FormProvider, useForm } from 'react-hook-form';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DisposalProjectSearch = () => {
  const data = [
    {
      CreatedById: '0edf3fce-20ce-414e-b53f-11cd3dbf4976',
      CreatedOn: '2024-03-28T01:48:09.930Z',
      UpdatedById: '5cdf645d-26b2-4a6b-b3c6-84c2eda011bd',
      UpdatedOn: '2024-04-04T03:24:14.126Z',
      Id: 3,
      Name: '',
      Description: 'AAAAA',
      ClassificationId: 4,
      Classification: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:34.750Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 4,
        Name: 'Disposed',
        IsDisabled: false,
        SortOrder: 5,
        IsVisible: false,
      },
      AgencyId: 1,
      Agency: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2024-03-27T17:12:43.658Z',
        UpdatedById: '0edf3fce-20ce-414e-b53f-11cd3dbf4976',
        UpdatedOn: '2024-03-29T02:13:28.548Z',
        Id: 1,
        Name: 'TESTY',
        IsDisabled: false,
        SortOrder: 0,
        Code: '0',
        Description: 'Description stuff',
        ParentId: null,
        Email: 'testingemail@gmail.com;test123@gmail.com;testing@aaa.com',
        SendEmail: true,
        AddressTo: null,
        CCEmail: '',
      },
      AdministrativeAreaId: 7,
      AdministrativeArea: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:40.246Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 7,
        Name: 'Albert Canyon',
        IsDisabled: false,
        SortOrder: 0,
        RegionalDistrictId: 14,
        ProvinceId: 'BC',
      },
      IsSensitive: false,
      IsVisibleToOtherAgencies: false,
      Location: {
        x: 0,
        y: 0,
      },
      ProjectNumbers: null,
      PropertyTypeId: 0,
      PropertyType: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:34.750Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 0,
        Name: 'Land',
        IsDisabled: false,
        SortOrder: 0,
      },
      Address1: '1234 AAA St',
      Address2: null,
      Postal: '111AAA',
      PID: 123111555,
      PIN: 111222333,
      SiteId: null,
      LandArea: 1389,
      LandLegalDescription: 'AAAAAA',
      Zoning: null,
      ZoningPotential: null,
      NotOwned: true,
      ParentParcelId: null,
      ParentParcel: null,
    },
    {
      CreatedById: '5cdf645d-26b2-4a6b-b3c6-84c2eda011bd',
      CreatedOn: '2024-04-04T03:18:48.468Z',
      UpdatedById: '5cdf645d-26b2-4a6b-b3c6-84c2eda011bd',
      UpdatedOn: '2024-04-04T06:46:24.014Z',
      Id: 5,
      Name: '',
      Description: '',
      ClassificationId: 0,
      Classification: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:34.750Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 0,
        Name: 'Core Operational',
        IsDisabled: false,
        SortOrder: 1,
        IsVisible: true,
      },
      AgencyId: 1,
      Agency: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2024-03-27T17:12:43.658Z',
        UpdatedById: '0edf3fce-20ce-414e-b53f-11cd3dbf4976',
        UpdatedOn: '2024-03-29T02:13:28.548Z',
        Id: 1,
        Name: 'TESTY',
        IsDisabled: false,
        SortOrder: 0,
        Code: '0',
        Description: 'Description stuff',
        ParentId: null,
        Email: 'testingemail@gmail.com;test123@gmail.com;testing@aaa.com',
        SendEmail: true,
        AddressTo: null,
        CCEmail: '',
      },
      AdministrativeAreaId: 3,
      AdministrativeArea: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:40.246Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 3,
        Name: '150 Mile House',
        IsDisabled: false,
        SortOrder: 0,
        RegionalDistrictId: 2,
        ProvinceId: 'BC',
      },
      IsSensitive: false,
      IsVisibleToOtherAgencies: false,
      Location: {
        x: 0,
        y: 0,
      },
      ProjectNumbers: null,
      PropertyTypeId: 0,
      PropertyType: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:34.750Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 0,
        Name: 'Land',
        IsDisabled: false,
        SortOrder: 0,
      },
      Address1: '123 Ave, Maple Ridge, BC',
      Address2: null,
      Postal: '',
      PID: 123443211,
      PIN: null,
      SiteId: null,
      LandArea: 123,
      LandLegalDescription: '',
      Zoning: null,
      ZoningPotential: null,
      NotOwned: true,
      ParentParcelId: null,
      ParentParcel: null,
    },
    {
      CreatedById: '0edf3fce-20ce-414e-b53f-11cd3dbf4976',
      CreatedOn: '2024-03-28T00:13:27.461Z',
      UpdatedById: '0edf3fce-20ce-414e-b53f-11cd3dbf4976',
      UpdatedOn: '2024-03-28T00:39:35.439Z',
      Id: 1,
      Name: '',
      Description: '',
      ClassificationId: 0,
      Classification: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:34.750Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 0,
        Name: 'Core Operational',
        IsDisabled: false,
        SortOrder: 1,
        IsVisible: true,
      },
      AgencyId: null,
      Agency: null,
      AdministrativeAreaId: 6,
      AdministrativeArea: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:40.246Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 6,
        Name: 'Ahousaht',
        IsDisabled: false,
        SortOrder: 0,
        RegionalDistrictId: 18,
        ProvinceId: 'BC',
      },
      IsSensitive: false,
      IsVisibleToOtherAgencies: false,
      Location: {
        x: 0,
        y: 0,
      },
      ProjectNumbers: null,
      PropertyTypeId: 0,
      PropertyType: {
        CreatedById: '00000000-0000-0000-0000-000000000000',
        CreatedOn: '2023-01-18T01:58:34.750Z',
        UpdatedById: null,
        UpdatedOn: null,
        Id: 0,
        Name: 'Land',
        IsDisabled: false,
        SortOrder: 0,
      },
      Address1: '',
      Address2: null,
      Postal: 'V2345A',
      PID: 123456789,
      PIN: null,
      SiteId: null,
      LandArea: 123,
      LandLegalDescription: null,
      Zoning: null,
      ZoningPotential: null,
      NotOwned: true,
      ParentParcelId: null,
      ParentParcel: null,
    },
  ];
  const [rows, setRows] = useState([]);
  const [autoCompleteVal, setAutoCompleteVal] = useState(null);
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    {
      field: 'Type',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'PID_Address',
      headerName: 'PID/Address',
      valueGetter: (params) => params.row.PID ?? params.row.Address1,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography
            component={'a'}
            href=""
            onClick={() => navigate(`/properties/parcel/${params.row.Id}`)}
          >
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      valueGetter: (params) => params.value?.Name ?? 'N/A',
      flex: 1,
    },
    {
      field: 'Year',
      headerName: 'Year',
      flex: 1,
    },
    {
      field: 'Evaluation',
      headerName: 'Evaluation',
      valueGetter: (params) => params.row.Evaluations?.[0]?.Value,
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
        );
      },
    },
  ];
  return (
    <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
      <Autocomplete
        options={data.map((d) => ({ Id: d.Id, PID: d.PID, Address1: d.Address1 }))}
        onChange={(event, value) => {
          const row = data.find((a) => a.Id === value.Id);
          if (row) {
            const transformedRow = { ...row, Type: 'Parcel' };
            setRows([...rows, transformedRow]);
            setAutoCompleteVal(null);
          }
        }}
        getOptionLabel={(option) =>
          `Parcel @ PID: ${String(option.PID)}` ?? `Parcel @ ${option.Address1}`
        }
        filterOptions={(options) => options.filter((x) => !rows.find((row) => row.Id === x.Id))}
        value={autoCompleteVal}
        renderInput={(params) => (
          <TextField
            {...params}
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
      <DataGrid getRowId={(row) => row.Id} autoHeight hideFooter columns={columns} rows={rows} />
    </Box>
  );
};

const AddProject = () => {
  const formMethods = useForm();
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
        <NavigateBackButton navigateBackTitle={'Back'} onBackClick={() => {}} />
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
              options={[]}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField required fullWidth name={'Notes'} label={'Notes'} />
          </Grid>
        </Grid>
        <Typography variant="h5">Disposal properties</Typography>
        <DisposalProjectSearch />
        <Typography variant="h5">Financial information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              name={'Assessed'}
              label={'Assessed value'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              name={'NetBook'}
              label={'Net book value'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              name={'Estimated'}
              label={'Estimated market value'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
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
              fullWidth
              name={'Metadata.estimatedSalesCost'}
              label={'Estimated sales cost'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              fullWidth
              name={'Metadata.estimatedProgramRecoveryFees'}
              label={'Estimated program recovery fees'}
            />
          </Grid>
        </Grid>
        <Typography variant="h5">Documentation</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Metadata.surplusDeclaration'}
              label={'Surplus declaration & readiness checklist document emailed to SRES.'}
            />
          </Grid>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Metadata.tripleBottomLine'}
              label={'Triple bottom line document emailed to SRES or Project is in Tier 1'}
            />
          </Grid>
          <Grid item xs={12}>
            <SingleSelectBoxFormField
              name={'Metadata.applyForEnhancedExemption'}
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
            />
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};

export default AddProject;
