import BaseLayout from '@/components/layout/BaseLayout';
import appTheme from '@/themes/appTheme';
import { Button, Grid, SxProps, TextField, ThemeProvider, Typography } from '@mui/material';
import React, { useState } from 'react';
import errorImage from '@/assets/images/error.svg';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  const [state, setState] = useState<string>('landing');
  const [text, setText] = useState<string>('');

  const getElement = () => {
    switch (state) {
      case 'report':
        return (
          <>
            <Grid item>
              <TextField
                value={text}
                multiline
                rows={6}
                sx={{
                  width: '100%',
                  marginBottom: '1em',
                }}
                placeholder="Describe the issue or give any desired feedback"
                onChange={(e) => {
                  setText(e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid
              item
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setState('landing');
                }}
                sx={{ marginRight: '1em', width: '7.5em' }}
                size="large"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  console.log(text);
                }}
                sx={{ marginRight: '1em', width: '7.5em' }}
                size="large"
              >
                Send
              </Button>
            </Grid>
          </>
        );
      default:
        return (
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                resetErrorBoundary();
              }}
              sx={{ marginRight: '1em', width: '7.5em' }}
              size="large"
            >
              Reload
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setState('report');
              }}
              size="large"
            >
              Report a problem
            </Button>
          </Grid>
        );
    }
  };

  const gridStyle: SxProps = {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  };
  return (
    <ThemeProvider theme={appTheme}>
      <BaseLayout>
        <Grid
          container
          sx={{
            height: '95%',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Grid
            item
            container
            sm={12}
            md={6}
            sx={{ ...gridStyle, display: 'inline-block', margin: '0 2em', marginBottom: '2em' }}
          >
            <Grid
              item
              sx={{
                margin: '3em 0',
              }}
            >
              <Typography variant="h1">Oops, something went wrong...</Typography>
            </Grid>
            <Grid
              item
              sx={{
                margin: '3em 0',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '1.2rem',
                  color: appTheme.palette.text.disabled,
                }}
              >
                The server encountered a temporary error and could not complete your request.
              </Typography>
            </Grid>
            {getElement()}
          </Grid>
          <Grid item sm={12} md={5} sx={gridStyle}>
            <img
              src={errorImage}
              style={{
                height: '500px',
                maxWidth: '100%',
              }}
            />
          </Grid>
        </Grid>
      </BaseLayout>
    </ThemeProvider>
  );
};

export default ErrorFallback;
