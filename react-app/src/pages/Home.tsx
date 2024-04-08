import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import propertyVector from '@/assets/images/PIMS_logo.svg';
import { landingPageBottomText, landingPageTopText } from '@/constants/strings';
import { AuthContext } from '@/contexts/authContext';
import { Navigate } from 'react-router-dom';

const Landing = () => {
  return (
    <Box maxWidth={'1090px'} marginX={'auto'} display={'flex'}>
      <Box display={'flex'} alignContent={'center'}>
        <Box marginRight={'32px'}>
          <Typography marginBottom={'16px'} variant="h1" fontSize={'2.5rem'}>
            {landingPageTopText}
          </Typography>
          <Typography variant="h4" fontWeight={500}>
            {landingPageBottomText}
          </Typography>
        </Box>
        <Box>
          <img width={'200px'} src={propertyVector} alt={'Property vector image.'} />
        </Box>
      </Box>
    </Box>
  );
};

export const Home = () => {
  const auth = useContext(AuthContext);
  if (sessionStorage) {
    const preLoginLocation = sessionStorage.getItem('401redirect');
    if (preLoginLocation) {
      sessionStorage.removeItem('401redirect');
      window.location.href = preLoginLocation;
    }
  }
  return (
    <Box
      flexDirection={'column'}
      flexGrow={1}
      display={'flex'}
      justifyContent={'center'}
      height={'100%'}
      bgcolor={'#F8F8F8'} //In the ticket this was #D2D8D8, but I think it was meant to be #F8F8F8 based on the example.
    >
      {!auth.keycloak.isAuthenticated || auth.pimsUser.data?.Status === 'Active' ? (
        <Landing />
      ) : (
        <Navigate replace to={'/access-request'} />
      )}
    </Box>
  );
};

export default Home;
