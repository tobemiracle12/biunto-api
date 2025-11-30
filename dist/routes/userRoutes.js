"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/login').post(upload.any(), authController_1.loginUser);
router.route('/auth/:id').get(authController_1.getAuthUser);
router.route('/').get(userController_1.getUsers).post(upload.any(), userController_1.createUser);
router.route('/:username').get(userController_1.getAUser);
router.route('/:id').patch(upload.any(), userController_1.updateUser).delete(userController_1.deleteUser);
exports.default = router;
