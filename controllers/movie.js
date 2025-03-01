import formidable from "formidable";
import Movie from "../models/movie.js";
import fs from "fs";
import path from "path";

export const GetMovies = async (req, res) => {
    const { page } = req.params;

    const count = await Movie.countDocuments({});

    Movie.find()
        .skip(page * 8)
        .limit(8)
        .then(data => {
            return res.status(200).json({ success: true, data: { data, count } });
        })
}

export const GetMovie = (req, res) => {
    const { id } = req.params;
    Movie.findById(id)
        .then(data => {
            return res.status(200).json({ success: true, data });
        })
}

export const EditMovie = (req, res) => {
    const form = formidable({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(500).send("eat shit");
        }
        console.log(fields, files);
        fs.writeFileSync(path.join(import.meta.dirname, "../uploads", files.file[0].newFilename), fs.readFileSync(files.file[0].filepath));
        Movie.updateOne({ _id: fields.id[0] }, { title: fields.title[0], publish_year: fields.publishyear[0], img_url: files.file[0].newFilename })
            .then((data) => { return res.status(200).json({ success: true, message: 'success' }) });
    })
}

export const AddMoive = (req, res) => {
    const form = formidable({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(500).send("eat shit");
        }
        const newMoive = new Movie({
            title: fields.title[0],
            publish_year: fields.publishyear[0],
            img_url: files.file[0].newFilename
        });
        console.log(newMoive)
        fs.writeFileSync(path.join(import.meta.dirname, "../uploads", files.file[0].newFilename), fs.readFileSync(files.file[0].filepath));
        newMoive.save()
            .then(() => { return res.status(200).json({ success: true, message: 'success' }) })
            .catch(err => console.log(err));


    })

}