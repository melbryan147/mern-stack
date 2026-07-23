const db = require('../db');

async function createSession(userId, token, ip, agent, expiresAt) {
    try {
        await db.pool.execute(
            'INSERT INTO sessions (session_id, user_id, token, ip_address, user_agent, expires_at) VALUES (UUID(), ?, ?, ?, ?, ?)',
            [userId, token, ip, agent, expiresAt]
        );
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
}

async function findSession(token) {
    try {
        const [rows] = await db.pool.execute('SELECT * FROM sessions WHERE token = ?', [token]);
        return rows[0];
    } catch (error) {
        console.error('Error finding session:', error);
        throw error;
    }
}

module.exports = { createSession, findSession };
