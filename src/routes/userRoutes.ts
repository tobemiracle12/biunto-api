import express from 'express'
import multer from 'multer'
import { getAuthUser, loginUser } from '../controllers/authController'
import {
  createUser,
  deleteUser,
  getAUser,
  getUsers,
  updateUser,
} from '../controllers/userController'

const upload = multer()

const router = express.Router()

router.route('/login').post(upload.any(), loginUser)
router.route('/auth/:id').get(getAuthUser)

router.route('/').get(getUsers).post(upload.any(), createUser)

router.route('/:username').get(getAUser)

router.route('/:id').patch(upload.any(), updateUser).delete(deleteUser)

export default router
