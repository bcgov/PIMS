import { healthCheck } from './healthController';
import * as ltsa from './ltsa/ltsaController';
import * as parcels from './parcels/parcelsController';

export default {
  healthCheck,
  ...ltsa,
  ...parcels,
};
