import { createTheme } from '@mui/material';

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
  },
  typography: {
    fontFamily: 'BCSans',
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
});

export default appTheme;