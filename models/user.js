import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const User = mongoose.model('app_user', userSchema);

export default User;    