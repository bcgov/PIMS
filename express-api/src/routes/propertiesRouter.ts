import controllers from '@/controllers';
import activeUserCheck from '@/middleware/activeUserCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { bulkUploadMimeTypeWhitelist } from '@/utilities/uploadWhitelist';
import express, { NextFunction } from 'express';
import multer from 'multer';
import { Request, Response } from 'express';

const router = express.Router();

const {
  getPropertiesForMap,
  importProperties,
  getPropertiesFuzzySearch,
  getPropertyUnion,
  getImportResults,
  getLinkedProjects,
} = controllers;

router.route('/search/fuzzy').get(activeUserCheck, catchErrors(getPropertiesFuzzySearch));

router.route('/search/geo').get(activeUserCheck, catchErrors(getPropertiesForMap)); // Formerly wfs route

router.route('/search/linkedProjects').get(activeUserCheck, catchErrors(getLinkedProjects));

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
