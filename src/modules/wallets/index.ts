import { Router } from "express";
import WalletController from "./wallet.controller";

const controller = new WalletController();
const router = Router();

router.post('/account/create', controller.createWallet)
router.get('/account', controller.getAccount)


router.post("/account/graph/webhook", controller.handleGraphWebhook);
export default router;