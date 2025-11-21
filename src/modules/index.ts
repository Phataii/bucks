import { Router } from "express";
import { jwtGuard } from "../middlewares/auth-guard";
import userRoutes from "./users";
import walletRoutes from "./wallets";
import adminRoutes from "./admins";
import webhookRoutes from "./webhook";

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
    '/api/v1/webhook/graph',
    
    '/api/v1/email-template/create',
  ]
});


router.use(userRoutes);
router.use(walletRoutes);
router.use(adminRoutes);
router.use(webhookRoutes);

secured.use('/api/v1', jwt, router);

export default secured;