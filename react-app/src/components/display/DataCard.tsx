import { columnNameFormatter, dateFormatter } from '@/utils/formatters';
import { Box, Button, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import React from 'react';

interface IDataCard<T> {
  values: T;
  title: string;
  customFormatter?: (key: keyof T, value: any) => string | JSX.Element | undefined;
}

const DataCard = <T,>(props: IDataCard<T>) => {
  const { values, title, customFormatter } = props;

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

  return (
    <Card variant="outlined" sx={{ padding: '2rem', minWidth: '34rem', backgroundColor: 'white' }}>
      <CardHeader
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
            onClick={() => {}}
            color={'primary'}
          >
            Edit
          </Button>
        }
      />
      <CardContent>
        {Object.keys(values).map((key, idx) => (
          <React.Fragment key={`card-data-fragment-${idx}-${key}`}>
            <Box display={'flex'} flexDirection={'row'}>
              <Typography width={'150px'} fontWeight={'bold'}>
                {columnNameFormatter(key)}
              </Typography>
              {defaultFormatter(key as keyof T, values[key])}
            </Box>
            {idx < Object.keys(values).length - 1 && <Divider sx={{ mt: '1rem', mb: '1rem' }} />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default DataCard;
