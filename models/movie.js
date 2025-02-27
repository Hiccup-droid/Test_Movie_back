import mongoose, { Schema } from "mongoose";

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    publish_year: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: true
    }
})

const Movie = mongoose.model('app_movie', MovieSchema);

export default Movie;