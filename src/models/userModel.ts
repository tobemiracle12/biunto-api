import mongoose, { Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  phoneNumber: string
  password: string
  picture: string
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
