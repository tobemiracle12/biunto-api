import mongoose, { Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  phoneNumber: string
  password: string
  gender: string
  picture: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  occupation: string
  originCountry: string
  originState: string
  originArea: string
  residentCountry: string
  residentState: string
  residentArea: string
  address: string
  nextOfKinName: string
  nextOfKinPhone: string
  validID: string
  iDType: string
  birthCertificate: string
  facePassport: string
  userLng: number
  userLat: number
  role: string
  userStatus: string
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'A user with this email already exists'],
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    lowercase: true,
  },
  username: { type: String },
  phoneNumber: { type: String },
  picture: { type: String },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  dateOfBirth: { type: Date },
  occupation: { type: String },
  originCountry: { type: String },
  originState: { type: String },
  originArea: { type: String },
  residentCountry: { type: String },
  residentState: { type: String },
  residentArea: { type: String },
  address: { type: String },
  nextOfKinName: { type: String },
  nextOfKinPhone: { type: String },
  validID: { type: String },
  iDType: { type: String },
  birthCertificate: { type: String },
  facePassport: { type: String },
  userLng: { type: Number },
  userLat: { type: Number },
  role: { type: String },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  userStatus: { type: String, default: 'User' },
})

export const User = mongoose.model<IUser>('User', UserSchema)
