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
exports.getPlaces = exports.getUniquePlaces = void 0;
const placeModel_1 = require("../models/placeModel");
const errorHandler_1 = require("../utils/errorHandler");
const query_1 = require("../utils/query");
const getUniquePlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const field = String(req.query.field);
        const limit = parseInt(req.query.page_size) || 10;
        const page = parseInt(req.query.page) || 1;
        const sortBy = req.query.sort || 'country';
        const order = req.query.order === 'asc' ? -1 : 1;
        const skipValue = (page - 1) * limit;
        const country = req.query.country;
        const state = req.query.state;
        const area = req.query.area;
        const filters = {};
        if (area) {
            filters.area = { $regex: area, $options: 'i' };
        }
        else if (state) {
            filters.state = { $regex: state, $options: 'i' };
        }
        else {
            filters.country = { $regex: country, $options: 'i' };
        }
        const matchStage = Object.keys(filters).length > 0 ? { $match: filters } : null;
        const aggregationPipeline = [];
        if (matchStage)
            aggregationPipeline.push(matchStage);
        aggregationPipeline.push({
            $group: {
                _id: `$${field}`,
                countryFlag: { $first: '$countryFlag' },
                continent: { $first: '$continent' },
                country: { $first: '$country' },
                countryCode: { $first: '$countryCode' },
                currency: { $first: '$currency' },
                currencySymbol: { $first: '$currencySymbol' },
                countrySymbol: { $first: '$countrySymbol' },
                state: { $first: '$state' },
                stateCapital: { $first: '$stateCapital' },
                stateLogo: { $first: '$stateLogo' },
                area: { $first: '$area' },
                zipCode: { $first: '$zipCode' },
                id: { $first: '$_id' },
            },
        }, {
            $project: {
                _id: 0,
                [field]: '$_id',
                countryFlag: 1,
                continent: 1,
                countryCode: 1,
                country: 1,
                currency: 1,
                currencySymbol: 1,
                countrySymbol: 1,
                state: 1,
                stateCapital: 1,
                stateLogo: 1,
                area: 1,
                zipCode: 1,
                id: 1,
            },
        }, { $sort: { [sortBy]: order } }, { $skip: skipValue }, { $limit: limit });
        const countPipeline = [...aggregationPipeline].filter((stage) => !('$limit' in stage || '$skip' in stage));
        countPipeline.push({ $count: 'totalCount' });
        const [places, totalCountResult] = yield Promise.all([
            placeModel_1.Place.aggregate(aggregationPipeline),
            placeModel_1.Place.aggregate(countPipeline),
        ]);
        const totalCount = totalCountResult.length
            ? totalCountResult[0].totalCount
            : 0;
        res.status(200).json({
            message: 'Places fetched successfully',
            results: places,
            count: totalCount,
            page_size: limit,
        });
    }
    catch (error) {
        console.error('Error fetching unique places:', error);
        throw error;
    }
});
exports.getUniquePlaces = getUniquePlaces;
const getPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(placeModel_1.Place, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPlaces = getPlaces;
