/**
 * Schema for storing the claim request
 */

import mongoose, { Schema } from 'mongoose';

const claimSchema = new Schema({
    c_job_owner: {
        type: Schema.Types.ObjectId,
        requried: true,
        ref: "app_user"
    },
    c_job: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "app_job"
    },
    c_content: {
        type: String,
        required: true
    },
    c_claimer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "app_user"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Claim = mongoose.model("app_claim", claimSchema);

export default Claim;