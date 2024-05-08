import { Schema, model } from 'mongoose';

const UserSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    about:{
        type: String,
    },
    avatar: {
        type: String,
    },
    socials: {
        linkedin: {
            type: String,
        },
        github: {
            type: String,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

})

export default model('User', UserSchema);