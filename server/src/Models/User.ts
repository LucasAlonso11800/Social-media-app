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
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profiles'
    },
})

export default model('User', userSchema);