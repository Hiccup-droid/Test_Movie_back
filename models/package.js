import mongoose, { Schema } from "mongoose";

export const packageItemSchema = new Schema({
    name: {
        type: String,
        requried: true
    },
    type: {
        type: String,
        requried: true 
    },
    altitude: String,
    count: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const packageSchema = new Schema({
    p_category_name: {
        type: String,
        required: true
    },
    p_items: [packageItemSchema],
})

const Package = mongoose.model("app_package", packageSchema);

export default Package;