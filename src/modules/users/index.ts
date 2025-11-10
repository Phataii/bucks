import { Router } from 'express';
import UserController from "./user.controller";
import * as vA from "./validators/auth.validator";

const controller = new UserController()
const router = Router()


router.post('/users/signup', controller.signUp)
router.post('/users/login', controller.login)
router.post('/users/resend-otp', controller.resendOtp)
router.post('/users/verify-otp', controller.verifyOtp)
router.post('/users/forgot-password', controller.forgotPassword)
router.post('/users/reset-password', controller.resetPassword)
router.get('/users/me', controller.profile)
router.put('/users/update-graph-person', controller.updateGraphPerson)

router.post('/users/email-template/create', controller.createEmailTemplate)
export default router;