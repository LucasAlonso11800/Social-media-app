const { GraphQLString } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const UserType = require('../Types/UserType');

const ADD_USER = {
    name: 'ADD_USER',
    type: UserType,
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        confirmPassword: { type: GraphQLString },
        email: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const { username, password, confirmPassword, email } = args
        try {
            const newUser = new User({
                username,
                password,
                email,
                createdAt: new Date().toISOString()
            })
            newUser.password = await bcrypt.hash(password, 10);
            const res = await User.insertMany(newUser)
            const token = jwt.sign({
                id: res[0]._id,
                email: res[0].email,
                username: res[0].username,
            }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

            return {
                id: res[0]._id,
                username: res[0].username,
                email: res[0].email,
                createdAt: res[0].createdAt,
                token
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }
}

module.exports = ADD_USER