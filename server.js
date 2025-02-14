import dotenv from 'dotenv';
import initializeExpress from './config/express.js';
import initializeDB from './config/database.js';
dotenv.config();

const port = process.env.PORT || 8000;

initializeDB();
const app = initializeExpress();

app.listen(port, () => {
    console.log(`Server is Fire at https://localhost:${port}`);
});     