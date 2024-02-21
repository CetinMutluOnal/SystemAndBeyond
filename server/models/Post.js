import { Schema, model } from 'mongoose';
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }
});

export default model('Post', PostSchema);