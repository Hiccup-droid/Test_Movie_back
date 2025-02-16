import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import Job from '../models/job.js';
import JobFile from '../models/job_file.js';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
/************************************
 * API functions for client Requests *
*************************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @description Creates a new job, its default "Images" folder, and optionally inserts polygons if provided.
 * @param req - Request object that contains the job details.
 * @param res - Response object to send back the result.
 */
export const createJobByClient = (req, res) => {
    const { title, description, budget, address, geometry, userId } = req.body;

    // Insert new job record into the jobs table

    console.log(userId);
    
    const newJob = new Job({
        j_title: title,
        j_description: description,
        j_budget: budget,
        j_address: address,
        j_polygons: geometry,
        j_creator: userId,
    });
    
    newJob.j_folders.push({name: 'Images'});

    newJob
    .save()
    .then(() => {
        return res.status(200).json({ success: true, message: 'Successful to save job' });
    })
    .catch(err => {
        console.log(err);
        
        return res.status(500).json({ success: false, message: 'Failed to save job' });
    })
}

/**
 * @description Fetches detailed information about a specific job based on its ID.
 * @param req - Request object that contains the job ID in the parameters.
 * @param res - Response object to send back the job details.
 */
export const getJobDetailByClient = (req, res) => {
    const { id } = req.params;

    // Fetch job details by job ID
    Job.findById(id)
    .then(job => {
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Return the fetched job details
        res.status(200).json({ success: true, job });
    })
    .catch((err) => {
        return res.status(500).json({ success: false, message: 'Failed to fetch job details' });
    });
}

/**
 * @description Fetches a list of jobs for a specific user.
 * @param req - Request object that contains the user ID in the query parameters.
 * @param res - Response object to send back the list of jobs.
 */
export const getJobListByClient = (req, res) => {
    const userId = req.query.userId;

    // Fetch all jobs by user ID
    Job
    .find({j_creator: userId})
    .then(jobs => {
        return res.status(200).json({jobs, success: true});
    })
    .catch(err => {
        console.log(err);
        
        return res.status(500).json({jobs: [], success: false});
    })
}

/**
 * @description Creates a new folder for a specific job.
 * @param req - Request object that contains the job ID in the parameters and the folder name in the body.
 * @param res - Response object to send back the result.
 */
export const createFolderByJobId = async (req, res) => {
    const { jobId } = req.params; // Get jobId from the URL
    const { name } = req.body;   // Get folder name from the request body

    // Validate the folder name and job ID
    if (!name || !jobId) {
        res
            .status(400)
            .json({ success: false, message: 'Invalid folder name or job ID' });
    }

    // Insert the new folder into the folders table
    Job
    .findById(jobId)
    .then((job) => {
        job.j_folders.push({name: name});

        job
        .save()
        .then(() => {

            return res.status(201).json({
                success: true,
                message: 'Successfully created.',
            });
        })
        .catch((err) => {
            if (err) {
                console.error('Failed to create folder:', err);
                return res
                    .status(500)
                    .json({ success: false, message: 'Failed to create folder' });
            }
        })
    })
    .catch(err => {
        if(err) {
            console.error('Failed to create folder:', err);
            return res.status(500).json({ success: false, message: 'Failed to create folder' });
        }
    })
}

/**
 * @description Fetches the list of files for a specific job and folder combination.
 * @param req - Request object that contains job ID and folder ID in the parameters.
 * @param res - Response object to send back the list of files.
 */
export const getFilesByFolderId = (req, res) => {
    const { folderId } = req.params;

    // Fetch all files for the given job and folder IDs
    JobFile
    .find({jf_folder: folderId})
    .then((files) => {
        if (!files || files.length === 0) {
            console.warn(`No files found for folder ${folderId}`);
            return res.status(200).json({ success: false, message: 'No files found for this folder', files: [] });
        }

        console.log(`Files found for folder ${folderId}:`, files);
        res.status(200).json({ success: true, files });
    })
    .catch((err) => {
        console.error('Database error fetching files:', err);
        return res.status(500).json({ success: false, message: 'Database error occurred' });
    });
}

/**
 * @description Handles the file upload for a specific job and folder.
 * @param req - Request object that contains job ID and folder ID in the parameters.
 * @param res - Response object to send back the result.
 */
export const uploadJobFiles = (req, res) => {
    const { folderId, jobId } = req.params;

    const uploadDir = path.join(__dirname, '../uploads/jobs');
    const form = formidable({ keepExtensions: true });

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parse the form to handle file uploads
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing the files:', err);
            return res.status(500).json({ success: false, message: 'File upload error' });
        }

        if (!jobId || !folderId) {
            return res.status(400).json({ success: false, message: 'Invalid job ID or folder ID' });
        }

        const fileEntries = files.files;

        fileEntries?.forEach(async (file) => {
            const oldPath = file.filepath;
            const newPath = path.join(uploadDir, file.newFilename);

            // Move the uploaded file to the designated folder
            fs.writeFileSync(newPath, fs.readFileSync(oldPath));

            // Insert file record into the database
            let newFile = new JobFile({jf_folder: folderId, jf_path: file.newFilename})
            await newFile.save();
        })

        res.status(200).json({ success: true, message: 'Files uploaded successfully' });
    });
};

export const getJobListByPilot = (req, res) => {
    Job
    .find({j_status: 'Approved'})
    .populate([
        {path: 'j_creator'}
    ])
    .then(jobs => {
        return res.status(200).json({success: true, jobs});
    })
}

export const getJobDetailByPilot = (req, res) => {
    const { id } = req.params;

    // Fetch job details by job ID
    Job
    .findById(id)
    .populate([
        {path: 'j_creator'}
    ])
    .then(job => {
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Return the fetched job details
        res.status(200).json({ success: true, job });
    })
    .catch((err) => {
        return res.status(500).json({ success: false, message: 'Failed to fetch job details' });
    });
}

export const getJobListByAdmin =  (req, res) => {
    const { status } = req.body;

    let match = {};
    match = status ? {...match, j_status: status} : match;

    Job
    .find(match)
    .populate([
        {path: 'j_creator'}
    ])
    .then(jobs => {
        return res.status(200).json({jobs, success: true});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({jobs: [], success: false});
    })
}

export const updateJobStatusByAdmin = (req, res) => {
    const { jobId } = req.params;
    const { status } = req.body;

    Job
    .findByIdAndUpdate(jobId, {j_status: status})
    .then(() => {
        return res.status(200).json({success: true, message: "Updated successfully."});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({status: false, message: "Update failed"});
    })
}