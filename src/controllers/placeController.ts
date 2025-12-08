import { Request, Response } from 'express'
import { IPlace, Place } from '../models/placeModel'
import { handleError } from '../utils/errorHandler'
import { queryData } from '../utils/query'

export const getUniquePlaces = async (req: Request, res: Response) => {
  try {
    const field = String(req.query.field)
    const limit = parseInt(req.query.page_size as string) || 10

    const page = parseInt(req.query.page as string) || 1
    const sortBy = (req.query.sort as string) || 'country'
    const order = (req.query.order as string) === 'asc' ? -1 : 1

    const skipValue = (page - 1) * limit

    const country = req.query.country
    const state = req.query.state
    const area = req.query.area

    const filters: Record<string, any> = {}
    if (area) {
      filters.area = { $regex: area, $options: 'i' }
    } else if (state) {
      filters.state = { $regex: state, $options: 'i' }
    } else {
      filters.country = { $regex: country, $options: 'i' }
    }

    const matchStage =
      Object.keys(filters).length > 0 ? { $match: filters } : null

    const aggregationPipeline: any[] = []
    if (matchStage) aggregationPipeline.push(matchStage)

    aggregationPipeline.push(
      {
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
      },
      {
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
      },
      { $sort: { [sortBy]: order } },
      { $skip: skipValue },
      { $limit: limit }
    )

    const countPipeline = [...aggregationPipeline].filter(
      (stage) => !('$limit' in stage || '$skip' in stage)
    )

    countPipeline.push({ $count: 'totalCount' })
    const [places, totalCountResult] = await Promise.all([
      Place.aggregate(aggregationPipeline),
      Place.aggregate(countPipeline),
    ])

    const totalCount = totalCountResult.length
      ? totalCountResult[0].totalCount
      : 0

    res.status(200).json({
      message: 'Places fetched successfully',
      results: places,
      count: totalCount,
      page_size: limit,
    })
  } catch (error) {
    console.error('Error fetching unique places:', error)
    throw error
  }
}

export const getPlaces = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPlace>(Place, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
