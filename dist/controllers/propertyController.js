"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProperty = exports.getProperties = exports.getPropertyById = exports.createProperty = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const query_1 = require("../utils/query");
const propertyModel_1 = require("../models/propertyModel");
const fileUpload_1 = require("../utils/fileUpload");
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const fieldsToParse = ['pictures', 'documents', 'amenities', 'location'];
        fieldsToParse.forEach((field) => {
            if (req.body[field]) {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                }
                catch (err) {
                    // Already parsed or not a string
                }
            }
        });
        let uploadedUrls = {};
        if (req.files &&
            (Array.isArray(req.files)
                ? req.files.length > 0
                : Object.keys(req.files).length > 0)) {
            uploadedUrls = yield (0, fileUpload_1.uploadPicturesToS3)(req);
        }
        if ((_a = uploadedUrls.pictures) === null || _a === void 0 ? void 0 : _a.length) {
            req.body.pictures = uploadedUrls.pictures;
        }
        if ((_b = uploadedUrls.documents) === null || _b === void 0 ? void 0 : _b.length) {
            req.body.documents = uploadedUrls.documents;
        }
        const updatedProperty = yield propertyModel_1.Property.create(req.body);
        return res.status(200).json({
            success: true,
            message: 'Property was created successfully',
            data: updatedProperty,
        });
    }
    catch (error) {
        console.error('Update property error:', error);
        return (0, errorHandler_1.handleError)(res, error);
    }
});
exports.createProperty = createProperty;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield propertyModel_1.Property.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json({ data: item });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPropertyById = getPropertyById;
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(propertyModel_1.Property, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getProperties = getProperties;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const propertyId = req.params.id;
        const fieldsToParse = ['pictures', 'documents', 'amenities', 'location'];
        fieldsToParse.forEach((field) => {
            if (req.body[field]) {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                }
                catch (err) {
                    // Already parsed or not a string
                }
            }
        });
        let uploadedUrls = {};
        if (req.files &&
            (Array.isArray(req.files)
                ? req.files.length > 0
                : Object.keys(req.files).length > 0)) {
            uploadedUrls = yield (0, fileUpload_1.uploadPicturesToS3)(req);
        }
        if ((_a = uploadedUrls.pictures) === null || _a === void 0 ? void 0 : _a.length) {
            req.body.pictures = uploadedUrls.pictures;
        }
        if ((_b = uploadedUrls.documents) === null || _b === void 0 ? void 0 : _b.length) {
            req.body.documents = uploadedUrls.documents;
        }
        const updatedProperty = yield propertyModel_1.Property.findByIdAndUpdate(propertyId, req.body, { new: true, runValidators: true });
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty,
        });
    }
    catch (error) {
        console.error('Update property error:', error);
        return (0, errorHandler_1.handleError)(res, error);
    }
});
exports.updateProperty = updateProperty;
