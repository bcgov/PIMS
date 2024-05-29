import BaseLayout from '@/components/layout/BaseLayout';
import appTheme from '@/themes/appTheme';
import { Button, Grid, IconButton, SxProps, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import errorImage from '@/assets/images/error.svg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import usePimsApi from '@/hooks/usePimsApi';
import { useNavigate } from 'react-router-dom';

/**
 * Renders an error fallback component that displays an error message and provides options for handling the error.
 *
 * @param {Object} props - The component props.
 * @param {Error} props.error - The error object that caused the fallback.
 * @param {Function} props.resetErrorBoundary - A function to reset the error boundary and retry the render.
 * @returns {JSX.Element} The rendered error fallback component.
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  const [state, setState] = useState<string>('');
  const [text, setText] = useState<string>('');
  const sso = useSSO();
  const api = usePimsApi();
  const navigate = useNavigate();
  const errorCount = sessionStorage.getItem('errorCount');

  useEffect(() => {
    if (errorCount && parseInt(errorCount) > 0) {
      sessionStorage.setItem('errorCount', '0');
      navigate('/');
      resetErrorBoundary();
    }
  }, [errorCount]);

  const commonResultStyle = {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    padding: '0.5em',
    borderRadius: '5px',
  };

  const getElement = () => {
    switch (state) {
      case 'success':
        setTimeout(() => {
          resetErrorBoundary();
        }, 3000);
        return (
          <Grid
            item
            sx={{
              ...commonResultStyle,
              backgroundColor: appTheme.palette.success.light,
              color: appTheme.palette.text.secondary,
            }}
          >
            <TaskAltIcon sx={{ marginRight: '0.5em', color: appTheme.palette.success.main }} />
            <Typography sx={{ marginRight: '4em' }}>Thank you for your feedback.</Typography>
            <IconButton
              onClick={() => {
                resetErrorBoundary();
              }}
            >
              <CloseIcon sx={{ color: appTheme.palette.text.secondary }} />
            </IconButton>
          </Grid>
        );
      case 'failure':
        setTimeout(() => {
          setState('report');
        }, 3000);
        return (
          <Grid
            item
            sx={{
              ...commonResultStyle,
              backgroundColor: appTheme.palette.error.light,
              color: appTheme.palette.error.contrastText,
            }}
          >
            <ErrorOutlineIcon
              sx={{ marginRight: '0.5em', color: appTheme.palette.error.contrastText }}
            />
            <Typography sx={{ marginRight: '4em' }}>Sorry. Please try again later.</Typography>
            <IconButton
              onClick={() => {
                setState('report');
              }}
              sx={{ '&:hover': { backgroundColor: appTheme.palette.error.dark } }}
            >
              <CloseIcon sx={{ color: appTheme.palette.error.contrastText }} />
            </IconButton>
          </Grid>
        );
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
                  api.reports
                    .postErrorReport({
                      user: sso.user,
                      error: {
                        message: error.message,
                        stack: error.stack,
                      },
                      userMessage: text,
                      timestamp: new Date().toLocaleString(),
                    })
                    .then((res) => {
                      if (res.status === 200) {
                        setState('success');
                        setText('');
                        return;
                      }
                      setState('failure');
                    })
                    .catch((e) => {
                      console.error(e);
                      setState('failure');
                    });
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
                sessionStorage.setItem('errorCount', '1');
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
  );
};

export default ErrorFallback;
