import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import Job from '../models/job.js';
import JobFile from '../models/job_file.js';
import mongoose from 'mongoose';
/************************************
 * API functions for client Requests *
*************************************/

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
    Job.findById(jobId, (err, job) => {
        if(err) {
            console.error('Failed to create folder:', err);
            return res.status(500).json({ success: false, message: 'Failed to create folder' });
        }
        job.j_folders.push({name: name});

        job.save((err) => {
            if (err) {
                console.error('Failed to create folder:', err);
                return res
                    .status(500)
                    .json({ success: false, message: 'Failed to create folder' });
            }

            return res.status(201).json({
                success: true,
                message: 'Successfully created.',
                folders: job.j_folders
            });
        })
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
    JobFile.find({jf_folder: folderId}, (err, files) => {
        if (err) {
            console.error('Database error fetching files:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }

        if (!files || files.length === 0) {
            console.warn(`No files found for folder ${folderId} in job ${jobId}`);
            return res.status(200).json({ success: false, message: 'No files found for this folder' });
        }

        console.log(`Files found for folder ${folderId}:`, files);
        res.status(200).json({ success: true, files });
    });
}

/**
 * @description Handles the file upload for a specific job and folder.
 * @param req - Request object that contains job ID and folder ID in the parameters.
 * @param res - Response object to send back the result.
 */
export const uploadFiles = (req, res) => {
    const { folderId } = req.params;

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
            let newFile = new JobFile({jf_folder: folderId, jf_path: newPath})
            await newFile.save();
        })

        res.status(200).json({ success: true, message: 'Files uploaded successfully' });
    });
};