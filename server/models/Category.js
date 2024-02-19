import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
    }
})

export default model('Category', CategorySchema);