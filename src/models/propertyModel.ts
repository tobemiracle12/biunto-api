import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
  name: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  features: string[]
  description: string
  documents: string[]
  pictures: string[]
  lng: number
  lat: number
  propertyType: string[]
}

const PropertySchema = new Schema(
  {
    name: { type: String },
    address: { type: String },
    price: { type: Number },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number },
    description: { type: String },
    documents: { type: Array, default: [] },
    pictures: { type: Array, default: [] },
    lng: { type: Number }, // fix spelling
    lat: { type: Number },
    propertyType: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

// 🔥 FIX: Prevent OverwriteModelError
export const Property = mongoose.model<IProperty>('Property', PropertySchema)
