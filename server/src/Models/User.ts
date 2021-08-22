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
                }
            }
        ]
    },
    blockedUsers: {
        type: [
            {
                username: {
                    type: String,
                    required: true
                }
            }
        ]
    }
})

export default model('User', userSchema);