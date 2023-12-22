import { healthCheck } from './healthController';
import * as ltsa from './ltsa/ltsaController';
import * as users from './users/usersController';

export default {
  healthCheck,
  ...ltsa,
  ...users,
};
