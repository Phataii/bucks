import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import AdminServices from "./admin.services";

export default class AdminController {
    private adminService: AdminServices;

    constructor(){
         this.adminService = new AdminServices();
    }

    // inviteAdmin = asyncHandler(async(req: Request, res: Response) => {
    //     const result = await this.adminService
    // })

     getAccounts = asyncHandler(async(req: Request, res: Response) => {
        const result = await this.adminService.getGraphAccounts();
        res.status(200).json(result); 
    })
}