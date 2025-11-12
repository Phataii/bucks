import bcrypt from "bcryptjs";
import User, { IUser } from "../../models/user.model";
import Logger from "../../utils/logger";
import { BadRequestException, NotFoundException } from "../../utils/service-exceptions";
import { loginDTO, signUpDTO } from "./interfaces/user.types";
import redisClient, { limitCalls } from "../../utils/redis";
import { findUser } from "../../utils/finder-helper";
import { randomGen } from "../../utils/random-gen";
import { loginResponse } from "../../utils/login-response";
import { EmailService } from "../../utils/email-service";
import { createEmailTemp } from "../common/interfaces/common.types";
import EmailTemplate from "../../models/email-template.model";
import GraphIntegration from "../graph-integration/graph";
import { updatePerson, uploadDocuments } from "../graph-integration/interfaces/graph.interface";


export default class UserService {
    private logger = new Logger('users-service');
    private emailService: EmailService;
    private graphApi: GraphIntegration;

    constructor() {
        this.emailService = new EmailService();
        this.graphApi = new GraphIntegration();
    }

    signUp = async (payload: signUpDTO) => {
        const email = payload.email.toLowerCase();
        const username = payload.username?.toLowerCase()
        const userExist = await User.findOne({ $or: [{ email }, { username }] });    

        if(userExist)
            throw new BadRequestException("user already exist.")

        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const user = await User.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            otherName: payload.otherName || "",
            phone: payload.phone,
            gender: payload.gender,
            address: {
                address: payload.address.address,
                city: payload.address.city,
                state: payload.address.state,
                country: payload.address.country,
                postalCode: payload.address.postalCode
            },
            dob: payload.dob,
            username:payload.username,
            email: payload.email,
            password: hashedPassword,
            referralCode: username,
            referreedBy: payload.referralBy || null
        });
         
        const otp = randomGen('numeric', 6)
        await redisClient.setEx(`otp:${otp}`, 60 * 10, user._id.toString());
       
        await Promise.all([
            this.emailService.sendWelcomeEmail("welcome", user.email, user.username),
            this.emailService.sendConfirmEmail("confirm", user.email, {
                name: user.username,
                otp,
            }),
        ]);

        return {
            message: "User has been created successfully"
        };
    }

    resendOtp = async (email: string) => {
        const user = await findUser(email);

        const rateKey = `resend-otp:${user._id}`;
        const canProceed = await limitCalls(rateKey, 5, 60 * 60); // 5 per hour

        if (!canProceed) {
            throw new BadRequestException('Too many requests. Please try again later');
        }

        if (user.emailVerified) {
            throw new BadRequestException('Email already verified');
        }

        const otp = randomGen('numeric', 6);
        await redisClient.setEx(`otp:${otp}`, 60 * 10, user._id.toString());

        await this.emailService.sendConfirmEmail("confirm", user.email, {
          name: user?.username,
          otp,
        });

        return { message: 'OTP sent successfully' };
    };

    verifyOtp = async (email: string, otp: string) => {
        const user = await findUser(email);

        if (!user) throw new NotFoundException('User not found');
        if (user.emailVerified) throw new BadRequestException('Email already verified');
        
        const redisKey = `otp:${otp}`;
        const storedOtp = await redisClient.get(redisKey);
        if (!storedOtp) throw new BadRequestException('OTP expired or invalid');

        await User.updateOne(
            { _id: user._id },
            { $set: { emailVerified: true } }
        );

        await redisClient.del(redisKey);

        return { message: 'Verification successfully' };
    };

    login = async (payload: loginDTO) => {
        const emailOrUsername = payload.email.toLowerCase();
        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] }).lean<IUser>();
        if(!user) throw new BadRequestException("Invalid Login Credentials")

        const isPasswordValid = await bcrypt.compare(payload.password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

        if (!user.emailVerified) {
            throw new BadRequestException('Your email address has not been verified. Please check your inbox for a verification link or request a new one')
        }

        await this.emailService.sendLoginAlert("loginalert", user.email, {
          name: user?.username,
        });
        return loginResponse(user)
    }

    forgotPassword = async (email: string) => {
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (user) {
            const otp = randomGen('numeric', 6);

            await redisClient.setEx(`reset-password:${otp}`, 60 * 10, user._id.toString());
            await this.emailService.sendConfirmPasswordReset(
            "forgotpassword",
            user.email,
            {
                name: user.username,
                otp,
            }
            );
        }

        return {
            message:
            "If an account exists with this email, a password reset code has been sent to it",
        };
    };


    resetPassword = async (otp: string, newPassword: string) => {
        const redisKey = `reset-password:${otp}`;
        const userId = await redisClient.get(redisKey);
        if (!userId) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
        );

        await redisClient.del(redisKey);

        return { message: "Password reset successfully" };
    };

    logout = async () => {

    }

    profile = async (userId: string) => {
        const user = await User.findOne({ _id: userId }).lean();
        if(!user) throw new NotFoundException("user not found");

        return user;
    }

    updateGraphPerson = async (userId: string, payload: updatePerson) => {
        const user = await User.findOne({ _id: userId }).lean();
        if(!user || !user.personId) throw new NotFoundException("user not found");

        const update = await User.updateOne(
            { _id: user._id },
            { $set: { graphMetadata: {
                employmentStatus: payload.employmentStatus,
                occupation: payload.occupation,
                primaryPurpose: payload.primaryPurpose,
                sourceOfFunds: payload.sourceOfFunds,
                expectedMonthlyInflow: payload.expectedMonthlyInflow
            } } }
        );

        const graphPayload = {
            employmentStatus: payload.employmentStatus,
            occupation: payload.occupation,
            primaryPurpose: payload.primaryPurpose,
            sourceOfFunds: payload.sourceOfFunds,
            expectedMonthlyInflow: payload.expectedMonthlyInflow,
            // documents: payload.documents?.map((doc) => ({
            //     type: doc.type,
            //     url: doc.url,
            //     issueDate: doc.issueDate,
            //     expiryDate: doc.expiryDate,
            // })) || [],
        };
        const response = await this.graphApi.updatePerson(graphPayload, user.personId);

        return {
            message: "User has been updated",
            data: response
        };
    }

    uploadDocuments = async (userId: string, payload: uploadDocuments) => {
        const user = await User.findOne({ _id: userId }).lean();
        if(!user || !user.personId) throw new NotFoundException("user not found");

        const graphPayload = {
                type: payload.type,
                url: payload.url,
                issueDate: payload.issueDate,
                expiryDate: payload.expiryDate,
            }
        const response = await this.graphApi.uploadDocument(user.personId, graphPayload);
        return {
            message: "User has been updated",
            data: response
        };
    }

    ////////
    // EMAIL TEMPLATE

    createEmailTemplate = async (userId: string, payload: createEmailTemp) => {
        const name = payload.name.toLowerCase();
        const exist = await EmailTemplate.findOne({ name });    

        if(exist){
            throw new BadRequestException("template already exist.")
        }

        const user = await EmailTemplate.create({
            name,
            subject: payload.subject,
            body: payload.body,
            createdBy: userId,
        });

        return {
            message: `${payload.name} Template created successfully`,
            data: user,
        };
    }
}