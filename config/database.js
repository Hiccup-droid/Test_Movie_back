import mongoose from "mongoose";

const initializeDB = () => {
    mongoose.connect(process.env.DB_URL).then(() => { console.log('DB connected...')});
}

export default initializeDB;