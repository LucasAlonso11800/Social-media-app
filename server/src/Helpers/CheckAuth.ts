import jwt, { JwtPayload } from 'jsonwebtoken';
import { IContext } from "../Interfaces";

export default function checkAuth(context: IContext){
    const authHeader = context.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload
                const tokenIsExpired = user.exp ? user.exp * 1000 < Date.now() : true;
                if(tokenIsExpired) throw new Error("Your session has expired. Please log in again")
                return user
            }
            catch(err: any){
                throw new Error(err)
            }
        }
        throw new Error("Auth token not provided")
    }
    throw new Error("Auth header not provided")
};