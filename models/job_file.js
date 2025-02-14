import mongoose, { Schema } from "mongoose";

const jobFileSchema = new Schema({
    jf_folder: {
        type: String,
        required: true
    },
    jf_path: {
        type: String,
        required: true
    }
})

const JobFile = mongoose.model('app_job_file', jobFileSchema);

export default JobFile;