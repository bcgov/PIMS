import admin from '@/controllers/admin';
import { healthCheck } from '@/controllers/healthController';
import * as ltsa from '@/controllers/ltsa/ltsaController';
import * as parcels from '@/controllers/parcels/parcelsController';
import * as lookup from '@/controllers/lookup/lookupController';
import * as users from '@/controllers/users/usersController';
import * as projects from '@/controllers/projects/projectsController';
import * as notifications from '@/controllers/notifications/notificationsController';

export default {
  healthCheck,
  ...ltsa,
  ...parcels,
  ...lookup,
  admin,
  ...users,
  ...projects,
  ...notifications,
};
