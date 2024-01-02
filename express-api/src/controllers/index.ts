import { healthCheck } from '@/controllers/healthController';
import * as ltsa from '@/controllers/ltsa/ltsaController';
import * as parcels from '@/controllers/parcels/parcelsController';
import * as lookup from '@/controllers/lookup/lookupController';
import * as users from '@/controllers/users/usersController';

export default {
  healthCheck,
  ...ltsa,
  ...parcels,
  ...lookup,
  ...users,
};
