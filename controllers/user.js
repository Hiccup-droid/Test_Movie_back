import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import User from '../models/user.js';

export const getUserDetail = (req, res) => {
    const userId = req.params.userId;

    User.findById(userId, (err, user) => {
            if(err) {
                console.log(err);
                return res.status(402).json({ success: false, user: null });
            }

            return res.status(200).json({ success: true, user });
        }
    )
}

export const uploadCertFiles = (req, res) => {
    // const userId = req.query.userId;
    
    // const uploadDir = path.join(__dirname, '../uploads/certs');
    // const form = formidable({ keepExtensions: true });

    // // Ensure the upload directory exists
    // if (!fs.existsSync(uploadDir)) {
    //     fs.mkdirSync(uploadDir, { recursive: true });
    // }

    // // Parse the form to handle file uploads
    // form.parse(req, (err, fields, files) => {
    //     if (err) {
    //         console.error('Error parsing the files:', err);
    //         return res.status(500).json({ success: false, message: 'File upload error' });
    //     }

    //     const fileEntries = files.files;

    //     let newFiles = [];

    //     fileEntries?.forEach((file) => {
    //         const oldPath = file.filepath;
    //         const newPath = path.join(uploadDir, file.newFilename);

    //         // Move the uploaded file to the designated folder
    //         fs.writeFileSync(newPath, fs.readFileSync(oldPath));

    //         // Insert file record into the database
    //         db.run(
    //             `INSERT INTO cert_files (user_id, path) VALUES (?, ?)`,
    //             [userId, file.newFilename],
    //             (dbErr) => {
    //                 if (dbErr) {
    //                     console.error('Error saving file record:', dbErr);
    //                     return res.status(500).json({ success: false, message: 'Database error' });
    //                 }
    //             }
    //         );

    //         newFiles.push({user_id: userId, path: file.newFilename});
    //     })

    //     res.status(200).json({ success: true, message: 'Files uploaded successfully', files: newFiles });
    // });
}