import { healthCheck } from './healthController';
import * as ltsa from './ltsa/ltsaController';
import * as adminAccessRequests from './admin/accessRequests/accessRequestsController';

export default {
  healthCheck,
  ...ltsa,
  ...adminAccessRequests,
};
