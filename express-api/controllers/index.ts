import { healthCheck } from './healthController';
import * as ltsa from './ltsa/ltsaController';

export default {
  healthCheck,
  ...ltsa,
};
