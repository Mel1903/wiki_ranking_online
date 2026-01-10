const express = require('express');
const router = express.Router();
const db = require('../db_github');

router.get('/', async (req, res) => {
    try {
        //zwei zufällige Personen holen
        const [persons] = await db.execute(`
            SELECT person_id
            FROM persons
            ORDER BY RAND()
            LIMIT 2
        `);

        if (persons.length < 2) {
            return res.status(500).json({ error: 'Not enough persons' });
        }

        const person1Id = persons[0].person_id;
        const person2Id = persons[1].person_id;

        //Matchup in DB eintragen
        const [result] = await db.execute(
            `INSERT INTO matchup (person1_id, person2_id, created_at)
             VALUES (?, ?, NOW())`,
            [person1Id, person2Id]
        );

        const matchupId = result.insertId;

        //volle Personendaten laden
        const [rows] = await db.execute(`
            SELECT
                m.matchup_id,

                p1.person_id AS person1_id,
                p1.name AS person1_name,
                p1.description AS person1_description,
                p1.image_url AS person1_image,
                p1.birth_date AS person1_birth,
                p1.death_date AS person1_death,
                g1.gender_name AS person1_gender,
                c1.country_name AS person1_country,
                p1.article_url AS person1_article,

                p2.person_id AS person2_id,
                p2.name AS person2_name,
                p2.description AS person2_description,
                p2.image_url AS person2_image,
                p2.birth_date AS person2_birth,
                p2.death_date AS person2_death,
                g2.gender_name AS person2_gender,
                c2.country_name AS person2_country,
                p2.article_url AS person2_article

            FROM matchup m
            JOIN persons p1 ON m.person1_id = p1.person_id
            JOIN persons p2 ON m.person2_id = p2.person_id
            LEFT JOIN gender g1 ON p1.gender_id = g1.gender_id
            LEFT JOIN gender g2 ON p2.gender_id = g2.gender_id
            LEFT JOIN person_country pc1 ON p1.person_id = pc1.person_id
            LEFT JOIN country c1 ON pc1.country_id = c1.country_id
            LEFT JOIN person_country pc2 ON p2.person_id = pc2.person_id
            LEFT JOIN country c2 ON pc2.country_id = c2.country_id
            WHERE m.matchup_id = ?
        `, [matchupId]);

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create matchup', details: err.message });
    }
});

module.exports = router;
