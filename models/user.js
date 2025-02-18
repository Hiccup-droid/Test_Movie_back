import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    u_username: {
        type: String,
        required: true
    },
    u_password: {
        type: String,
        required: true
    },
    u_email: {
        type: String,
        required: true
    },
    u_account_type: {
        type: String,
        required: true,
        default: 'admin' // 'admin', 'client', 'pilot'
    },
    u_certs: [{
        name: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        }
    }],
    u_address: {
        type: String,
    },
    u_operation_radius: {
        type: Number
    },
    u_confirmed: {
        type: Boolean,
        default: false // 'false', 'true'
    },
    u_confrimation_token: {
        type: String
    }
})

const User = mongoose.model('app_user', userSchema);

export default User;    