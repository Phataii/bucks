import { Router } from "express";
import WalletController from "./wallet.controller";

const controller = new WalletController();
const router = Router();

router.post('/wallet/create-pin', controller.createTransactionPin)
router.put('/wallet/change-pin', controller.changeTransactionPin)
router.post('/wallet/create', controller.requestNGNAccount)
router.get('/wallet/account-details/:currencyId', controller.getAccountDetails)
router.get('/wallet/get-active-currencies', controller.getCurrencies)

router.post("/account/graph/webhook", controller.handleGraphWebhook);
export default router;