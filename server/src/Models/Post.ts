import { model, Schema } from 'mongoose';

const postSchema = new Schema({
    body: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    comments: {
        type: [
            {
                body: {
                    type: String,
                },
                username: {
                    type: String,
                },
                createdAt: {
                    type: String
                },
                likes: {
                    type: [
                        {
                            username: String,
                            createdAt: {
                                type: String
                            }
                        }
                    ]
                }
            }
        ]
    },
    likes: {
        type: [
            {
                username: {
                    type: String
                },
                createdAt: {
                    type: String
                }
            }
        ]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createdAt: {
        type: String,
    }
});

export default model('Post', postSchema);