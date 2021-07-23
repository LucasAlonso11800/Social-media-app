const jwt = require('jsonwebtoken');


function checkAuth(context){
    const authHeader = context.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
                return user
            }
            catch(err){
                throw new Error(err)
            }
        }
        throw new Error("Auth token not provided")
    }
    throw new Error("Auth header not provided")
};

module.exports = checkAuth