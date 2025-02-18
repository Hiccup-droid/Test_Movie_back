import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import User from '../models/user.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUserDetail = (req, res) => {
    const userId = req.params.userId;

    User
        .findById(userId)
        .then((user) => {
            console.log(user);
            
            return res.status(200).json({ success: true, user });
        })
        .catch(err => {
            console.log(err);
            return res.status(402).json({ success: false, user: null });
        })
}

export const uploadCertFiles = (req, res) => {
    const { userId } = req.params;

    const uploadDir = path.join(__dirname, '../uploads/certs');
    const form = formidable({ keepExtensions: true });

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    console.log(">>>>>>>>>>>>!!!!!!!!!!!!!!!");

    // Parse the form to handle file uploads
    form.parse(req, (err, fields, files) => {
        console.log(">>>>>>>>>>>>");

        if (err) {
            console.error('Error parsing the files:', err);
            return res.status(500).json({ success: false, message: 'File upload error' });
        }

        console.log(fields.name[0], files.file[0]);

        const file = files.file[0];

        const oldPath = file.filepath;
        const newPath = path.join(uploadDir, file.newFilename);



        // Move the uploaded file to the designated folder
        fs.writeFileSync(newPath, fs.readFileSync(oldPath));

        User
            .findByIdAndUpdate(userId, { $push: { u_certs: { name: fields.name[0], path: file.newFilename } } })
            .then(() => {
                return res.status(200).json({ message: "Successfully added.", success: true, job: { path: file.newFilename, name: fields.name } });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ message: 'Certificate Add Failed.', success: false });
            })
    });
}

export const getUserCertificateList = (req, res) => {
    const { userId } = req.params;

    User
        .findById(userId)
        .then(user => {
            return res.status(200).json({ success: true, certs: user.u_certs });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ success: false, certs: [] });
        })
}

export const updatePilotProfile = (req, res) => {
    const userData = req.body;

    User
        .findByIdAndUpdate(userData._id, userData)
        .then(user => {
            return res.status(200).json({ success: true, user, message: 'Successfully updated.' });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ success: false, user: {}, message: "Update Failed" });
        })
}