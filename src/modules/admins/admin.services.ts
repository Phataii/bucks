import Account from "../../models/account.model";
import { EmailService } from "../../utils/email-service";
import Logger from "../../utils/logger";
import { NotFoundException } from "../../utils/service-exceptions";



export default class AdminServices {
    private logger = new Logger('users-service');
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
       
    }

    inviteaAdmin = async () => {

    }

    getGraphAccounts = async () => {
        const account = await Account.find().lean();
        return account;
    }

    
}