
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import WalletService from "./wallet.service";


export default class WalletController {
    private walletService: WalletService;

    constructor() {
        this.walletService = new WalletService();
    }

    requestNGNAccount = asyncHandler(async (req: Request, res: Response) =>{
        const result = await this.walletService.requestAccount(req.auth.userId, req.body);
        res.status(201).json(result);
    })

    createTransactionPin = asyncHandler(async (req: Request, res: Response) =>{
        const result = await this.walletService.createTransactionPin(req.auth.userId, req.body.pin);
        res.status(201).json(result);
    })

    changeTransactionPin = asyncHandler(async (req: Request, res: Response) =>{
        const result = await this.walletService.changeTransactionPin(req.auth.userId, req.body);
        res.status(200).json(result);
    })

    getAccountDetails = asyncHandler(async (req: Request, res: Response) =>{
        const result = await this.walletService.getAccountDetails(req.auth.userId, req.params.currencyId);
        res.status(200).json(result);
    })

    getCurrencies = asyncHandler(async (req: Request, res: Response) =>{
        const result = await this.walletService.getActiveCurrencies();
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