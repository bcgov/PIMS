import { createTheme } from '@mui/material';
import '@bcgov/bc-sans/css/BC_Sans.css';
import type {} from '@mui/x-data-grid/themeAugmentation';

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

// Add custom styles for typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    smallTable: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    smallTable?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    smallTable: true;
  }
}

const appTheme = createTheme({
  palette: {
    gold: {
      main: '#FCBA19',
      light: '#fff8e8',
    },
    blue: {
      main: '#0e3468',
      light: '#d4e7f6',
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
    fontWeightMedium: 400,
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
    smallTable: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none',
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
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
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          ':hover': {
            boxShadow: 'none',
          },
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
    MuiPaper: {
      styleOverrides: {
        root: {
          // boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.04)',
          // Keeping this here for now as reference but I think too many components depend on Paper
          // to use this globally without interfering with random custom tweaks we want to make.
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaderTitle: {
          fontWeight: 700,
        },
        footerContainer: {
          fontWeight: 700,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          ':hover': {
            backgroundColor: '#f8f8f8',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #e0e0e0',
          padding: '0.8rem',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          top: '5px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.9rem',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          '& li': {
            fontFamily: ['BC Sans', 'Verdana', 'Arial', 'sans-serif'].join(','),
          },
        },
      },
    },
  },
});

export default appTheme;
