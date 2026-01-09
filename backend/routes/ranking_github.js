const express = require('express');
const router = express.Router();
const db = require('../db_github');

router.get('/top10', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                pr.person_id,
                pr.rating,
                p.name,
                p.image_url
            FROM person_rating pr
            JOIN persons p ON pr.person_id = p.person_id
            ORDER BY pr.rating DESC
            LIMIT 10
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load ranking' });
    }
});

module.exports = router;
