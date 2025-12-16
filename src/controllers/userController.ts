import { Request, Response } from 'express'
import { handleError } from '../utils/errorHandler'
import { queryData, search } from '../utils/query'
import { uploadFilesToS3 } from '../utils/fileUpload'
import bcrypt from 'bcryptjs'
import { IUser, User } from '../models/userModel'
import { sendEmail } from '../utils/sendEmail'

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, username, phoneNumber } = req.body
    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: await bcrypt.hash(password, 10),
    })

    await newUser.save()
    await sendEmail('', email, 'welcome')
    res.status(200).json({
      message: 'User created successfully',
      user: newUser,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUser>(User, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      message: 'Your profile was updated successfully',
      data: user,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
