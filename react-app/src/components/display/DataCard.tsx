import { columnNameFormatter, dateFormatter } from '@/utilities/formatters';
import {
  Button,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import React, { PropsWithChildren } from 'react';

type DataCardProps<T> = {
  id?: string;
  values: T;
  title: string;
  loading?: boolean;
  onEdit: () => void;
  customFormatter?: (key: keyof T, value: any) => string | JSX.Element | undefined;
  disableEdit?: boolean;
} & PropsWithChildren;

const DataCard = <T,>(props: DataCardProps<T>) => {
  const { values, title, customFormatter, onEdit, disableEdit, loading } = props;

  const defaultFormatter = (key: keyof T, val: any) => {
    const customFormat = customFormatter?.(key, val);
    if (customFormat) {
      return customFormat;
    }
    if (val instanceof Date) {
      return <Typography>{dateFormatter(val)}</Typography>;
    }

    return <Typography>{val}</Typography>;
  };

  const getContent = (children: React.ReactNode) => {
    if (children) {
      return loading ? <Skeleton variant="rectangular" height={'150px'} /> : children;
    } else {
      return Object.keys(values).map((key, idx) => (
        <React.Fragment key={`card-data-fragment-${idx}-${key}`}>
          <Grid container display={'flex'} flexDirection={'row'}>
            <Grid item xs={3}>
              <Typography width={'150px'} fontWeight={'bold'}>
                {columnNameFormatter(key)}
              </Typography>
            </Grid>
            <Grid item xs={9}>
              {loading ? <Skeleton /> : defaultFormatter(key as keyof T, values[key])}
            </Grid>
          </Grid>
          {idx < Object.keys(values).length - 1 && <Divider sx={{ mt: '1rem', mb: '1rem' }} />}
        </React.Fragment>
      ));
    }
  };

  return (
    <Card variant="outlined" sx={{ padding: '2rem', minWidth: '34rem', backgroundColor: 'white' }}>
      <CardHeader
        id={props.id}
        titleTypographyProps={{ variant: 'h1' }}
        sx={{
          '.MuiCardHeader-action': {
            alignSelf: 'center',
            marginRight: '0px',
          },
          mb: '1rem',
        }}
        title={title}
        action={
          <Button
            sx={{ minWidth: '50px', fontWeight: 'bold' }}
            onClick={() => onEdit()}
            color={'primary'}
            disabled={disableEdit}
          >
            Edit
          </Button>
        }
      />
      <CardContent>{getContent(props.children)}</CardContent>
    </Card>
  );
};

export default DataCard;
