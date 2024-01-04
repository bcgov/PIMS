import admin from '@/controllers/admin';
import { healthCheck } from '@/controllers/healthController';
import * as ltsa from '@/controllers/ltsa/ltsaController';
import * as buildings from '@/controllers/buildings/buildingsController';
import * as parcels from '@/controllers/parcels/parcelsController';
import * as lookup from '@/controllers/lookup/lookupController';
import * as users from '@/controllers/users/usersController';
import * as notifications from '@/controllers/notifications/notificationsController';

export default {
  healthCheck,
  ...ltsa,
  ...buildings,
  ...parcels,
  ...lookup,
  admin,
  ...users,
  ...notifications,
};
