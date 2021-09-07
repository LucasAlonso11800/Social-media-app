import { IUser } from "../Interfaces";
import jwt from 'jsonwebtoken';

export const generateToken = (user: IUser) => {
    return jwt.sign({
        id: user.user_id,
        email: user.user_email,
        username: user.user_username,
        country: user.user_country,
        city: user.user_city,
        birthDate: user.user_birth_date,
        followers: user.user_followers ? user.user_followers : [],
        following: user.user_following ? user.user_following : [],
        blockedUsers: user.user_blocked_users ? user.user_blocked_users : []
    }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' })
};