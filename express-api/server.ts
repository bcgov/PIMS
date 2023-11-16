import constants from './constants';
import app from './express';

const { API_PORT } = constants;

app.listen(API_PORT, (err?: Error) => {
  if (err) console.log(err);
  console.info(`Server started on port ${API_PORT}.`);
});
