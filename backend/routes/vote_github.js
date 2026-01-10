//speichert Vote und passt Rating an
const express = require('express');
const router = express.Router();
const db = require('../db_github'); 

router.post('/', async (req, res) => {
    const { matchup_id, winner_person_id, session_id } = req.body;

    try {
        //Vote speichern
        await db.execute(
            `INSERT INTO vote (matchup_id, winner_person_id, session_id, voted_at)
             VALUES (?, ?, ?, NOW())`,
            [matchup_id, winner_person_id, session_id]
        );

        //beide Personen aus dem Matchup holen
        const [rows] = await db.execute(
            `SELECT person1_id, person2_id
             FROM matchup
             WHERE matchup_id = ?`,
            [matchup_id]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid matchup' });
        }

        const { person1_id, person2_id } = rows[0];

        //Gewinner & Verlierer bestimmen
        const winnerId = winner_person_id;
        const loserId = (winnerId === person1_id) ? person2_id : person1_id;

        const RATING_CHANGE = 10;

        //Gewinner: Rating erhöhen
        await db.execute(
            `UPDATE person_rating
             SET rating = rating + ?, last_updated = NOW()
             WHERE person_id = ?`,
            [RATING_CHANGE, winnerId]
        );

        //Verlierer: Rating senken
        await db.execute(
            `UPDATE person_rating
             SET rating = rating - ?, last_updated = NOW()
             WHERE person_id = ?`,
            [RATING_CHANGE, loserId]
        );

        //fertig
        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process vote' });
    }
});

module.exports = router;

