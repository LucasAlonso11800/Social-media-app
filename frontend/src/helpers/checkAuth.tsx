import { GlobalState, IDecodedToken } from '../Interfaces';
import jwtDecode from "jwt-decode";

export function checkAuth(): GlobalState {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decodedToken: IDecodedToken = jwtDecode(token);

    const tokenIsExpired = decodedToken.exp * 1000 < Date.now();

    if (tokenIsExpired) {
        localStorage.removeItem("token");
        return null
    };

    if (!tokenIsExpired) {
        return {
            id: decodedToken.id,
            username: decodedToken.username,
            token
        };
    };
    
    return null
};