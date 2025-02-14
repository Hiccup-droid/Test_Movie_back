/**
 * Schema for jobs
 */

import mongoose, { Schema } from "mongoose";

const folderShcmea = new Schema({
    name: {
        type: String,
        required: true
    }
})

const jobSchema = new Schema({
    j_title: {
        type: String,
        required: true
    },
    j_description: {
        type: String,
        required: true
    },
    j_budget: {
        type: Number,
        required: true,
        default: 0
    },
    j_status: {
        type: String,
        required: true,
        default: 'Pending', // 'Pending', 'Approved'
    },
    j_creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "app_user"
    },
    j_address: {
        type: String,
        required: true,
    },
    j_polygons: {
        type: String,
    },
    j_folders: [folderShcmea],
    j_developers: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "app_user"
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    j_is_done: {
        type: Boolean,
        default: false
    }
})

const Job = mongoose.model('app_job', jobSchema);

export default Job;