
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import WalletService from "./wallet.service";



export default class WalletController {
    private walletService: WalletService;

    constructor() {
        this.walletService = new WalletService();
    }

    createWallet = asyncHandler(async (req: Request, res: Response) =>{
        const result = await this.walletService.createWallet(req.auth.userId, req.body);
        res.status(201).json(result);
    })

    getAccount = asyncHandler(async (req: Request, res: Response) =>{
        const result = await this.walletService.getAccount();
        res.status(201).json(result);
    })


    handleGraphWebhook = asyncHandler(async (req: Request, res: Response) => {
        // Acknowledge receipt quickly
        res.status(200).send("ok");

        // Process event asynchronously
        const event = req.body;
        await this.walletService.handleGraphWebhook(event);
    });
}