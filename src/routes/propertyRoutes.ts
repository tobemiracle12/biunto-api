import express from 'express'
import multer from 'multer'

import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from '../controllers/propertyController'

const upload = multer()

const router = express.Router()

router.route('/').get(getProperties).post(upload.any(), createProperty)

router.route('/:id').get(getPropertyById).patch(upload.any(), updateProperty)

export default router
