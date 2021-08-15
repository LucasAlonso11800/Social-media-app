import { model, Schema } from 'mongoose';

const profileSchema = new Schema({
    profileName: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

export default model('Profile', profileSchema);