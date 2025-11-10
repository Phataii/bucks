import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import { BadRequestException } from "../utils/service-exceptions";

export const jwtGuard = (params: { credentialsRequired: boolean}) => expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ['HS256'],
  credentialsRequired: params.credentialsRequired,
  requestProperty: "auth",
});


export default async function isSuperAdmin(req: Request, res: Response, next: NextFunction) {
  // Check if auth exists and has userId
  // if (!req.auth || !req.auth.userId) {
  //   return res.status(401).json({ message: 'Authentication required' });
  // }

  // req.user = { userId: "" };

  try {
    // const user = await User.findOne({ where: { id: userId } });

    // if (!user || user.userLevel !== UserLevel.Admin) {
    //   return res.status(403).json({ message: 'Unauthorized: Only super admins can perform this action' });
    // }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in isSuperAdmin middleware:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}