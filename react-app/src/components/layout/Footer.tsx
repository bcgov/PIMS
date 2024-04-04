import { footerCopyright } from '@/constants/strings';
import { Box, Link, Toolbar, Typography, useTheme } from '@mui/material';
import React from 'react';

const Footer = (): JSX.Element => {
  const theme = useTheme();
  return (
    <footer>
      <Toolbar
        sx={{ height: '0.85rem', borderTop: '1px solid', backgroundColor: theme.palette.blue.main }}
      >
        <Typography color={theme.palette.white.main} fontSize={'0.85rem'}>
          {footerCopyright}
        </Typography>
        <Box flexGrow={1} />
        <Box display={'flex'} gap={'32px'}>
          <Link href="#" variant="h5">
            Accessibility
          </Link>
          <Link href="#" variant="h5">
            Privacy
          </Link>
          <Link href="#" variant="h5">
            Copyright
          </Link>
          <Link href="#" variant="h5">
            Disclaimer
          </Link>
        </Box>
      </Toolbar>
    </footer>
  );
};

export default Footer;
