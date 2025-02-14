import express from 'express'; 
import cors from 'cors';  
import bodyParser from 'body-parser';  
import morgan from 'morgan';  
import router from '../routes/index.js';  
import passport from './passport.js';  
import path from 'path';  
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to initialize and configure the express application
const initializeExpress = () => {
    const app = express();  
    
    // Middleware setup
    app.use(cors());                                                         // Enabling Cross-Origin Resource Sharing for all routes
    app.use(bodyParser.json());                                              // Middleware to parse incoming JSON requests
    app.use(bodyParser.urlencoded({ extended: true }));                      // Middleware to parse URL-encoded data in requests
    app.use(morgan('dev'));                                                  // HTTP request logger in 'dev' format (useful for development)

    // Route setup
    app.use('/api', router);                                                 // All routes under '/api' will be handled by the imported router
    
    app.use(passport.initialize());                                          // Initialize passport authentication for the application

    // Static file serving setup
    app.use('/images', express.static(path.join(__dirname, '../uploads')));  // Serve static image files from the 'uploads' folder

    return app;  
}

export default initializeExpress;
