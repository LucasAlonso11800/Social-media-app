import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
    },
    image: {
        type: String 
    },
    followers: {
        type: [
            {
                username: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String
                }
            }
        ]
    },
    following: {
        type: [
            {
                username: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String
                }
            }
        ]
    }
})

export default model('User', userSchema);