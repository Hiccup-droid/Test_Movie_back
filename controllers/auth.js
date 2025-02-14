import bcrypt from 'bcryptjs'; 
import crypto from 'crypto';  
import jwt from 'jsonwebtoken';  
import User from '../models/user.js';

/**
 * @description Registers a new user by validating input, hashing the password, and inserting the user into the database
 * @param req Request object containing user registration data
 * @param res Response object to send back the result of the registration process
 */
export const register = (req, res) => {
    const { username, password, email, accountType } = req.body;                            // Extract user input from the request body

    // Check if the username already exists in the database
    User.findOne({u_username: username}).then((user) => {
        if (user) {
            return res.status(400).json({ success: false, message: 'Username already exists' });          // Return error if username already exists
        }

        // Hash the password using bcrypt and generate a random token for email confirmation
        const hashedPassword = bcrypt.hashSync(password, 10);
        const confirmationToken = crypto.randomBytes(16).toString('hex');

        // Insert the new user data into the database
        const newUser = new User({
            u_username: username,
            u_email: email,
            u_account_type: accountType,
            u_password: hashedPassword,
            u_confrimation_token: confirmationToken
        });

        newUser.save().then(() => {
            return res.status(201).json({ success: true, message: 'User registered successfully' });  // Return success message upon successful registration
        })
    });
};

/**
 * @description Authenticates the user by verifying the password and generating a JWT token for further requests
 * @param req Request object containing login data
 * @param res Response object to send back the result of the login process
 */
export const login = (req, res) => {
    const { username, password } = req.body;                                       // Extract username and password from the request body

    // Check if the username exists in the database
    User
    .findOne({u_username: username})
    .then((user) => {
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });      // Return error if user is not found
        }

        // Compare the provided password with the stored hashed password
        if (!bcrypt.compareSync(password, user.u_password)) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });  // Return error if passwords don't match
        }

        // Generate a JWT token with the user's details, using a secret key and setting an expiration time
        let payload = { 
            _id: user._id, 
            u_email: user.u_email, 
            u_username: user.u_username, 
            accountType: 
            user.u_account_type 
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        // Send back the success message along with the token and user details
        res.status(200).json({ success: true, message: 'Login successful', token: token, user: payload });
    });
};

/**
 * @description Confirms the user's email by validating the confirmation token and updating the user status in the database
 * @param req Request object containing the token to confirm the user's email
 * @param res Response object to send back the result of the email confirmation process
 */
export const confirmEmail = (req, res) => {
    const { token } = req.params;  // Extract the confirmation token from the request parameters

    // Look for the user with the corresponding confirmation token
    User.findOne({confirmation_toekn: token}, (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });  // Handle database errors
        }

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token' });  // Return error if the token is invalid
        }

        if (user.confirmed) {
            return res.status(400).json({ success: false, message: 'Account already confirmed' });  // Return error if the account is already confirmed
        }

        // Update the user account to mark it as confirmed and clear the confirmation token
        user.u_confirmed = true;
        user.save((err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to confirm account' });  // Handle errors during account confirmation
                }

                // Send success message after successfully confirming the user's email
                res.status(200).json({ success: true, message: 'Account successfully confirmed' });
            }
        );
    });
};
