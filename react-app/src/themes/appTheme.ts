import { createTheme } from '@mui/material';
import '@bcgov/bc-sans/css/BC_Sans.css';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    gold: Palette['primary'];
    blue: Palette['primary'];
    black: Palette['primary'];
    white: Palette['primary'];
    gray: Palette['primary'];
  }
  interface PaletteOptions {
    gold: PaletteOptions['primary'];
    blue: PaletteOptions['primary'];
    black: PaletteOptions['primary'];
    white: PaletteOptions['primary'];
    gray: PaletteOptions['primary'];
  }
}

const appTheme = createTheme({
  palette: {
    gold: {
      main: '#FCBA19',
    },
    blue: {
      main: '#0e3468',
    },
    black: {
      main: '#000000',
    },
    white: {
      main: '#ffffff',
    },
    gray: {
      main: '#D2D8D8',
    },
    primary: {
      main: '#0E3468',
      dark: '#0E3468D8',
    },
    secondary: {
      main: '#FCBA19',
      dark: '#FCBA19D8',
      contrastText: '#FFF',
    },
    success: {
      light: '#CAF0CC',
      main: '#467A06',
    },
    info: {
      light: '#FAE6B9',
      main: '#A47C25',
    },
    warning: {
      light: '#FABBC3',
      main: '#A92F36',
    },
    text: {
      primary: '#000',
    },
  },
  typography: {
    fontFamily: ['BC Sans', 'Verdana', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '0.9rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          color: 'secondary',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '32px',
          minWidth: '82px',
          boxShadow: 'none',
          ':hover': {
            boxShadow: 'none',
          },
        },
        textPrimary: {
          color: '#000',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#000',
          fontWeight: 500,
          textDecorationColor: '#000',
        },
      },
    },
  },
});

export default appTheme;
