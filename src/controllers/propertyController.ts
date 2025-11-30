import { Request, Response } from 'express'
import { handleError } from '../utils/errorHandler'
import { queryData, updateItem, createItem, search } from '../utils/query'
import { IProperty, Property } from '../models/propertyModel'
import { uploadFilesToS3, uploadPicturesToS3 } from '../utils/fileUpload'

export const createProperty = async (req: Request, res: Response) => {
  try {
    const fieldsToParse = ['pictures', 'documents', 'amenities', 'location']
    fieldsToParse.forEach((field) => {
      if (req.body[field]) {
        try {
          req.body[field] = JSON.parse(req.body[field] as string)
        } catch (err) {
          // Already parsed or not a string
        }
      }
    })

    let uploadedUrls: { pictures?: string[]; documents?: string[] } = {}

    if (
      req.files &&
      (Array.isArray(req.files)
        ? req.files.length > 0
        : Object.keys(req.files).length > 0)
    ) {
      uploadedUrls = await uploadPicturesToS3(req)
    }

    if (uploadedUrls.pictures?.length) {
      req.body.pictures = uploadedUrls.pictures
    }

    if (uploadedUrls.documents?.length) {
      req.body.documents = uploadedUrls.documents
    }

    const updatedProperty = await Property.create(req.body)

    return res.status(200).json({
      success: true,
      message: 'Property was created successfully',
      data: updatedProperty,
    })
  } catch (error: any) {
    console.error('Update property error:', error)
    return handleError(res, error)
  }
}

export const getPropertyById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Property.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Property not found' })
    }
    res.status(200).json({ data: item })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getProperties = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IProperty>(Property, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.id

    const fieldsToParse = ['pictures', 'documents', 'amenities', 'location']
    fieldsToParse.forEach((field) => {
      if (req.body[field]) {
        try {
          req.body[field] = JSON.parse(req.body[field] as string)
        } catch (err) {
          // Already parsed or not a string
        }
      }
    })

    let uploadedUrls: { pictures?: string[]; documents?: string[] } = {}

    if (
      req.files &&
      (Array.isArray(req.files)
        ? req.files.length > 0
        : Object.keys(req.files).length > 0)
    ) {
      uploadedUrls = await uploadPicturesToS3(req)
    }

    if (uploadedUrls.pictures?.length) {
      req.body.pictures = uploadedUrls.pictures
    }

    if (uploadedUrls.documents?.length) {
      req.body.documents = uploadedUrls.documents
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty,
    })
  } catch (error: any) {
    console.error('Update property error:', error)
    return handleError(res, error)
  }
}
