import axios from 'axios';

const createAxios = keycloakToken =>
  axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keycloakToken}`,
    },
  });

export default createAxios;
