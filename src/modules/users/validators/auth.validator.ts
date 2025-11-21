import { Joi, validate } from "express-validation";
import { signUpDTO } from "../interfaces/user.types";


export const signUp = validate({
  body: Joi.object<signUpDTO>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    otherName: Joi.string().optional(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    dob: Joi.string().required(),
    gender: Joi.string().required(),
  })
})