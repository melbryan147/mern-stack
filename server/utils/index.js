

require('dotenv').config({path: '.env'});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Load secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key"; // Use .env in production

// Function to create a JWT with hashed password
async function createToken(role_id, email, reportBy) {
    try {
        // 1. Hash the password
        // const hashedPassword = await bcrypt.hash(plainPassword, 12);

        // 2. Create payload (never store plain password)
        const payload = {
            role_id,
            email
        };

        // 3. Sign the JWT
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        return token;
    } catch (err) {
        console.error("Error creating token:", err.message);
        throw err;
    }
}

// Function to verify and decode a JWT
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error("Invalid or expired token:", err.message);
        return null;
    }
}


async function encryptPass(pass) {
    try{
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds)
        const hashedPassword = await bcrypt.hash(pass, salt);
        return hashedPassword
    } catch (error) {
        console.log(error)   
    }

}


async function checkUser(plainTextPass, hash) {
    try{
        const ismatch = await bcrypt.compare(plainTextPass, hash);
        return ismatch
    } catch (error) {
        console.log(error)   
    }

}


// Example usage
// (async () => {
//     const username = "john_doe";
//     const password = "MySecurePassword123!";

//     // Create token
//     const token = await createToken(username, password);
//     console.log("Generated JWT:", token);

//     // Verify token
//     const decoded = verifyToken(token);
//     console.log("Decoded Payload:", decoded);
// })();


module.exports = { createToken, verifyToken, encryptPass, checkUser };
