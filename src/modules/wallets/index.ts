import { Router } from "express";
import WalletController from "./wallet.controller";

const controller = new WalletController();
const router = Router();

router.post('/wallet/create-pin', controller.createPin)
router.put('/wallet/change-pin', controller.changePin)
router.post('/wallet/create', controller.requestNGNAccount)
router.get('/account', controller.getAccount)


router.post("/account/graph/webhook", controller.handleGraphWebhook);
export default router;