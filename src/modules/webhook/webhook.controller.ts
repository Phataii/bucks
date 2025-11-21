import { webhookQueue } from "./webhook.queue";
import { Request, Response } from "express";

export class WebhookController {

    async receiveWebhook(req: Request, res: Response) {

        // enqueue the webhook for async processing
        await webhookQueue.add("graph-event", req.body);

        // return immediately (VERY important)
        return res.status(200).json({ received: true });
    }
}
