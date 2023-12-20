import { healthCheck } from '@controllers/healthController';
import * as ltsa from '@controllers/ltsa/ltsaController';

export default {
  healthCheck,
  ...ltsa,
};
