import mongoose, { Schema } from 'mongoose'

export interface IPlace extends Document {
  continent: string
  country: string
  countryCapital: string
  state: string
  area: string
  landmark: string
  zipCode: string
  countryCode: string
  countryFlag: string
  stateCapital: string
  stateLogo: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
}

const PlaceSchema: Schema = new Schema(
  {
    landmark: { type: String, default: '' },
    area: { type: String },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    countryCapital: { type: String, default: '' },
    stateCapital: { type: String, default: '' },
    stateLogo: { type: String, default: '' },
    continent: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    countryCode: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Place = mongoose.model<IPlace>('Place', PlaceSchema)
