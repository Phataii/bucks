import { Router } from "express";
import { WebhookController } from "./webhook.controller";

const controller = new WebhookController();
const router = Router();

router.post("/webhook/graph", controller.receiveWebhook);
export default router;