import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { bulkUploadMimeTypeWhitelist } from '@/utilities/uploadWhitelist';
import express, { NextFunction } from 'express';
import multer from 'multer';
import { Request, Response } from 'express';

const router = express.Router();

const {
  getProperties,
  getPropertiesFilter,
  getPropertiesForMap,
  getPropertiesPaged,
  getPropertiesPagedFilter,
  importProperties,
  getPropertiesFuzzySearch,
  getPropertyUnion,
  getImportResults,
} = controllers;

// TODO: Could these just be GET requests with query params? Then no need for /filter routes. Would cut controllers in half too.

router.route('/search/fuzzy').get(activeUserCheck, catchErrors(getPropertiesFuzzySearch));

router.route('/search').get(activeUserCheck, catchErrors(getProperties));
router.route('/search/filter').post(activeUserCheck, catchErrors(getPropertiesFilter));

router.route('/search/geo').get(activeUserCheck, catchErrors(getPropertiesForMap)); // Formerly wfs route

router.route('/search/page').get(activeUserCheck, catchErrors(getPropertiesPaged));
router.route('/search/page/filter').post(activeUserCheck, catchErrors(getPropertiesPagedFilter));

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (!bulkUploadMimeTypeWhitelist.includes(file.mimetype)) {
      return cb(new Error('Unsupported MIME-type.'));
    }
    cb(null, true);
  },
});
const uploadHandler = async (req: Request, res: Response, next: NextFunction) => {
  const mainReqHandler = upload.single('spreadsheet');
  mainReqHandler(req, res, (err) => {
    if (err) {
      return res.status(400).send(err.message ?? 'File upload failed.');
    }
    next();
  });
};
router.route('/import').post(activeUserCheck, uploadHandler, catchErrors(importProperties));
router.route('/import/results').get(activeUserCheck, catchErrors(getImportResults));
router.route('/').get(activeUserCheck, catchErrors(getPropertyUnion));

export default router;
