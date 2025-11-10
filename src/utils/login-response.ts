import jwt from 'jsonwebtoken';
import { IUser } from "../models/user.model"

export const loginResponse = async (user: IUser) => {

  const accessToken = generateAccessToken({ userId: user._id })
  return {
    accessToken,
    user: { ...user, password: undefined }
  };

}
export const generateAccessToken = (payload: { userId: string}) => {
  const { userId } = payload;
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { algorithm: 'HS256', expiresIn: '24h', audience: 'dashboard', issuer: 'bucks', },
  );

  return accessToken;
}