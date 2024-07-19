import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const {
  sendChesMessage,
  getChesMessageStatusById,
  getChesMessageStatuses,
  cancelChesMessageById,
  cancelChesMessages,
  searchGeocoderAddresses,
  searchGeocoderSiteId,
} = controllers;

router.route(`/ches`).post(activeUserCheck, catchErrors(sendChesMessage));
router.route(`/ches/status/`).get(activeUserCheck, catchErrors(getChesMessageStatuses));
router.route(`/ches/status/:messageId`).get(activeUserCheck, catchErrors(getChesMessageStatusById));
router.route(`/ches/cancel/:messageId`).delete(activeUserCheck, catchErrors(cancelChesMessageById));
router.route(`/ches/cancel/`).delete(activeUserCheck, catchErrors(cancelChesMessages));

router.route(`/geocoder/addresses`).get(activeUserCheck, catchErrors(searchGeocoderAddresses));
router
  .route(`/geocoder/parcels/pids/:siteId`)
  .get(activeUserCheck, catchErrors(searchGeocoderSiteId));

//This is originally implemented as POST, but that doesn't really make sense since the documentation
//implies that the resource must already exist for this one to work. So it's really more of a partial update.
router.route(`/import/properties/financials`);

export default router;
