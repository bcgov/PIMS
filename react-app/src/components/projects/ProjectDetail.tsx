import React, { useEffect, useState } from 'react';
import DataCard from '../display/DataCard';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { dateFormatter, statusChipFormatter } from '@/utils/formatters';
import DeleteDialog from '../dialog/DeleteDialog';
import { deleteAgencyConfirmText } from '@/constants/strings';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { Agency } from '@/hooks/api/useAgencyApi';
import TextFormField from '../form/TextFormField';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { useParams } from 'react-router-dom';
import EmailChipFormField from '@/components/form/EmailChipFormField';
import SingleSelectBoxFormField from '@/components/form/SingleSelectBoxFormField';

const ProjectDetail = () => {
  const { id } = useParams();
  const api = usePimsApi();
  const { data, refreshData } = useDataLoader(() =>
    api.project.getProjectById(Number(id)),
  );
  const { data: regionalDistricts, loadOnce: loadDistricts } = useDataLoader(
    api.lookup.getRegionalDistricts,
  );
  loadDistricts();
  const navigate = useNavigate();
  useEffect(() => {
    refreshData();
  }, [id]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const customFormatter = (key: keyof AdministrativeArea, val: any) => {
    if (key === 'IsDisabled') {
      return <Typography>{val ? 'True' : 'False'}</Typography>;
    }
  };

