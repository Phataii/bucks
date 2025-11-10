import { Request, Response } from "express";
import UserService from "./user.service";
import { asyncHandler } from "../../utils/async-handler";


export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
  
  signUp = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.signUp(req.body);
    res.status(201).json(result);
  })

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.verifyOtp(req.body.email, req.body.otp);
    res.status(200).json(result);
  })

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.resendOtp(req.body.email);
    res.status(200).json(result);
  })

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.login(req.body);
    res.status(200).json(result);
  })

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.forgotPassword(req.body.email);
    res.status(200).json(result);
  })

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.resetPassword(req.body.otp, req.body.newPassword);
    res.status(200).json(result);
  })

  profile = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.profile(req.auth.userId);
    res.status(200).json(result);
  })

  updateGraphPerson = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.updateGraphPerson(req.auth.userId, req.body);
    res.status(200).json(result);
  })

  ////////
  /////
  // EMAIL TEMPLATE
  createEmailTemplate = async (req: Request, res: Response) => {
    const result = await this.userService.createEmailTemplate(req.auth.userId, req.body);
    res.status(201).json(result);
  }
}