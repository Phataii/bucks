import { Router } from "express"
import AdminController from "./admin.controller"


const controller = new AdminController()
const router = Router()


router.get('/admin/bank-accounts', controller.getAccounts)

export default router;