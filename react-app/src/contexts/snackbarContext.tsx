import React, { useEffect } from 'react';
import {
  ReactNode,
  SyntheticEvent,
  createContext,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  CSSProperties,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarContent, useTheme } from '@mui/material';
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';
import { trackError } from '@snowplow/browser-plugin-error-tracking';

/**
 * @interface
 * @description Properties passed to SnackbarContext.
 * @property {ReactNode} children The child elements within the SnackbarContext.
 */
interface ISnackBarContext {
  children: ReactNode;
}

/**
 * @interface
 * @description Defines the properties of an Message State.
 * @property {string} text The text displayed in the notification.
 * @property {boolean} open Whether the notification is open and visible.
 * @property {CSSProperties} style Optional: Styling properties for the notification.
 */
interface MessageState {
  text: string;
  open: boolean;
  style?: CSSProperties;
}

/**
 * @constant
 * @description The initial state of the component. MessageState
 */
const initialState: MessageState = {
  text: '',
  open: false,
};

/**
 * @constant
 * @description The initial context passed down from the context provider.
 */
const initialContext = {
  messageState: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMessageState: (() => {}) as Dispatch<SetStateAction<MessageState>>,
  styles: {
    success: {},
    warning: {},
  },
};
/**
 * @constant
 * @description The context provided by the SnackbarContext.
 */
export const SnackBarContext = createContext(initialContext);

/**
 * @description Wraps the application and provides a popup notification that can be used with the supplied SnackBarContext.
 * @param {ISnackBarContext} props Properties passed to the component.
 * @returns A React component
 */
const SnackBarContextProvider = (props: ISnackBarContext) => {
  const theme = useTheme();
  const snackbarStyles = {
    success: { backgroundColor: theme.palette.success.main },
    warning: { backgroundColor: theme.palette.warning.main },
  };
  const [messageState, setMessageState] = useState(initialState);
  // Value passed into context later
  const value = useMemo(
    () => ({
      messageState: messageState,
      setMessageState: setMessageState,
      styles: snackbarStyles,
    }),
    [messageState],
  );

  useEffect(() => {
    // TODO: Decide which error version to use
    // If it was a warning/error.
    if (messageState.style === snackbarStyles.warning) {
      // This was used in old PIMS
      trackSelfDescribingEvent({
        event: {
          schema: 'iglu:ca.bc.gov.pims/error/jsonschema/1-0-0',
          data: {
            error_message: messageState.text,
          },
        },
      });
      // OR this is the native version
      trackError({
        message: messageState.text,
      })
    }
  }, [messageState]);

  const { children } = props;

  // When the closing X is clicked.
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageState({
      ...messageState, //Spread to keep correct style even while fading out.
      text: '',
      open: false,
    });
  };

  // The X element in the notification.
  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <SnackBarContext.Provider value={value}>
      {children}
      <Snackbar open={messageState.open} autoHideDuration={6000} onClose={handleClose}>
        <SnackbarContent
          sx={messageState.style || snackbarStyles.warning}
          message={messageState.text}
          action={action}
        />
      </Snackbar>
    </SnackBarContext.Provider>
  );
};

export default SnackBarContextProvider;
