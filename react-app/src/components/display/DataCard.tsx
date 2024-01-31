import { Box, CardContent, CardHeader, Divider, Link, Typography, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import React from 'react';

interface IDataCard {
  values: Record<string, any>;
  title: string;
}

const DataCard = (props: IDataCard) => {
  const { values, title } = props;
  const dateTransformer = (input: any) => {
    if (input instanceof Date) {
      return `${input.getDay()}/${input.getMonth() + 1}/${input.getFullYear()}`;
    } else {
      return input;
    }
  };

  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ padding: '2rem', minWidth: '500px', backgroundColor: 'white' }}>
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
          <Link
            sx={{ textDecoration: 'none', fontWeight: 'bold' }}
            component={'button'}
            onClick={() => {}}
            variant="h5"
            color={theme.palette.primary.main}
          >
            Edit
          </Link>
        }
      />
      <CardContent>
        {Object.keys(values).map((key, idx) => (
          <>
            <Box display={'flex'} flexDirection={'row'} key={`card-data-${idx}-${key}`}>
              <Typography width={'150px'} fontWeight={'bold'}>{key}</Typography>
              <Typography>{dateTransformer(values[key])}</Typography>
            </Box>
            {idx < Object.keys(values).length - 1 && <Divider sx={{ mt: '1rem', mb: '1rem' }} />}
          </>
        ))}
      </CardContent>
    </Card>
  );
};

export default DataCard;
