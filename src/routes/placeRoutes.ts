import express from 'express'
import multer from 'multer'
import { getPlaces, getUniquePlaces } from '../controllers/placeController'

const upload = multer()

const router = express.Router()

router.route('/').get(getPlaces)
router.route('/countries').get(getUniquePlaces)
router.route('/state').get(getUniquePlaces)
router.route('/area').get(getUniquePlaces)

export default router
