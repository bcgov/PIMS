import admin from '@/controllers/admin';
import { healthCheck } from '@/controllers/healthController';
import * as ltsa from '@/controllers/ltsa/ltsaController';
import * as parcels from '@/controllers/parcels/parcelsController';

export default {
  healthCheck,
  ...ltsa,
  ...parcels,
  admin,
};
