import { healthCheck } from './healthController';
import * as ltsa from './ltsa/ltsaController';
import admin from './admin';
import * as parcels from './parcels/parcelsController';

export default {
  healthCheck,
  ...ltsa,
  admin,
  ...parcels,
};
