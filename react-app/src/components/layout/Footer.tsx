import { footerCopyright } from '@/constants/strings';
import { Box, Link, Toolbar, Typography, useTheme } from '@mui/material';
import React from 'react';

const Footer = (): JSX.Element => {
  const theme = useTheme();
  return (
    <footer>
      <Toolbar
        sx={{ height: '0.85rem', borderTop: '1px solid', borderTopColor: theme.palette.gray.main }}
      >
        <Typography fontSize={'0.85rem'}>{footerCopyright}</Typography>
        <Box flexGrow={1} />
        <Box display={'flex'} gap={'32px'}>
          <Link href="https://www2.gov.bc.ca//gov/content/home/accessible-government" variant="h5">
            Accessibility
          </Link>
          <Link href="https://www2.gov.bc.ca//gov/content/home/privacy" variant="h5">
            Privacy
          </Link>
          <Link href="https://www2.gov.bc.ca//gov/content/home/copyright" variant="h5">
            Copyright
          </Link>
          <Link href="https://www2.gov.bc.ca//gov/content/home/disclaimer" variant="h5">
            Disclaimer
          </Link>
        </Box>
      </Toolbar>
    </footer>
  );
};

export default Footer;
