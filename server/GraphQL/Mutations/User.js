const { GraphQLString } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const UserType = require('../Types/UserType');

function generateToken(user) {
    return jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username,
    }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
};

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
            if (password !== confirmPassword) throw new Error("Passwords don't match")

            const user = await User.findOne({ username });
            if (user) throw new Error('Username already taken');

            const newUser = new User({
                username,
                password,
                email,
                createdAt: new Date().toISOString()
            })
            newUser.password = await bcrypt.hash(password, 10);
            const res = await User.insertMany(newUser)
            const token = generateToken(res[0])

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
};

const LOGIN_USER = {
    name: 'LOGIN_USER',
    type: UserType,
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        confirmPassword: { type: GraphQLString },
        email: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const { username, password } = args
        const user = await User.findOne({ username })

        if (!user) throw new Error('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Wrong username or password');

        const token = generateToken(user)
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            token
        }
    }
};

module.exports = { ADD_USER, LOGIN_USER }