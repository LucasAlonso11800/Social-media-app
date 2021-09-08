import { IUser } from "../Interfaces";
import jwt from 'jsonwebtoken';

export const generateToken = (user: IUser) => {
    return jwt.sign({
        id: user.user_id,
        username: user.user_username,
    }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' })
};