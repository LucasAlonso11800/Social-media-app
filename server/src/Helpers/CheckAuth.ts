import jwt from 'jsonwebtoken';
import { IContext } from "../Interfaces";

export default function checkAuth(context: IContext){
    const authHeader = context.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
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