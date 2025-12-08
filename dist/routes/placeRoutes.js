"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const placeController_1 = require("../controllers/placeController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/').get(placeController_1.getPlaces);
router.route('/countries').get(placeController_1.getUniquePlaces);
router.route('/state').get(placeController_1.getUniquePlaces);
router.route('/area').get(placeController_1.getUniquePlaces);
exports.default = router;
