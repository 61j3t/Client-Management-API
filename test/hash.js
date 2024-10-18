const bcrypt = require('bcrypt');

// Function to generate a hash for a given password
async function generateHash(password) {
    try {
        const saltRounds = 10; // Number of salt rounds for hashing
        const hash = await bcrypt.hash(password, saltRounds);
        console.log(`Password: ${password}`);
        console.log(`Hash: ${hash}`);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

// Example usage
const password = 'c1jet123'; // Replace with the password you want to hash
generateHash(password);