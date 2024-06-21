import controllers from '@/controllers';
import { getPropertiesFuzzySearch } from '@/controllers/properties/propertiesController';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const {
  getProperties,
  getPropertiesFilter,
  getPropertiesForMap,
  getPropertiesPaged,
  getPropertiesPagedFilter,
  importProperties,
} = controllers;

// TODO: Could these just be GET requests with query params? Then no need for /filter routes. Would cut controllers in half too.

router.route('/search/fuzzy').get(activeUserCheck, catchErrors(getPropertiesFuzzySearch));

router.route('/search').get(activeUserCheck, catchErrors(getProperties));
router.route('/search/filter').post(activeUserCheck, catchErrors(getPropertiesFilter));

router.route('/search/geo').get(activeUserCheck, catchErrors(getPropertiesForMap)); // Formerly wfs route

router.route('/search/page').get(activeUserCheck, catchErrors(getPropertiesPaged));
router.route('/search/page/filter').post(activeUserCheck, catchErrors(getPropertiesPagedFilter));

const upload = multer({ dest: 'uploads/' });
router
  .route('/import')
  .post(activeUserCheck, upload.single('spreadsheet'), catchErrors(importProperties));

export default router;
