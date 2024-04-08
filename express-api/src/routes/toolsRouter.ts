import controllers from '@/controllers';
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
  bulkDeleteProperties,
  bulkImportProjects,
  bulkImportProperties,
  bulkUpdatePropertyFinancials,
} = controllers;

router.route(`/ches`).post(catchErrors(sendChesMessage));
router.route(`/ches/status/`).get(catchErrors(getChesMessageStatuses));
router.route(`/ches/status/:messageId`).get(catchErrors(getChesMessageStatusById));
router.route(`/ches/cancel/:messageId`).delete(catchErrors(cancelChesMessageById));
router.route(`/ches/cancel/`).delete(catchErrors(cancelChesMessages));

router.route(`/geocoder/addresses`).get(catchErrors(searchGeocoderAddresses));
router.route(`/geocoder/parcels/pids/:siteId`).get(catchErrors(searchGeocoderSiteId));

router.route(`/import/properties`).post(catchErrors(bulkImportProperties));
router.route(`/import/properties`).delete(catchErrors(bulkDeleteProperties));

//This is originally implemented as POST, but that doesn't really make sense since the documentation
//implies that the resource must already exist for this one to work. So it's really more of a partial update.
router.route(`/import/properties/financials`).patch(catchErrors(bulkUpdatePropertyFinancials));

router.route(`/import/projects`).post(catchErrors(bulkImportProjects));

export default router;
