import { Router } from "express";
import { jwtGuard } from "../middlewares/auth-guard";
import userRoutes from "./users"
import walletRoutes from "./wallets"
import adminRoutes from "./admins"

const router = Router();
const secured = Router();

const jwt = jwtGuard({ credentialsRequired: true }).unless({
  path: [
    '/',
    '/api/v1/users/signup',
    '/api/v1/users/login',
    '/api/v1/users/resend-otp',
    '/api/v1/users/verify-otp',
    '/api/v1/users/forgot-password',
    '/api/v1/users/reset-password',
    '/api/v1/account/graph/webhook',
    
    '/api/v1/email-template/create',
  ]
});


router.use(userRoutes);
router.use(walletRoutes);
router.use(adminRoutes);

secured.use('/api/v1', jwt, router);

export default secured;