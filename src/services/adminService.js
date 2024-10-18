const db = require('../db/db');

async function getAdminCredentials(username) {
    try {
        const result = await db.query(
            'SELECT username, password_hash FROM admins WHERE username = $1',
            [username]
        );

        if (result.rows.length > 0) {
            console.log(result.rows);
            return result.rows[0];
        } else {
            throw new Error('Admin not found');
        }
    } catch (err) {
        console.error('Error fetching admin credentials:', err);
        throw err;
    }
}

module.exports = { getAdminCredentials };
