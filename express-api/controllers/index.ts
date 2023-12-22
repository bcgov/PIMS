import { healthCheck } from './healthController';
import * as ltsa from './ltsa/ltsaController';
import admin from './admin';

export default {
  healthCheck,
  ...ltsa,
  admin,
};
