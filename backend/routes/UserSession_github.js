const express = require('express');
const router = express.Router();
const db = require('../db_github');

router.post('/', async (req, res) => {
    const { birth_year, gender, country } = req.body;

    const genderMap = {
        male: 1,
        female: 2,
        nonbinary: 3,
        gender_fluid: 4
    };

    //country ID holen oder neu anlegen
    let [rows] = await db.execute(
        'SELECT country_id FROM country WHERE country_name = ?',
        [country]
    );

    let countryId;
    if (rows.length === 0) {
        const [result] = await db.execute(
            'INSERT INTO country (country_name) VALUES (?)',
            [country]
        );
        countryId = result.insertId;
    } else {
        countryId = rows[0].country_id;
    }

    const [result] = await db.execute(
        `INSERT INTO voter_session (created_at, birth_year, gender_id, country_id)
         VALUES (NOW(), ?, ?, ?)`,
        [birth_year, genderMap[gender], countryId]
    );

    res.json({ session_id: result.insertId });
});

module.exports = router;
